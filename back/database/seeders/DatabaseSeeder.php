<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Partie;
use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Remplit la base : 4 sports, 15 questions chacun (5 par difficulté).
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Partie::truncate();
        Question::truncate();
        Categorie::truncate();
        Schema::enableForeignKeyConstraints();

        $sports = [
            ['slug' => 'foot', 'nom' => 'Football', 'couleur' => '#01C187'],
            ['slug' => 'basket', 'nom' => 'Basket', 'couleur' => '#FE8D07'],
            ['slug' => 'tennis', 'nom' => 'Tennis', 'couleur' => '#FFC93C'],
            ['slug' => 'multi', 'nom' => 'Tous sports', 'couleur' => '#3FA9FF'],
        ];

        $categories = [];
        foreach ($sports as $sport) {
            $categories[$sport['slug']] = Categorie::create($sport);
        }

        foreach ($this->questions() as $slug => $questions) {
            foreach ($questions as $question) {
                Question::create([
                    'categorie_id' => $categories[$slug]->id,
                    'question' => $question[0],
                    'bonne_reponse' => $question[1],
                    'mauvaise_1' => $question[2],
                    'mauvaise_2' => $question[3],
                    'mauvaise_3' => $question[4],
                    'difficulte' => $question[5],
                ]);
            }
        }
    }

    /**
     * Les questions, par sport.
     * Format : [question, bonne réponse, leurre, leurre, leurre, difficulté].
     *
     * @return array<string, array<int, array<int, string>>>
     */
    private function questions(): array
    {
        return [
            'foot' => [
                ['Combien de joueurs par équipe y a-t-il sur le terrain au football ?', '11', '10', '12', '9', 'facile'],
                ['Quel pays a organisé la Coupe du monde 1998 ?', 'La France', "L'Italie", "L'Espagne", "L'Allemagne", 'facile'],
                ["Quelle est la couleur du carton qui signifie l'expulsion ?", 'Rouge', 'Jaune', 'Vert', 'Bleu', 'facile'],
                ['Quel club est surnommé « les Merengues » ?', 'Le Real Madrid', 'Le FC Barcelone', "L'Atlético Madrid", 'Le Séville FC', 'facile'],
                ['Combien de temps dure un match de football dans le temps réglementaire ?', '90 minutes', '80 minutes', '100 minutes', '120 minutes', 'facile'],
                ["Quel joueur a remporté le Ballon d'Or 2022 ?", 'Karim Benzema', 'Lionel Messi', 'Robert Lewandowski', 'Kylian Mbappé', 'moyen'],
                ['Quel club a remporté la Ligue des champions 2020 ?', 'Le Bayern Munich', 'Le PSG', 'Liverpool', 'Le Real Madrid', 'moyen'],
                ['Dans quel club Zinédine Zidane a-t-il terminé sa carrière de joueur ?', 'Le Real Madrid', 'La Juventus', 'Les Girondins de Bordeaux', "L'Olympique de Marseille", 'moyen'],
                ["Quel pays a gagné l'Euro 2020, disputé en 2021 ?", "L'Italie", "L'Angleterre", 'La France', "L'Espagne", 'moyen'],
                ["Qui est le meilleur buteur de l'histoire de l'équipe de France ?", 'Olivier Giroud', 'Thierry Henry', 'Michel Platini', 'Antoine Griezmann', 'moyen'],
                ['En quelle année a eu lieu la première Coupe du monde de football ?', '1930', '1926', '1934', '1938', 'difficile'],
                ['Quel club détient le record de victoires en Ligue des champions ?', 'Le Real Madrid', 'Le Milan AC', 'Le Bayern Munich', 'Liverpool', 'difficile'],
                ['Qui a marqué le but de la « Main de Dieu » en 1986 ?', 'Diego Maradona', 'Pelé', 'Zico', 'Michel Platini', 'difficile'],
                ['Quel gardien a remporté le trophée Yachine en 2021 ?', 'Gianluigi Donnarumma', 'Édouard Mendy', 'Manuel Neuer', 'Thibaut Courtois', 'difficile'],
                ['Quel club français a remporté la Ligue des champions en 1993 ?', "L'Olympique de Marseille", 'Le PSG', "L'AS Monaco", "L'Olympique Lyonnais", 'difficile'],
                ['Quel pays a remporté la Coupe du monde 2018 ?', 'La France', 'La Croatie', 'Le Brésil', "L'Allemagne", 'facile'],
                ['Combien de points rapporte une victoire en Ligue 1 ?', '3', '2', '4', '1', 'facile'],
                ['Comment appelle-t-on trois buts marqués par le même joueur dans un match ?', 'Un triplé', 'Un doublé', 'Un quadruplé', 'Un but en or', 'facile'],
                ['Quel club joue ses matchs au Parc des Princes ?', 'Le PSG', "L'Olympique de Marseille", "L'Olympique Lyonnais", 'Le LOSC', 'facile'],
                ['Quelle est la forme du terrain de football ?', 'Un rectangle', 'Un carré', 'Un ovale', 'Un losange', 'facile'],
                ['Quel club anglais joue à Old Trafford ?', 'Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'moyen'],
                ['Quel pays a remporté la Coupe du monde 2022 ?', "L'Argentine", 'La France', 'Le Brésil', 'Le Maroc', 'moyen'],
                ['Combien de Coupes du monde le Brésil a-t-il gagnées ?', '5', '4', '3', '6', 'moyen'],
                ['Quel entraîneur a mené la France au titre mondial en 2018 ?', 'Didier Deschamps', 'Raymond Domenech', 'Laurent Blanc', 'Aimé Jacquet', 'moyen'],
                ['Dans quel pays joue-t-on la Bundesliga ?', "En Allemagne", 'En Autriche', 'Aux Pays-Bas', 'En Suisse', 'moyen'],
                ['Quel joueur a marqué 50 buts en une saison de Liga en 2011-2012 ?', 'Lionel Messi', 'Cristiano Ronaldo', 'Luis Suárez', 'Karim Benzema', 'difficile'],
                ["Quelle équipe a remporté l'Euro 2004 ?", 'La Grèce', 'Le Portugal', 'La France', "L'Italie", 'difficile'],
                ["Combien de Ballons d'Or Lionel Messi a-t-il remportés ?", '8', '7', '6', '5', 'difficile'],
                ['Quel stade a accueilli la finale de la Coupe du monde 1998 ?', 'Le Stade de France', 'Le Parc des Princes', 'Le Vélodrome', 'Wembley', 'difficile'],
                ['Quel club a réalisé le triplé championnat-coupe-Ligue des champions en 2010 ?', "L'Inter Milan", 'Le FC Barcelone', 'Le Bayern Munich', 'Le Real Madrid', 'difficile'],
            ],
            'basket' => [
                ['Combien de points vaut un panier marqué derrière la ligne à trois points ?', '3', '2', '1', '4', 'facile'],
                ['Combien de joueurs par équipe y a-t-il sur le terrain au basket ?', '5', '6', '7', '4', 'facile'],
                ['Quelle est la grande ligue professionnelle de basket aux États-Unis ?', 'La NBA', 'La NFL', 'La MLB', 'La NHL', 'facile'],
                ['Quel joueur est surnommé « His Airness » ?', 'Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Magic Johnson', 'facile'],
                ['Combien de temps dure un quart-temps en NBA ?', '12 minutes', '10 minutes', '15 minutes', '20 minutes', 'facile'],
                ['Quelle équipe a remporté le titre NBA en 2024 ?', 'Les Boston Celtics', 'Les Dallas Mavericks', 'Les Denver Nuggets', 'Les Golden State Warriors', 'moyen'],
                ['Quel joueur français a été choisi en première position de la draft 2023 ?', 'Victor Wembanyama', 'Rudy Gobert', 'Evan Fournier', 'Nicolas Batum', 'moyen'],
                ['Quelle franchise a gagné six titres NBA dans les années 1990 ?', 'Les Chicago Bulls', 'Les Los Angeles Lakers', 'Les Boston Celtics', 'Les Houston Rockets', 'moyen'],
                ['Combien de titres NBA Michael Jordan a-t-il remportés ?', '6', '5', '7', '3', 'moyen'],
                ['Quel pays a remporté la Coupe du monde de basket 2023 ?', "L'Allemagne", 'La Serbie', 'Les États-Unis', "L'Espagne", 'moyen'],
                ['Qui détient le record de points inscrits dans un match NBA ?', 'Wilt Chamberlain', 'Kobe Bryant', 'Michael Jordan', 'David Thompson', 'difficile'],
                ["Qui est devenu en 2023 le meilleur marqueur de l'histoire de la NBA ?", 'LeBron James', 'Kareem Abdul-Jabbar', 'Karl Malone', 'Kobe Bryant', 'difficile'],
                ['En quelle année le basket a-t-il été inventé ?', '1891', '1875', '1901', '1912', 'difficile'],
                ['Quelle équipe a réalisé 73 victoires en saison régulière en 2015-2016 ?', 'Les Golden State Warriors', 'Les Chicago Bulls', 'Les San Antonio Spurs', 'Les Cleveland Cavaliers', 'difficile'],
                ["Quel club français a remporté l'Euroligue en 1993 ?", 'Le Limoges CSP', "L'ASVEL", 'Pau-Orthez', "L'AS Monaco", 'difficile'],
                ['Combien de points vaut un lancer franc réussi ?', '1', '2', '3', '0', 'facile'],
                ['Comment appelle-t-on un tir puissant marqué au-dessus du cercle ?', 'Un dunk', 'Un lay-up', 'Un fadeaway', 'Un floater', 'facile'],
                ['De quelle couleur est le ballon de basket traditionnel ?', 'Orange', 'Blanc', 'Marron', 'Jaune', 'facile'],
                ['Combien de quart-temps compte un match NBA ?', '4', '2', '3', '5', 'facile'],
                ['Dans quel pays le basket-ball a-t-il été inventé ?', 'Aux États-Unis', 'Au Canada', 'En France', 'En Espagne', 'facile'],
                ['Quelle franchise NBA joue au Madison Square Garden ?', 'Les New York Knicks', 'Les Brooklyn Nets', 'Les Boston Celtics', 'Les Philadelphia 76ers', 'moyen'],
                ['Quel joueur est surnommé « The King » ?', 'LeBron James', 'Kevin Durant', 'Stephen Curry', 'James Harden', 'moyen'],
                ['Dans quelle franchise Kobe Bryant a-t-il joué toute sa carrière NBA ?', 'Les Los Angeles Lakers', 'Les Chicago Bulls', 'Le Miami Heat', 'Les Phoenix Suns', 'moyen'],
                ['Combien de temps une équipe a-t-elle pour tirer en NBA ?', '24 secondes', '30 secondes', '20 secondes', '35 secondes', 'moyen'],
                ["Quel joueur détient le record de passes décisives en NBA ?", 'John Stockton', 'Magic Johnson', 'Chris Paul', 'Jason Kidd', 'moyen'],
                ['Combien de points Wilt Chamberlain a-t-il marqués lors de son match record ?', '100', '81', '73', '92', 'difficile'],
                ['Qui a inventé le basket-ball ?', 'James Naismith', 'Walter Camp', 'Abner Doubleday', 'William Morgan', 'difficile'],
                ['Quel joueur a remporté onze titres NBA, un record ?', 'Bill Russell', 'Michael Jordan', 'Kareem Abdul-Jabbar', 'Magic Johnson', 'difficile'],
                ["Quelle sélection a remporté l'or olympique de basket en 2024 ?", 'Les États-Unis', 'La France', 'La Serbie', "L'Allemagne", 'difficile'],
                ['Combien de temps dure un quart-temps dans un match FIBA ?', '10 minutes', '12 minutes', '8 minutes', '15 minutes', 'difficile'],
            ],
            'tennis' => [
                ['Combien de points vaut le premier point gagné dans un jeu ?', '15', '10', '5', '20', 'facile'],
                ['Sur quelle surface se joue Roland-Garros ?', 'La terre battue', 'Le gazon', 'Le dur', 'La moquette', 'facile'],
                ['Combien y a-t-il de tournois du Grand Chelem par an ?', '4', '3', '5', '6', 'facile'],
                ['Quel tournoi du Grand Chelem se joue sur gazon à Londres ?', 'Wimbledon', "L'US Open", "L'Open d'Australie", 'Roland-Garros', 'facile'],
                ["Comment appelle-t-on un service gagnant que l'adversaire ne touche pas ?", 'Un ace', 'Un let', 'Un smash', 'Un lob', 'facile'],
                ['Quel joueur détient le record de titres à Roland-Garros ?', 'Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Björn Borg', 'moyen'],
                ['Quelle joueuse a remporté 23 titres du Grand Chelem en simple ?', 'Serena Williams', 'Steffi Graf', 'Martina Navratilova', 'Chris Evert', 'moyen'],
                ['Quel Français a gagné Roland-Garros en 1983 ?', 'Yannick Noah', 'Henri Leconte', 'Guy Forget', 'Cédric Pioline', 'moyen'],
                ['Combien de jeux faut-il gagner pour remporter un set sans passer par le jeu décisif ?', '6', '5', '7', '4', 'moyen'],
                ['Quel joueur est surnommé « Nole » ?', 'Novak Djokovic', 'Rafael Nadal', 'Roger Federer', 'Andy Murray', 'moyen'],
                ['Qui détient le record de titres du Grand Chelem en simple messieurs ?', 'Novak Djokovic', 'Rafael Nadal', 'Roger Federer', 'Pete Sampras', 'difficile'],
                ['En quelle année le jeu décisif a-t-il été introduit à Wimbledon ?', '1971', '1968', '1980', '1990', 'difficile'],
                ['Quel tournoi clôt la saison des tournois du Grand Chelem ?', "L'US Open", 'Wimbledon', 'Roland-Garros', "L'Open d'Australie", 'difficile'],
                ['Combien de fois Roger Federer a-t-il remporté Wimbledon ?', '8', '7', '6', '9', 'difficile'],
                ['Quel pays a remporté la première Coupe Davis en 1900 ?', 'Les États-Unis', 'La Grande-Bretagne', 'La France', "L'Australie", 'difficile'],
                ['Combien de joueurs y a-t-il sur le court dans un match en simple ?', '2', '4', '3', '1', 'facile'],
                ['Comment appelle-t-on le score de 40-40 ?', 'Égalité', 'Avantage', 'Jeu blanc', 'Break', 'facile'],
                ['Avec quel objet frappe-t-on la balle au tennis ?', 'Une raquette', 'Une batte', 'Une crosse', 'Un club', 'facile'],
                ['Combien de services a-t-on pour réussir sa mise en jeu ?', '2', '1', '3', '4', 'facile'],
                ["Dans quel pays se joue l'Open d'Australie ?", "En Australie", 'En Nouvelle-Zélande', 'Au Japon', 'En Afrique du Sud', 'facile'],
                ['Quelle joueuse française a gagné Roland-Garros en 2000 ?', 'Mary Pierce', 'Amélie Mauresmo', 'Nathalie Tauziat', 'Caroline Garcia', 'moyen'],
                ["Comment appelle-t-on le fait de gagner le jeu de service de l'adversaire ?", 'Un break', 'Un ace', 'Un let', 'Un smash', 'moyen'],
                ['Quel joueur suisse a remporté 20 titres du Grand Chelem ?', 'Roger Federer', 'Stan Wawrinka', 'Marc Rosset', 'Heinz Günthardt', 'moyen'],
                ["Dans quelle ville se joue l'US Open ?", 'À New York', 'À Los Angeles', 'À Miami', 'À Chicago', 'moyen'],
                ['Quelle surface est la plus rapide au tennis ?', 'Le gazon', 'La terre battue', 'Le dur', 'La résine', 'moyen'],
                ['Quel joueur a réalisé le Grand Chelem calendaire en 1969 ?', 'Rod Laver', 'Roy Emerson', 'Ken Rosewall', 'John Newcombe', 'difficile'],
                ['Combien de titres du Grand Chelem Rafael Nadal a-t-il remportés ?', '22', '20', '21', '24', 'difficile'],
                ['Quelle joueuse a réalisé le Grand Chelem calendaire en 1988 ?', 'Steffi Graf', 'Martina Navratilova', 'Monica Seles', 'Chris Evert', 'difficile'],
                ['Quel pays a remporté le plus de Coupes Davis ?', 'Les États-Unis', "L'Australie", 'La France', "L'Espagne", 'difficile'],
                ["Combien de temps a duré le match Isner-Mahut de 2010, le plus long de l'histoire ?", '11 heures', '8 heures', '6 heures', '14 heures', 'difficile'],
            ],
            'multi' => [
                ["Combien d'anneaux compte le drapeau olympique ?", '5', '4', '6', '3', 'facile'],
                ['Quel sport pratique-t-on sur le Tour de France ?', 'Le cyclisme', "L'athlétisme", 'Le ski', 'La natation', 'facile'],
                ['Combien de joueurs par équipe y a-t-il au rugby à XV ?', '15', '13', '11', '7', 'facile'],
                ['Dans quel sport marque-t-on un « strike » ?', 'Le bowling', 'Le golf', 'Le tennis', 'Le hockey', 'facile'],
                ["Quelle ville a accueilli les Jeux olympiques d'été de 2024 ?", 'Paris', 'Tokyo', 'Londres', 'Los Angeles', 'facile'],
                ['Combien de manches compte un match de baseball ?', '9', '7', '11', '6', 'moyen'],
                ['Quel pays a remporté la Coupe du monde de rugby 2023 ?', "L'Afrique du Sud", 'La Nouvelle-Zélande', 'La France', "L'Angleterre", 'moyen'],
                ['Quel pilote français a remporté quatre titres de champion du monde de Formule 1 ?', 'Alain Prost', 'Jean Alesi', 'Jacques Laffite', 'René Arnoux', 'moyen'],
                ['Sur quelle distance court-on un marathon ?', '42,195 km', '40 km', '45 km', '21,1 km', 'moyen'],
                ["Quel nageur a remporté 23 médailles d'or olympiques ?", 'Michael Phelps', 'Mark Spitz', 'Ryan Lochte', 'Ian Thorpe', 'moyen'],
                ['En quelle année ont eu lieu les premiers Jeux olympiques modernes ?', '1896', '1900', '1888', '1912', 'difficile'],
                ['Quel pays a inventé le judo ?', 'Le Japon', 'La Chine', 'La Corée du Sud', 'Le Brésil', 'difficile'],
                ["Combien de temps durent les deux périodes d'un match de handball ?", '60 minutes', '50 minutes', '70 minutes', '80 minutes', 'difficile'],
                ["Quel coureur détient le record de victoires d'étapes sur le Tour de France ?", 'Mark Cavendish', 'Eddy Merckx', 'Bernard Hinault', 'Marcel Kittel', 'difficile'],
                ['Dans quel sport décerne-t-on la Coupe Stanley ?', 'Le hockey sur glace', 'Le basket', 'Le baseball', 'Le football américain', 'difficile'],
                ['Combien de joueurs par équipe y a-t-il au volley-ball ?', '6', '5', '7', '8', 'facile'],
                ['Dans quel sport se bat-on sur un tatami ?', 'Le judo', 'La boxe', "L'escrime", 'Le tir à l\'arc', 'facile'],
                ['Quel sport enchaîne natation, vélo et course à pied ?', 'Le triathlon', 'Le pentathlon', 'Le biathlon', 'Le décathlon', 'facile'],
                ['Quelle est la couleur du maillot du leader du Tour de France ?', 'Jaune', 'Vert', 'Blanc', 'Rouge', 'facile'],
                ['Dans quel sport marque-t-on un essai ?', 'Le rugby', 'Le football', 'Le basket', 'Le handball', 'facile'],
                ["Tous les combien d'années ont lieu les Jeux olympiques d'été ?", 'Tous les 4 ans', 'Tous les 2 ans', 'Tous les 3 ans', 'Tous les 5 ans', 'moyen'],
                ['Quelle est la plus courte épreuve de sprint sur piste aux Jeux olympiques ?', 'Le 100 mètres', 'Le 200 mètres', 'Le 400 mètres', 'Le 110 mètres haies', 'moyen'],
                ['Qui détient le record du monde du 100 mètres ?', 'Usain Bolt', 'Carl Lewis', 'Tyson Gay', 'Justin Gatlin', 'moyen'],
                ['Combien de joueurs par équipe y a-t-il au handball ?', '7', '6', '8', '5', 'moyen'],
                ['À quoi correspond le maillot à pois sur le Tour de France ?', 'Au meilleur grimpeur', 'Au meilleur sprinteur', 'Au meilleur jeune', 'Au leader du classement', 'moyen'],
                ["Quel pays a accueilli les Jeux olympiques d'hiver de 2022 ?", 'La Chine', 'La Corée du Sud', 'Le Japon', 'La Russie', 'difficile'],
                ['Quel boxeur était surnommé « The Greatest » ?', 'Mohamed Ali', 'Mike Tyson', 'Joe Frazier', 'George Foreman', 'difficile'],
                ['En quelle année le Tour de France a-t-il été créé ?', '1903', '1896', '1910', '1920', 'difficile'],
                ['Quelle écurie détient le plus de titres de champion du monde des constructeurs en Formule 1 ?', 'Ferrari', 'McLaren', 'Mercedes', 'Williams', 'difficile'],
                ['Combien de temps durent les quatre périodes d\'un match de water-polo ?', '32 minutes', '40 minutes', '24 minutes', '48 minutes', 'difficile'],
            ],
        ];
    }
}
