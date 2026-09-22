<?php

namespace App\Console\Commands;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

/**
 * Fabrique les questions du quiz à partir de Wikidata.
 *
 * Chaque « collecte » est une requête SPARQL + un gabarit de question. Les mauvaises
 * réponses sont piochées parmi les autres valeurs de la même collecte, donc elles sont
 * toujours du même type que la bonne (un pays contre des pays, un stade contre des stades).
 */
class GenererQuestions extends Command
{
    protected $signature = 'quiz:generer
        {--sport= : Ne traiter qu\'un sport (foot, basket, tennis, multi)}
        {--cible=1000 : Nombre de questions visé par sport}
        {--garder : Conserver les questions déjà en base}';

    protected $description = 'Génère les questions du quiz depuis Wikidata';

    private const ENDPOINT = 'https://query.wikidata.org/sparql';

    /** Paliers de notoriété : [difficulté, minimum de pages liées, maximum]. */
    private const PALIERS = [
        ['facile', 45, 100000],
        ['moyen', 20, 44],
        ['difficile', 8, 19],
    ];

    /** Métiers Wikidata par sport. */
    private const METIERS = [
        'foot' => ['wd:Q937857'],
        'basket' => ['wd:Q3665646'],
        'tennis' => ['wd:Q10833314'],
        'multi' => ['wd:Q2309784', 'wd:Q10843402', 'wd:Q11513337', 'wd:Q10841764', 'wd:Q13141064', 'wd:Q12840545'],
    ];

    public function handle(): int
    {
        $sports = $this->option('sport') ? [$this->option('sport')] : array_keys(self::METIERS);
        $cible = (int) $this->option('cible');

        if (! $this->option('garder')) {
            Question::truncate();
            $this->warn('Questions existantes supprimées.');
        }

        foreach ($sports as $slug) {
            $categorie = Categorie::where('slug', $slug)->first();
            if (! $categorie) {
                $this->error("Sport inconnu : $slug");
                continue;
            }

            $this->info("=== {$categorie->nom} (cible : $cible)");
            $dejaVues = Question::where('categorie_id', $categorie->id)->pluck('question')->flip();
            $total = $dejaVues->count();
            $collectes = $this->collectes($slug);

            // Premier passage : autant de questions par difficulté, et à l'intérieur une
            // part égale pour chaque type de question. Sans ça, une difficulté peut finir
            // vide et le quiz n'a plus rien à proposer.
            $parDifficulte = (int) floor($cible / count(self::PALIERS));
            foreach (self::PALIERS as $palier) {
                $this->remplir($collectes, $categorie->id, $cible, $parDifficulte, [$palier], $total, $dejaVues);
            }

            // Second passage sans quota, pour combler ce que Wikidata n'a pas donné
            if ($total < $cible) {
                $this->remplir($collectes, $categorie->id, $cible, PHP_INT_MAX, self::PALIERS, $total, $dejaVues);
            }

            $this->info("  {$categorie->nom} : $total questions");
        }

        return self::SUCCESS;
    }

    /**
     * Parcourt les collectes et insère les questions, sans dépasser la cible
     * ni le quota accordé à chaque type de question.
     */
    private function remplir(array $collectes, int $categorieId, int $cible, int $cibleLot, array $paliers, int &$total, $dejaVues): void
    {
        $obtenu = 0;
        $quota = $cibleLot === PHP_INT_MAX ? PHP_INT_MAX : (int) ceil($cibleLot / max(1, count($collectes)));

        foreach ($collectes as $collecte) {
            if ($total >= $cible || $obtenu >= $cibleLot) return;
            $apporte = 0;

            foreach ($paliers as [$difficulte, $min, $max]) {
                if ($total >= $cible || $obtenu >= $cibleLot || $apporte >= $quota) break;

                $lignes = $this->interroger($collecte['requete']($min, $max), $collecte['nom'] . " / $difficulte");
                if ($lignes === null) continue;

                $place = min($cible - $total, $cibleLot - $obtenu, $quota - $apporte);
                $questions = $this->fabriquer($lignes, $collecte, $difficulte, $categorieId, $dejaVues, $place);
                if ($questions === []) continue;

                foreach (array_chunk($questions, 200) as $paquet) {
                    Question::insert($paquet);
                }

                $apporte += count($questions);
                $obtenu += count($questions);
                $total += count($questions);
                $this->line("    +" . count($questions) . " questions en $difficulte (total : $total)");
            }
        }
    }

    /**
     * Transforme les lignes SPARQL en questions prêtes à insérer.
     */
    private function fabriquer(array $lignes, array $collecte, string $difficulte, int $categorieId, $dejaVues, int $place): array
    {
        // Les valeurs de la collecte servent de réservoir à mauvaises réponses
        $reservoir = [];
        foreach ($lignes as $ligne) {
            $valeur = $ligne['valLabel']['value'] ?? null;
            if ($valeur !== null && ! $this->sansLibelle($valeur)) {
                $reservoir[$this->nettoyer($valeur)] = true;
            }
        }
        $reservoir = array_keys($reservoir);

        $questions = [];
        $maintenant = now();

        shuffle($lignes); // on ne garde pas toujours les mêmes quand la place est limitée

        foreach ($lignes as $ligne) {
            if (count($questions) >= $place) break;

            $sujet = $ligne['itemLabel']['value'] ?? null;
            $valeur = $ligne['valLabel']['value'] ?? null;
            if ($sujet === null || $valeur === null) continue;
            if ($this->sansLibelle($sujet) || $this->sansLibelle($valeur)) continue;
            $valeur = $this->nettoyer($valeur);

            $texte = ($collecte['gabarit'])($sujet);
            if ($dejaVues->has($texte)) continue;

            $leurres = ($collecte['leurres'] ?? null)
                ? ($collecte['leurres'])($valeur)
                : $this->leurresDepuisReservoir($valeur, $reservoir);

            if (count($leurres) < 3) continue;

            $dejaVues[$texte] = true;
            $questions[] = [
                'categorie_id' => $categorieId,
                'question' => mb_substr($texte, 0, 255),
                'bonne_reponse' => mb_substr($valeur, 0, 255),
                'mauvaise_1' => mb_substr($leurres[0], 0, 255),
                'mauvaise_2' => mb_substr($leurres[1], 0, 255),
                'mauvaise_3' => mb_substr($leurres[2], 0, 255),
                'difficulte' => $difficulte,
                'created_at' => $maintenant,
                'updated_at' => $maintenant,
            ];
        }

        return $questions;
    }

    /** Wikidata renvoie des noms officiels parfois lourds : on les remet en langage courant. */
    private const LIBELLES = [
        'république populaire de Chine' => 'Chine',
        'Royaume de Danemark' => 'Danemark',
        "États-Unis d'Amérique" => 'États-Unis',
        'royaume des Pays-Bas' => 'Pays-Bas',
        'république de Corée' => 'Corée du Sud',
        "république fédérale d'Allemagne" => 'Allemagne',
        'Union des républiques socialistes soviétiques' => 'URSS',
        'république française' => 'France',
        'république socialiste fédérative de Yougoslavie' => 'Yougoslavie',
        'république italienne' => 'Italie',
    ];

    private function nettoyer(string $valeur): string
    {
        $valeur = self::LIBELLES[$valeur] ?? $valeur;

        return mb_strtoupper(mb_substr($valeur, 0, 1)) . mb_substr($valeur, 1);
    }

    /** Trois mauvaises réponses tirées du réservoir, différentes de la bonne. */
    private function leurresDepuisReservoir(string $bonne, array $reservoir): array
    {
        $autres = array_values(array_filter($reservoir, fn ($v) => $v !== $bonne));
        if (count($autres) < 3) return [];
        shuffle($autres);

        return array_slice($autres, 0, 3);
    }

    /** Un libellé absent revient sous la forme Q12345 : la ligne est inutilisable. */
    private function sansLibelle(string $valeur): bool
    {
        return (bool) preg_match('/^Q\d+$/', $valeur);
    }

    /**
     * Le paquet de certificats à utiliser pour HTTPS.
     *
     * PHP sous Windows n'en embarque pas : sans ça, cURL refuse le certificat de Wikidata.
     * On prend celui du .env, sinon celui livré avec Git, sinon on laisse PHP se débrouiller.
     */
    private function certificats(): ?string
    {
        $pistes = array_filter([
            env('WIKIDATA_CA_BUNDLE'),
            storage_path('app/cacert.pem'),
            'C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt',
            '/etc/ssl/certs/ca-certificates.crt',
        ]);

        foreach ($pistes as $piste) {
            if (is_file($piste)) return $piste;
        }

        return null;
    }

    /** Envoie la requête à Wikidata et renvoie les lignes, ou null en cas d'échec. */
    private function interroger(string $requete, string $nom): ?array
    {
        $this->line("  → $nom");
        $certificats = $this->certificats();

        try {
            $requeteHttp = Http::withHeaders([
                'Accept' => 'application/sparql-results+json',
                'User-Agent' => 'QuizBall/1.0 (projet etudiant Ynov; https://github.com/leo-dpy/Quizball)',
            ])->timeout(120);

            if ($certificats !== null) {
                $requeteHttp = $requeteHttp->withOptions(['verify' => $certificats]);
            }

            $reponse = $requeteHttp->get(self::ENDPOINT, ['query' => $requete]);
        } catch (\Throwable $e) {
            $this->error('    Wikidata injoignable : ' . $e->getMessage());
            return null;
        }

        if (! $reponse->successful()) {
            $this->error('    Wikidata a répondu ' . $reponse->status());
            return null;
        }

        return $reponse->json('results.bindings') ?? [];
    }

    /**
     * Les collectes d'un sport : requête SPARQL paramétrée par palier + gabarit de question.
     *
     * @return array<int, array{nom: string, requete: callable, gabarit: callable, leurres?: callable}>
     */
    private function collectes(string $slug): array
    {
        $metiers = implode(' ', self::METIERS[$slug]);
        $label = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }';

        $collectes = [
            [
                'nom' => 'nationalité',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                    VALUES ?metier { $metiers }
                    ?item wdt:P106 ?metier ; wdt:P27 ?val ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    FILTER NOT EXISTS { ?item wdt:P27 ?autre . FILTER(?autre != ?val) }
                    $label
                } LIMIT 500",
                'gabarit' => fn ($sujet) => "De quelle nationalité est $sujet ?",
            ],
            [
                'nom' => 'année de naissance',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel (STR(YEAR(?date)) AS ?valLabel) WHERE {
                    VALUES ?metier { $metiers }
                    ?item wdt:P106 ?metier ; wdt:P569 ?date ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    $label
                } LIMIT 500",
                'gabarit' => fn ($sujet) => "En quelle année est né(e) $sujet ?",
                'leurres' => function ($bonne) {
                    $annee = (int) $bonne;
                    $ecarts = [-7, -4, -3, -2, 2, 3, 4, 7];
                    shuffle($ecarts);

                    return array_map(fn ($e) => (string) ($annee + $e), array_slice($ecarts, 0, 3));
                },
            ],
            [
                'nom' => 'ville de naissance',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                    VALUES ?metier { $metiers }
                    ?item wdt:P106 ?metier ; wdt:P19 ?val ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    FILTER NOT EXISTS { ?item wdt:P19 ?autre . FILTER(?autre != ?val) }
                    $label
                } LIMIT 500",
                'gabarit' => fn ($sujet) => "Dans quelle ville est né(e) $sujet ?",
            ],
        ];

        // Le poste n'a de sens que pour les sports collectifs
        if (in_array($slug, ['foot', 'basket'], true)) {
            $collectes[] = [
                'nom' => 'poste',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                    VALUES ?metier { $metiers }
                    ?item wdt:P106 ?metier ; wdt:P413 ?val ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    FILTER NOT EXISTS { ?item wdt:P413 ?autre . FILTER(?autre != ?val) }
                    $label
                } LIMIT 500",
                'gabarit' => fn ($sujet) => "À quel poste joue $sujet ?",
            ];
        }

        // Les clubs de football donnent deux collectes de plus
        if ($slug === 'foot') {
            $collectes[] = [
                'nom' => 'stade du club',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                    ?item wdt:P31/wdt:P279* wd:Q476028 ; wdt:P115 ?val ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    FILTER NOT EXISTS { ?item wdt:P115 ?autre . FILTER(?autre != ?val) }
                    $label
                } LIMIT 400",
                'gabarit' => fn ($sujet) => "Dans quel stade joue le club $sujet ?",
            ];
            $collectes[] = [
                'nom' => 'ville du club',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                    ?item wdt:P31/wdt:P279* wd:Q476028 ; wdt:P159 ?val ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    FILTER NOT EXISTS { ?item wdt:P159 ?autre . FILTER(?autre != ?val) }
                    $label
                } LIMIT 400",
                'gabarit' => fn ($sujet) => "Dans quelle ville est basé le club $sujet ?",
            ];
        }

        return $collectes;
    }
}
