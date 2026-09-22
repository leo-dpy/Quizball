<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partie extends Model
{
    use HasFactory;

    /** Les modes de jeu acceptés. */
    public const MODES = ['solo', 'chrono', 'survie', 'defi'];

    protected $fillable = [
        'pseudo',
        'categorie_id',
        'difficulte',
        'mode',
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
