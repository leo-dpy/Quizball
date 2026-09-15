<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'categorie',
        'question',
        'reponse1',
        'reponse2',
        'reponse3',
        'reponse4',
        'reponse5',
        'reponse6',
        'reponse7',
        'reponse8',
        'reponse9',
        'reponse10',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [

    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
    ];
}
