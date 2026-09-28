<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    public const DIFFICULTES = ['facile', 'moyen', 'difficile'];

    protected $fillable = [
        'categorie_id',
        'question',
        'bonne_reponse',
        'mauvaise_1',
        'mauvaise_2',
        'mauvaise_3',
        'difficulte',
        'source',
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function propositions(): array
    {
        $propositions = [
            $this->bonne_reponse,
            $this->mauvaise_1,
            $this->mauvaise_2,
            $this->mauvaise_3,
        ];

        shuffle($propositions);

        return $propositions;
    }
}
