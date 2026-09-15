<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categorie;
use App\Models\Question;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Nettoyage préalable
        Categorie::truncate();
        Question::truncate();

        $categories = [
            'Histoire',
            'Cinéma',
            'Sport',
            'Géographie',
            'Sciences'
        ];

        foreach ($categories as $cat) {
            Categorie::create(['categorie' => $cat]);
        }

        $questions = [
            // HISTOIRE
            [
                'categorie' => 'Histoire',
                'question' => 'En quelle année a eu lieu la prise de la Bastille ?',
                'reponse1' => '1789',
                'reponse2' => '1792',
                'reponse3' => '1776',
                'reponse4' => '1804',
                'reponse5' => '1785',
                'reponse6' => '1799',
                'reponse7' => '1750',
                'reponse8' => '1815',
                'reponse9' => '1768',
                'reponse10' => '1793',
            ],
            [
                'categorie' => 'Histoire',
                'question' => 'Qui était le premier empereur des Français ?',
                'reponse1' => 'Napoléon Ier',
                'reponse2' => 'Louis XIV',
                'reponse3' => 'Napoléon III',
                'reponse4' => 'Charlemagne',
                'reponse5' => 'François Ier',
                'reponse6' => 'Henri IV',
                'reponse7' => 'Louis XVI',
                'reponse8' => 'Clovis',
                'reponse9' => 'Charles de Gaulle',
                'reponse10' => 'Philippe le Bel',
            ],
            [
                'categorie' => 'Histoire',
                'question' => 'Quel traité a mis fin à la Première Guerre mondiale en 1919 ?',
                'reponse1' => 'Traité de Versailles',
                'reponse2' => 'Traité de Rome',
                'reponse3' => 'Traité de Maastricht',
                'reponse4' => 'Traité de Vienne',
                'reponse5' => 'Traité de Tordesillas',
                'reponse6' => 'Traité d\'Utrecht',
                'reponse7' => 'Traité de Paris',
                'reponse8' => 'Traité de Brest-Litovsk',
                'reponse9' => 'Traité de Gand',
                'reponse10' => 'Traité de Verdun',
            ],
            [
                'categorie' => 'Histoire',
                'question' => 'En quelle année l\'Homme a-t-il marché sur la Lune pour la première fois ?',
                'reponse1' => '1969',
                'reponse2' => '1965',
                'reponse3' => '1971',
                'reponse4' => '1959',
                'reponse5' => '1968',
                'reponse6' => '1972',
                'reponse7' => '1962',
                'reponse8' => '1975',
                'reponse9' => '1967',
                'reponse10' => '1970',
            ],
            [
                'categorie' => 'Histoire',
                'question' => 'Quelle reine d\'Égypte a séduit Jules César et Marc Antoine ?',
                'reponse1' => 'Cléopâtre VII',
                'reponse2' => 'Néfertiti',
                'reponse3' => 'Hatchepsout',
                'reponse4' => 'Néfertari',
                'reponse5' => 'Arsinoé',
                'reponse6' => 'Bérénice',
                'reponse7' => 'Tiyi',
                'reponse8' => 'Mérytaton',
                'reponse9' => 'Nitocris',
                'reponse10' => 'Twosret',
            ],

            // CINÉMA
            [
                'categorie' => 'Cinéma',
                'question' => 'Quel réalisateur a réalisé le film "Inception" ?',
                'reponse1' => 'Christopher Nolan',
                'reponse2' => 'Steven Spielberg',
                'reponse3' => 'James Cameron',
                'reponse4' => 'Quentin Tarantino',
                'reponse5' => 'David Fincher',
                'reponse6' => 'Martin Scorsese',
                'reponse7' => 'Ridley Scott',
                'reponse8' => 'Denis Villeneuve',
                'reponse9' => 'Stanley Kubrick',
                'reponse10' => 'Peter Jackson',
            ],
            [
                'categorie' => 'Cinéma',
                'question' => 'Combien d\'Oscars le film Titanic (1997) a-t-il remportés ?',
                'reponse1' => '11',
                'reponse2' => '9',
                'reponse3' => '12',
                'reponse4' => '10',
                'reponse5' => '8',
                'reponse6' => '14',
                'reponse7' => '7',
                'reponse8' => '13',
                'reponse9' => '6',
                'reponse10' => '5',
            ],
            [
                'categorie' => 'Cinéma',
                'question' => 'Quel acteur incarne Tony Stark / Iron Man dans le Marvel Cinematic Universe ?',
                'reponse1' => 'Robert Downey Jr.',
                'reponse2' => 'Chris Evans',
                'reponse3' => 'Chris Hemsworth',
                'reponse4' => 'Mark Ruffalo',
                'reponse5' => 'Tom Cruise',
                'reponse6' => 'Benedict Cumberbatch',
                'reponse7' => 'Christian Bale',
                'reponse8' => 'Johnny Depp',
                'reponse9' => 'Brad Pitt',
                'reponse10' => 'Keanu Reeves',
            ],
            [
                'categorie' => 'Cinéma',
                'question' => 'Dans quel film culte entend-on la réplique "Que la Force soit avec toi" ?',
                'reponse1' => 'Star Wars',
                'reponse2' => 'Star Trek',
                'reponse3' => 'Matrix',
                'reponse4' => 'Le Seigneur des Anneaux',
                'reponse5' => 'Blade Runner',
                'reponse6' => 'Dune',
                'reponse7' => 'Avatar',
                'reponse8' => 'Interstellar',
                'reponse9' => 'Harry Potter',
                'reponse10' => 'E.T.',
            ],
            [
                'categorie' => 'Cinéma',
                'question' => 'Qui a composé la célèbre bande originale du film "Le Fabuleux Destin d\'Amélie Poulain" ?',
                'reponse1' => 'Yann Tiersen',
                'reponse2' => 'Hans Zimmer',
                'reponse3' => 'Ennio Morricone',
                'reponse4' => 'Alexandre Desplat',
                'reponse5' => 'John Williams',
                'reponse6' => 'Ludovico Einaudi',
                'reponse7' => 'Max Richter',
                'reponse8' => 'Danny Elfman',
                'reponse9' => 'Howard Shore',
                'reponse10' => 'Gabriel Yared',
            ],

            // SPORT
            [
                'categorie' => 'Sport',
                'question' => 'Quel pays a remporté la Coupe du Monde de football en 2018 ?',
                'reponse1' => 'France',
                'reponse2' => 'Croatie',
                'reponse3' => 'Brésil',
                'reponse4' => 'Allemagne',
                'reponse5' => 'Argentine',
                'reponse6' => 'Espagne',
                'reponse7' => 'Belgique',
                'reponse8' => 'Angleterre',
                'reponse9' => 'Portugal',
                'reponse10' => 'Italie',
            ],
            [
                'categorie' => 'Sport',
                'question' => 'Combien de titres du Grand Chelem Rafael Nadal a-t-il remportés à Roland-Garros ?',
                'reponse1' => '14',
                'reponse2' => '12',
                'reponse3' => '10',
                'reponse4' => '15',
                'reponse5' => '11',
                'reponse6' => '13',
                'reponse7' => '9',
                'reponse8' => '16',
                'reponse9' => '8',
                'reponse10' => '7',
            ],
            [
                'categorie' => 'Sport',
                'question' => 'Quelle distance mesure un marathon officiel ?',
                'reponse1' => '42,195 km',
                'reponse2' => '40,000 km',
                'reponse3' => '45,250 km',
                'reponse4' => '50,000 km',
                'reponse5' => '41,500 km',
                'reponse6' => '43,000 km',
                'reponse7' => '38,195 km',
                'reponse8' => '42,000 km',
                'reponse9' => '44,195 km',
                'reponse10' => '46,200 km',
            ],
            [
                'categorie' => 'Sport',
                'question' => 'Quel joueur de basketball détient le record du plus grand nombre de points en NBA ?',
                'reponse1' => 'LeBron James',
                'reponse2' => 'Kareem Abdul-Jabbar',
                'reponse3' => 'Michael Jordan',
                'reponse4' => 'Kobe Bryant',
                'reponse5' => 'Karl Malone',
                'reponse6' => 'Shaquille O\'Neal',
                'reponse7' => 'Wilt Chamberlain',
                'reponse8' => 'Stephen Curry',
                'reponse9' => 'Magic Johnson',
                'reponse10' => 'Larry Bird',
            ],
            [
                'categorie' => 'Sport',
                'question' => 'Dans quel sport utilise-t-on un volant ?',
                'reponse1' => 'Badminton',
                'reponse2' => 'Tennis',
                'reponse3' => 'Squash',
                'reponse4' => 'Tennis de table',
                'reponse5' => 'Padel',
                'reponse6' => 'Pelote basque',
                'reponse7' => 'Cricket',
                'reponse8' => 'Golf',
                'reponse9' => 'Baseball',
                'reponse10' => 'Volleyball',
            ],

            // GÉOGRAPHIE
            [
                'categorie' => 'Géographie',
                'question' => 'Quelle est la capitale de l\'Australie ?',
                'reponse1' => 'Canberra',
                'reponse2' => 'Sydney',
                'reponse3' => 'Melbourne',
                'reponse4' => 'Brisbane',
                'reponse5' => 'Perth',
                'reponse6' => 'Adélaïde',
                'reponse7' => 'Auckland',
                'reponse8' => 'Wellington',
                'reponse9' => 'Darwin',
                'reponse10' => 'Hobart',
            ],
            [
                'categorie' => 'Géographie',
                'question' => 'Quel est le plus grand océan de la planète ?',
                'reponse1' => 'Océan Pacifique',
                'reponse2' => 'Océan Atlantique',
                'reponse3' => 'Océan Indien',
                'reponse4' => 'Océan Arctique',
                'reponse5' => 'Océan Austral',
                'reponse6' => 'Mer Méditerranée',
                'reponse7' => 'Mer Rouge',
                'reponse8' => 'Mer des Caraïbes',
                'reponse9' => 'Mer Baltique',
                'reponse10' => 'Mer de Chine',
            ],
            [
                'categorie' => 'Géographie',
                'question' => 'Quel pays possède la plus grande superficie au monde ?',
                'reponse1' => 'Russie',
                'reponse2' => 'Canada',
                'reponse3' => 'Chine',
                'reponse4' => 'États-Unis',
                'reponse5' => 'Brésil',
                'reponse6' => 'Australie',
                'reponse7' => 'Inde',
                'reponse8' => 'Argentine',
                'reponse9' => 'Kazakhstan',
                'reponse10' => 'Algérie',
            ],

            // SCIENCES
            [
                'categorie' => 'Sciences',
                'question' => 'Quel est le symbole chimique de l\'or ?',
                'reponse1' => 'Au',
                'reponse2' => 'Ag',
                'reponse3' => 'Fe',
                'reponse4' => 'Cu',
                'reponse5' => 'Pb',
                'reponse6' => 'Or',
                'reponse7' => 'Pt',
                'reponse8' => 'Zn',
                'reponse9' => 'Hg',
                'reponse10' => 'Sn',
            ],
            [
                'categorie' => 'Sciences',
                'question' => 'Quelle planète du système solaire est la plus proche du Soleil ?',
                'reponse1' => 'Mercure',
                'reponse2' => 'Vénus',
                'reponse3' => 'Mars',
                'reponse4' => 'Jupiter',
                'reponse5' => 'Saturne',
                'reponse6' => 'Uranus',
                'reponse7' => 'Neptune',
                'reponse8' => 'Pluton',
                'reponse9' => 'Terre',
                'reponse10' => 'Cérès',
            ]
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}
