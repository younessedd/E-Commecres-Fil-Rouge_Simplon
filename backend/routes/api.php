


<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CartController;

Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

 Route::get('/products/search', [ProductController::class, 'search']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/me', [AuthController::class,'me']);
    Route::post('/logout', [AuthController::class,'logout']);

  Route::apiResource('products', ProductController::class);
 // Route:: post('/products', [ProductController::class,'store']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('orders', OrderController::class)->only(['index','store','show']);

           Route::apiResource('users', UserController::class);



           Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

     Route::post('/cart/checkout', [CartController::class, 'checkout']);

  Route::get('/admin/orders', [OrderController::class, 'allOrdersForAdmin']);
  // Admin فقط
    // Route::middleware('can:isAdmin')->group(function() {
    //     Route::get('/admin/orders', [OrderController::class,'allOrdersForAdmin']);
    //  });


   // Route::get('/products/search', [ProductController::class, 'search']);

    });
   
