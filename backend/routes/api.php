<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MenuController;
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

Route::get('/menus', [MenuController::class, 'getAllMenuTree']);
Route::get('/menu/{id}', [MenuController::class, 'getMenu']);
Route::get('/parentmenus/{id}', [MenuController::class, 'getParentMenus']);
Route::post('/addmenu', [MenuController::class, 'addMenu']);
Route::post('/updatemenu', [MenuController::class, 'updateMenu']);
Route::get('/deletemenu/{id}', [MenuController::class, 'deleteMenu']);
