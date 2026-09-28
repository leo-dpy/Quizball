<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Http\Request;

class QuizApiController extends Controller
{
    public function tirage(Request $request)
    {
        $donnees = $request->validate([
            'sport' => 'required|string|exists:categories,slug',
            'difficulte' => 'nullable|in:facile,moyen,difficile,toutes,progressive',
            'limite' => 'nullable|integer|min:1|max:50',
            'graine' => 'nullable|string|max:40',
        ]);

        $categorie = Categorie::where('slug', $donnees['sport'])->firstOrFail();
        $difficulte = $donnees['difficulte'] ?? 'toutes';
        $limite = (int) ($donnees['limite'] ?? 10);
        $graine = $donnees['graine'] ?? null;

        if ($difficulte === 'progressive') {
            return $this->reponse($categorie, $difficulte, $graine, $this->tirageProgressif($categorie->id, $limite));
        }

        $requete = Question::where('categorie_id', $categorie->id);
        if ($difficulte !== 'toutes') {
            $requete->where('difficulte', $difficulte);
        }

        if ($graine !== null) {
            mt_srand(crc32($graine . '|' . $categorie->slug));
            $questions = $requete->orderBy('id')->get()->all();
            shuffle($questions);
            $questions = collect(array_slice($questions, 0, $limite));
        } else {
            $questions = $requete->inRandomOrder()->limit($limite)->get();
        }

        return $this->reponse($categorie, $difficulte, $graine, $questions);
    }

    private function tirageProgressif(int $categorieId, int $limite)
    {
        $repartition = [
            'facile' => (int) round($limite * 0.3),
            'moyen' => (int) round($limite * 0.4),
            'difficile' => 0,
        ];
        $repartition['difficile'] = $limite - $repartition['facile'] - $repartition['moyen'];

        $questions = collect();
        $manque = 0;

        foreach ($repartition as $niveau => $nombre) {
            $lot = Question::where('categorie_id', $categorieId)
                ->where('difficulte', $niveau)
                ->inRandomOrder()
                ->limit($nombre + $manque)
                ->get();

            $manque = ($nombre + $manque) - $lot->count();
            $questions = $questions->concat($lot);
        }

        if ($manque > 0) {
            $complement = Question::where('categorie_id', $categorieId)
                ->whereNotIn('id', $questions->pluck('id'))
                ->inRandomOrder()
                ->limit($manque)
                ->get();
            $questions = $questions->concat($complement);
        }

        return $questions;
    }

    private function reponse(Categorie $categorie, string $difficulte, ?string $graine, $questions)
    {
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
