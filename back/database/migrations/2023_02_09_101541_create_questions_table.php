<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Une question = 1 bonne réponse + 3 mauvaises + une difficulté.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categorie_id')->constrained('categories')->cascadeOnDelete();
            $table->string('question');
            $table->string('bonne_reponse');
            $table->string('mauvaise_1');
            $table->string('mauvaise_2');
            $table->string('mauvaise_3');
            $table->string('difficulte')->default('moyen'); // facile, moyen, difficile
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
