<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
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
            $table->string('difficulte')->default('moyen');
            $table->string('source')->default('manuelle');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
