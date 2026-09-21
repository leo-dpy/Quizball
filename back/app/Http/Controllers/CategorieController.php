<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    /**
     * La liste des sports (page d'administration).
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('listecategories', [
            'categories' => Categorie::withCount('questions')->get(),
        ]);
    }

    /**
     * La liste des sports jouables, pour le front React.
     *
     * GET /api/categories
     */
    public function indexApi()
    {
        $categories = Categorie::withCount('questions')->orderBy('id')->get();

        return response()->json($categories->map(function (Categorie $categorie) {
            return [
                'id' => $categorie->id,
                'slug' => $categorie->slug,
                'nom' => $categorie->nom,
                'couleur' => $categorie->couleur,
                'nb_questions' => $categorie->questions_count,
            ];
        })->values());
    }

    /**
     * Le formulaire de création d'un sport.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('createCategorie');
    }

    /**
     * Enregistre un nouveau sport.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $donnees = $request->validate([
            'slug' => 'required|alpha_dash|max:30|unique:categories,slug',
            'nom' => 'required|string|max:50',
            'couleur' => 'required|string|max:7',
        ]);

        Categorie::create($donnees);

        return redirect('/listecategories')->with('status', 'Sport créé avec succès !');
    }
}
