<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'nom',
        'couleur',
    ];

    /**
     * Les questions de ce sport.
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Les parties jouées sur ce sport.
     */
    public function parties()
    {
        return $this->hasMany(Partie::class);
    }
}
