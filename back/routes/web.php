<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizzController;
use App\Http\Controllers\CategorieController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');


Route::get('listequestions', [QuizzController::class, 'index'])->name('listequestions');
Route::post('store', [QuizzController::class, 'store'])->name('storequestion');
Route::get('createquestion', [QuizzController::class, 'create'])->name('createquestion');


Route::get('listecategories', [CategorieController::class, 'index'])->name('listecategories');
Route::post('storecategorie', [CategorieController::class, 'store'])->name('storecategorie');
Route::get('createcategorie', [CategorieController::class, 'create'])->name('createcategorie');
