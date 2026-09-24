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
     * Initialise la base avec les 4 sports et les questions du quiz.
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

        foreach ($sports as $sport) {
            Categorie::create($sport);
        }

        $this->call(QuestionSeeder::class);

        $this->command->info('Base de données initialisée avec succès avec les sports et les questions !');
    }
}
