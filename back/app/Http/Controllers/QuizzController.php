<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Http\Request;

class QuizzController extends Controller
{
    /**
     * La liste des questions (page d'administration).
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('listequestions', [
            'questions' => Question::with('categorie')->orderBy('categorie_id')->get(),
        ]);
    }

    /**
     * Le formulaire de création d'une question.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('createQuestion', [
            'categories' => Categorie::orderBy('id')->get(),
            'difficultes' => Question::DIFFICULTES,
        ]);
    }

    /**
     * Enregistre une nouvelle question.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $donnees = $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'question' => 'required|string|max:255',
            'bonne_reponse' => 'required|string|max:255',
            'mauvaise_1' => 'required|string|max:255',
            'mauvaise_2' => 'required|string|max:255',
            'mauvaise_3' => 'required|string|max:255',
            'difficulte' => 'required|in:facile,moyen,difficile',
        ]);

        Question::create($donnees);

        return redirect('/listequestions')->with('status', 'Question créée avec succès !');
    }
}
