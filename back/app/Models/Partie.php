<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partie extends Model
{
    use HasFactory;

    public const MODES = ['solo', 'chrono', 'survie', 'defi'];

    protected $fillable = [
        'pseudo',
        'categorie_id',
        'difficulte',
        'mode',
        'score',
        'total',
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}
