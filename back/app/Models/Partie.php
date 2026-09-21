<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partie extends Model
{
    use HasFactory;

    protected $fillable = [
        'pseudo',
        'categorie_id',
        'difficulte',
        'score',
        'total',
    ];

    /**
     * Le sport sur lequel la partie a été jouée.
     */
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}
