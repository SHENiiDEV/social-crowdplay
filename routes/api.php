<?php

use App\Http\Controllers\CashierController;
use App\Http\Controllers\GammaPlusController;
use App\Http\Controllers\GgrTransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for GGR Gold API, GammaPlus Seamless Wallet & Payment Webhooks
|--------------------------------------------------------------------------
*/

// GGR Gold API Callback Endpoint
Route::post('/gold_api', [GgrTransactionController::class, 'handleTransaction']);

Route::prefix('gammaplus')->group(function () {
    Route::get('/authenticate', [GammaPlusController::class, 'authenticate']);
    Route::post('/balance', [GammaPlusController::class, 'balance']);
    Route::post('/bet', [GammaPlusController::class, 'bet']);
    Route::post('/win', [GammaPlusController::class, 'win']);
    Route::post('/rollback', [GammaPlusController::class, 'rollback']);
});

Route::prefix('webhooks')->group(function () {
    Route::post('/stripe-mock', [CashierController::class, 'webhook']);
});
