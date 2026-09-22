<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Http\Request;

class QuizApiController extends Controller
{
    /**
     * Tire les questions d'une partie.
     *
     * GET /api/quiz?sport=foot&difficulte=moyen&limite=10
     * Avec une graine (defi du jour) : GET /api/quiz?sport=foot&graine=2026-09-22
     * Le tirage est alors identique pour tout le monde tant que la graine ne change pas.
     */
    public function tirage(Request $request)
    {
        $donnees = $request->validate([
            'sport' => 'required|string|exists:categories,slug',
            'difficulte' => 'nullable|in:facile,moyen,difficile,toutes',
            'limite' => 'nullable|integer|min:1|max:50',
            'graine' => 'nullable|string|max:40',
        ]);

        $categorie = Categorie::where('slug', $donnees['sport'])->firstOrFail();
        $difficulte = $donnees['difficulte'] ?? 'toutes';
        $limite = (int) ($donnees['limite'] ?? 10);
        $graine = $donnees['graine'] ?? null;

        $requete = Question::where('categorie_id', $categorie->id);
        if ($difficulte !== 'toutes') {
            $requete->where('difficulte', $difficulte);
        }

        if ($graine !== null) {
            // Tirage reproductible : même graine, mêmes questions dans le même ordre
            mt_srand(crc32($graine . '|' . $categorie->slug));
            $questions = $requete->orderBy('id')->get()->all();
            shuffle($questions);
            $questions = collect(array_slice($questions, 0, $limite));
        } else {
            $questions = $requete->inRandomOrder()->limit($limite)->get();
        }

        return response()->json([
            'sport' => [
                'slug' => $categorie->slug,
                'nom' => $categorie->nom,
                'couleur' => $categorie->couleur,
            ],
            'difficulte' => $difficulte,
            'graine' => $graine,
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
