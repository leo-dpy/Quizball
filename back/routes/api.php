<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ApiUserController;
use App\Http\Controllers\CategorieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/questions', [ApiController::class, 'index']);
Route::post('/questions', [ApiController::class, 'store']);
Route::put('/questions/{id}', [ApiController::class, 'edit']);
Route::delete('/questions/{id}', [ApiController::class, 'destroy']);


Route::get('/users', [ApiUserController::class, 'index']);
Route::post('/users', [ApiUserController::class, 'store']);
Route::put('/users/{id}', [ApiUserController::class, 'update']);
Route::delete('/users/{id}', [ApiUserController::class, 'destroy']);
Route::get('/users/{id}', [ApiUserController::class, 'show']);


Route::get('/categories', [CategorieController::class, 'indexApi']);