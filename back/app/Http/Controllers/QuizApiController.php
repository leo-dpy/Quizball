<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Http\Request;

class QuizApiController extends Controller
{
    /**
     * Tire au sort les questions d'une partie.
     *
     * GET /api/quiz?sport=foot&difficulte=moyen&limite=10
     */
    public function tirage(Request $request)
    {
        $donnees = $request->validate([
            'sport' => 'required|string|exists:categories,slug',
            'difficulte' => 'nullable|in:facile,moyen,difficile,toutes',
            'limite' => 'nullable|integer|min:1|max:50',
        ]);

        $categorie = Categorie::where('slug', $donnees['sport'])->firstOrFail();
        $difficulte = $donnees['difficulte'] ?? 'toutes';
        $limite = (int) ($donnees['limite'] ?? 10);

        $requete = Question::where('categorie_id', $categorie->id);
        if ($difficulte !== 'toutes') {
            $requete->where('difficulte', $difficulte);
        }

        $questions = $requete->inRandomOrder()->limit($limite)->get();

        return response()->json([
            'sport' => [
                'slug' => $categorie->slug,
                'nom' => $categorie->nom,
                'couleur' => $categorie->couleur,
            ],
            'difficulte' => $difficulte,
            'total' => $questions->count(),
            'questions' => $questions->map(function (Question $question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'difficulte' => $question->difficulte,
                    'propositions' => $question->propositions(),
                    'bonne_reponse' => $question->bonne_reponse,
                ];
            })->values(),
        ]);
    }
}
