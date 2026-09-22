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
     * Crée les 4 sports jouables.
     *
     * Les questions ne sont pas écrites ici : elles viennent de Wikidata.
     * Après ce seeder, lancer `php artisan quiz:generer` pour remplir la base.
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

        foreach ($sports as $sport) {
            Categorie::create($sport);
        }

        $this->command->info('Sports créés. Lance maintenant : php artisan quiz:generer');
    }
}
