<?php

namespace App\Console\Commands;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GenererQuestions extends Command
{
    protected $signature = 'quiz:generer
        {--sport= : Ne traiter qu\'un sport (foot, basket, tennis, multi)}
        {--cible=400 : Nombre de questions visé par sport}';

    protected $description = 'Génère les questions du quiz depuis Wikidata';

    private const ENDPOINT = 'https://query.wikidata.org/sparql';

    private const PALIERS = [
        ['facile', 45, 100000],
        ['moyen', 20, 44],
        ['difficile', 8, 19],
    ];

    private const METIERS = [
        'foot' => ['wd:Q937857'],
        'basket' => ['wd:Q3665646'],
        'tennis' => ['wd:Q10833314'],
        'multi' => ['wd:Q2309784', 'wd:Q10843402', 'wd:Q11513337', 'wd:Q10841764', 'wd:Q13141064', 'wd:Q12840545'],
    ];

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

    public function handle(): int
    {
        $sports = $this->option('sport') ? [$this->option('sport')] : array_keys(self::METIERS);
        $cible = (int) $this->option('cible');

        $efface = Question::where('source', 'wikidata')
            ->when($this->option('sport'), function ($requete) {
                $requete->whereIn('categorie_id', Categorie::where('slug', $this->option('sport'))->pluck('id'));
            })
            ->delete();
        $this->warn("$efface questions générées supprimées (les questions écrites à la main sont conservées).");

        foreach ($sports as $slug) {
            $categorie = Categorie::where('slug', $slug)->first();
            if (! $categorie) {
                $this->error("Sport inconnu : $slug");
                continue;
            }

            $this->info("=== {$categorie->nom} (cible : $cible)");
            $dejaVues = Question::where('categorie_id', $categorie->id)->pluck('question')->flip();
            $total = 0;
            $collectes = $this->collectes($slug);

            $palmares = array_values(array_filter($collectes, fn ($c) => ($c['palmares'] ?? false)));
            $profils = array_values(array_filter($collectes, fn ($c) => ! ($c['palmares'] ?? false)));

            $this->remplirPalmares($palmares, $categorie->id, $cible, $total, $dejaVues);

            if ($total < $cible && $profils !== []) {
                $parDifficulte = (int) floor(($cible - $total) / count(self::PALIERS));
                foreach (self::PALIERS as $palier) {
                    $this->remplirProfils($profils, $categorie->id, $cible, $parDifficulte, [$palier], $total, $dejaVues);
                }
                if ($total < $cible) {
                    $this->remplirProfils($profils, $categorie->id, $cible, PHP_INT_MAX, self::PALIERS, $total, $dejaVues);
                }
            }

            $this->info("  {$categorie->nom} : $total questions générées");
        }

        return self::SUCCESS;
    }

    private function remplirPalmares(array $collectes, int $categorieId, int $cible, int &$total, $dejaVues): void
    {
        foreach ($collectes as $collecte) {
            if ($total >= $cible) return;

            $lignes = $this->interroger($collecte['requete'](), $collecte['nom']);
            if ($lignes === null) continue;

            $questions = $this->fabriquer($lignes, $collecte, null, $categorieId, $dejaVues, $cible - $total);
            if ($questions === []) continue;

            foreach (array_chunk($questions, 200) as $paquet) {
                Question::insert($paquet);
            }

            $total += count($questions);
            $this->line('    +' . count($questions) . " questions (total : $total)");
        }
    }

    private function remplirProfils(array $collectes, int $categorieId, int $cible, int $cibleLot, array $paliers, int &$total, $dejaVues): void
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
                $this->line('    +' . count($questions) . " questions en $difficulte (total : $total)");
            }
        }
    }

    private function fabriquer(array $lignes, array $collecte, ?string $difficulte, int $categorieId, $dejaVues, int $place): array
    {
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
        shuffle($lignes);

        foreach ($lignes as $ligne) {
            if (count($questions) >= $place) break;

            $sujet = $ligne['itemLabel']['value'] ?? null;
            $valeur = $ligne['valLabel']['value'] ?? null;
            if ($sujet === null || $valeur === null) continue;
            if ($this->sansLibelle($sujet) || $this->sansLibelle($valeur)) continue;

            $valeur = $this->nettoyer($valeur);
            $texte = ($collecte['gabarit'])($this->nettoyer($sujet));
            if ($dejaVues->has($texte)) continue;

            $niveau = $difficulte ?? $this->difficulteParAnnee($sujet);

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
                'difficulte' => $niveau,
                'source' => 'wikidata',
                'created_at' => $maintenant,
                'updated_at' => $maintenant,
            ];
        }

        return $questions;
    }

    private function difficulteParAnnee(string $sujet): string
    {
        if (! preg_match('/(\d{4})/', $sujet, $trouve)) return 'moyen';
        $annee = (int) $trouve[1];

        if ($annee >= 2005) return 'facile';
        if ($annee >= 1980) return 'moyen';

        return 'difficile';
    }

    private function nettoyer(string $valeur): string
    {
        $valeur = self::LIBELLES[$valeur] ?? $valeur;

        $valeur = preg_replace('/^équipe (?:d\'|de |du |des )(.+?) (?:de |masculine de |féminine de )(?:football|basket-ball|rugby à XV|handball)$/iu', '$1', $valeur);

        return mb_strtoupper(mb_substr($valeur, 0, 1)) . mb_substr($valeur, 1);
    }

    private function article(string $libelle): string
    {
        $articles = [
            'tournoi' => 'le ',
            'saison' => 'la ',
            'championnat' => 'le ',
            'coupe' => 'la ',
            'ligue' => 'la ',
            'open' => "l'",
            'masters' => 'le ',
        ];

        $premier = mb_strtolower(mb_substr($libelle, 0, mb_strpos($libelle . ' ', ' ')));
        $libelle = mb_strtolower(mb_substr($libelle, 0, 1)) . mb_substr($libelle, 1);

        return isset($articles[$premier]) ? $articles[$premier] . $libelle : $libelle;
    }

    private function leurresDepuisReservoir(string $bonne, array $reservoir): array
    {
        $autres = array_values(array_filter($reservoir, fn ($v) => $v !== $bonne));
        if (count($autres) < 3) return [];
        shuffle($autres);

        return array_slice($autres, 0, 3);
    }

    private function sansLibelle(string $valeur): bool
    {
        return (bool) preg_match('/^Q\d+$/', $valeur);
    }

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

    private function vainqueurs(string $competition, bool $humain, int $limite = 200): string
    {
        $type = $humain ? '?vainqueur wdt:P31 wd:Q5 .' : '';
        $typeAutre = $humain ? '?autre wdt:P31 wd:Q5 .' : '';

        return "SELECT ?itemLabel ?valLabel WHERE {
            ?item wdt:P3450 $competition ; wdt:P1346 ?vainqueur .
            $type
            FILTER NOT EXISTS { ?item wdt:P1346 ?autre . $typeAutre FILTER(?autre != ?vainqueur) }
            BIND(?vainqueur AS ?val)
            SERVICE wikibase:label { bd:serviceParam wikibase:language \"fr,en\". }
        } LIMIT $limite";
    }

    private function laureats(string $trophee, ?string $genre = null, int $limite = 200): string
    {
        $filtreGenre = $genre ? "?val wdt:P21 $genre ." : '';
        $filtreGenreAutre = $genre ? "?autre wdt:P21 $genre ." : '';

        return "SELECT (STR(?annee) AS ?itemLabel) ?valLabel WHERE {
            ?val p:P166 ?st . ?st ps:P166 $trophee ; pq:P585 ?date .
            $filtreGenre
            BIND(YEAR(?date) AS ?annee)
            FILTER NOT EXISTS { ?autre p:P166 ?st2 . ?st2 ps:P166 $trophee ; pq:P585 ?date2 .
                $filtreGenreAutre
                FILTER(YEAR(?date2) = ?annee && ?autre != ?val) }
            SERVICE wikibase:label { bd:serviceParam wikibase:language \"fr,en\". }
        } LIMIT $limite";
    }

    private function collectes(string $slug): array
    {
        $metiers = implode(' ', self::METIERS[$slug]);
        $label = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }';

        $palmares = [
            'foot' => [
                ['nom' => 'Coupe du monde', 'requete' => fn () => $this->vainqueurs('wd:Q19317', false),
                    'gabarit' => fn ($s) => 'Quelle sélection a remporté ' . $this->article($s) . ' ?'],
                ['nom' => 'Ligue des champions', 'requete' => fn () => $this->vainqueurs('wd:Q18756', false),
                    'gabarit' => fn ($s) => 'Quel club a remporté ' . $this->article($s) . ' ?'],
                ['nom' => 'Championnat d\'Europe', 'requete' => fn () => $this->vainqueurs('wd:Q260858', false),
                    'gabarit' => fn ($s) => 'Quelle sélection a remporté ' . $this->article($s) . ' ?'],
                ['nom' => 'Ballon d\'Or', 'requete' => fn () => $this->laureats('wd:Q166177', 'wd:Q6581097'),
                    'gabarit' => fn ($s) => "Qui a remporté le Ballon d'Or masculin $s ?"],
            ],
            'basket' => [
                ['nom' => 'Champions NBA', 'requete' => fn () => $this->vainqueurs('wd:Q155223', false, 300),
                    'gabarit' => fn ($s) => 'Quelle équipe a été championne NBA lors de ' . $this->article($s) . ' ?'],
                ['nom' => 'MVP NBA', 'requete' => fn () => $this->laureats('wd:Q222047'),
                    'gabarit' => fn ($s) => "Qui a été élu MVP de la saison NBA $s ?"],
            ],
            'tennis' => [
                ['nom' => 'Vainqueurs de tournois', 'requete' => fn () => "SELECT ?itemLabel ?valLabel WHERE {
                    ?item wdt:P31 wd:Q47345468 ; wdt:P1346 ?val ; wikibase:sitelinks ?s .
                    ?val wdt:P31 wd:Q5 ; wikibase:sitelinks ?sv .
                    FILTER(?s >= 4 && ?sv >= 15)
                    FILTER NOT EXISTS { ?item wdt:P1346 ?autre . ?autre wdt:P31 wd:Q5 . FILTER(?autre != ?val) }
                    $label
                } LIMIT 400", 'gabarit' => fn ($s) => 'Qui a remporté ' . $this->article($s) . ' ?'],
            ],
            'multi' => [
                ['nom' => 'Champions du monde de F1', 'requete' => fn () => $this->vainqueurs('wd:Q1968', true),
                    'gabarit' => fn ($s) => 'Quel pilote a remporté ' . $this->article($s) . ' ?'],
            ],
        ];

        $collectes = array_map(fn ($c) => $c + ['palmares' => true], $palmares[$slug] ?? []);

        $collectes[] = [
            'nom' => 'nationalité',
            'requete' => fn ($min, $max) => "SELECT ?itemLabel ?valLabel WHERE {
                VALUES ?metier { $metiers }
                ?item wdt:P106 ?metier ; wdt:P27 ?val ; wikibase:sitelinks ?s .
                FILTER(?s >= $min && ?s <= $max)
                FILTER NOT EXISTS { ?item wdt:P27 ?autre . FILTER(?autre != ?val) }
                $label
            } LIMIT 500",
            'gabarit' => fn ($sujet) => "De quelle nationalité est $sujet ?",
        ];

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
                'nom' => 'fondation du club',
                'requete' => fn ($min, $max) => "SELECT ?itemLabel (STR(YEAR(?date)) AS ?valLabel) WHERE {
                    ?item wdt:P31/wdt:P279* wd:Q476028 ; wdt:P571 ?date ; wikibase:sitelinks ?s .
                    FILTER(?s >= $min && ?s <= $max)
                    $label
                } LIMIT 400",
                'gabarit' => fn ($sujet) => "En quelle année le club $sujet a-t-il été fondé ?",
                'leurres' => function ($bonne) {
                    $annee = (int) $bonne;
                    $ecarts = [-11, -8, -5, -3, 3, 5, 8, 11];
                    shuffle($ecarts);

                    return array_map(fn ($e) => (string) ($annee + $e), array_slice($ecarts, 0, 3));
                },
            ];
        }

        return $collectes;
    }
}
