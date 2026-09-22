<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Partie;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    /**
     * Le classement des meilleurs scores, par sport et par mode de jeu.
     *
     * GET /api/scores?sport=foot&mode=solo&limite=10
     */
    public function index(Request $request)
    {
        $donnees = $request->validate([
            'sport' => 'nullable|string|exists:categories,slug',
            'mode' => 'nullable|in:solo,chrono,survie,defi',
            'limite' => 'nullable|integer|min:1|max:50',
        ]);

        $requete = Partie::with('categorie');

        if (! empty($donnees['sport'])) {
            $categorie = Categorie::where('slug', $donnees['sport'])->firstOrFail();
            $requete->where('categorie_id', $categorie->id);
        }

        if (! empty($donnees['mode'])) {
            $requete->where('mode', $donnees['mode']);
        }

        $parties = $requete->orderByDesc('score')
            ->orderBy('created_at')
            ->limit((int) ($donnees['limite'] ?? 10))
            ->get();

        return response()->json($parties->map(function (Partie $partie) {
            return [
                'id' => $partie->id,
                'pseudo' => $partie->pseudo,
                'sport' => $partie->categorie->slug ?? null,
                'sport_nom' => $partie->categorie->nom ?? null,
                'difficulte' => $partie->difficulte,
                'mode' => $partie->mode,
                'score' => $partie->score,
                'total' => $partie->total,
                'date' => $partie->created_at->toIso8601String(),
            ];
        })->values());
    }

    /**
     * Enregistre le score d'une partie terminée.
     *
     * POST /api/scores
     */
    public function store(Request $request)
    {
        $donnees = $request->validate([
            'pseudo' => 'required|string|max:20',
            'sport' => 'required|string|exists:categories,slug',
            'difficulte' => 'required|in:facile,moyen,difficile,toutes',
            'mode' => 'required|in:solo,chrono,survie,defi',
            'score' => 'required|integer|min:0',
            'total' => 'required|integer|min:1',
        ]);

        if ($donnees['score'] > $donnees['total']) {
            return response()->json(['message' => 'Le score ne peut pas dépasser le nombre de questions.'], 422);
        }

        $categorie = Categorie::where('slug', $donnees['sport'])->firstOrFail();

        $partie = Partie::create([
            'pseudo' => trim($donnees['pseudo']),
            'categorie_id' => $categorie->id,
            'difficulte' => $donnees['difficulte'],
            'mode' => $donnees['mode'],
            'score' => $donnees['score'],
            'total' => $donnees['total'],
        ]);

        return response()->json([
            'id' => $partie->id,
            'pseudo' => $partie->pseudo,
            'sport' => $categorie->slug,
            'difficulte' => $partie->difficulte,
            'mode' => $partie->mode,
            'score' => $partie->score,
            'total' => $partie->total,
        ], 201);
    }
}
