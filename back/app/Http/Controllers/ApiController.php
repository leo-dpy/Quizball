<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * Toutes les questions, avec leur sport.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Question::with('categorie')->get());
    }

    /**
     * Les règles de validation d'une question.
     *
     * @return array<string, string>
     */
    private function regles(): array
    {
        return [
            'categorie_id' => 'required|exists:categories,id',
            'question' => 'required|string|max:255',
            'bonne_reponse' => 'required|string|max:255',
            'mauvaise_1' => 'required|string|max:255',
            'mauvaise_2' => 'required|string|max:255',
            'mauvaise_3' => 'required|string|max:255',
            'difficulte' => 'required|in:facile,moyen,difficile',
        ];
    }

    /**
     * Ajoute une question.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $question = Question::create($request->validate($this->regles()));

        return response()->json($question, 201);
    }

    /**
     * Modifie une question existante.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $question = Question::find($id);

        if (! $question) {
            return response()->json(['message' => 'Question introuvable.'], 404);
        }

        $question->update($request->validate($this->regles()));

        return response()->json($question);
    }

    /**
     * Supprime une question.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $question = Question::find($id);

        if (! $question) {
            return response()->json(['message' => 'Question introuvable.'], 404);
        }

        $question->delete();

        return response()->json(['message' => 'Question supprimée.']);
    }
}
