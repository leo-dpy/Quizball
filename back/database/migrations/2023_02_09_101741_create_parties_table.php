<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartiesTable extends Migration
{
    public function up()
    {
        Schema::create('parties', function (Blueprint $table) {
            $table->id();
            $table->string('pseudo');
            $table->foreignId('categorie_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('difficulte');
            $table->string('mode')->default('solo');
            $table->unsignedInteger('score');
            $table->unsignedInteger('total');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('parties');
    }
}
