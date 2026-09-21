<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ApiUserController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\QuizApiController;
use App\Http\Controllers\ScoreController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Les routes consommées par le front React (QuizBall).
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Les sports jouables
Route::get('/categories', [CategorieController::class, 'indexApi']);

// Le tirage des questions d'une partie
Route::get('/quiz', [QuizApiController::class, 'tirage']);

// Les scores et le classement
Route::get('/scores', [ScoreController::class, 'index']);
Route::post('/scores', [ScoreController::class, 'store']);

// CRUD des questions (administration)
Route::get('/questions', [ApiController::class, 'index']);
Route::post('/questions', [ApiController::class, 'store']);
Route::put('/questions/{id}', [ApiController::class, 'update']);
Route::delete('/questions/{id}', [ApiController::class, 'destroy']);

// CRUD des utilisateurs
Route::get('/users', [ApiUserController::class, 'index']);
Route::post('/users', [ApiUserController::class, 'store']);
Route::put('/users/{id}', [ApiUserController::class, 'update']);
Route::delete('/users/{id}', [ApiUserController::class, 'destroy']);
Route::get('/users/{id}', [ApiUserController::class, 'show']);
