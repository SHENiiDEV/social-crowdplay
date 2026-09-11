<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\SimulatorController;
use Illuminate\Support\Facades\Route;

// Public Catalog & Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// GGR Gold API Callback Endpoint (Direct Root Callback)
Route::post('/gold_api', [\App\Http\Controllers\GgrTransactionController::class, 'handleTransaction']);


// Auth Routes
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// Game Launch & Play
Route::get('/game/{slug}', [GameController::class, 'play'])->name('game.play');

// Profile & Live Wins Routes
Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile');
Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
Route::get('/api/live-wins', [\App\Http\Controllers\ProfileController::class, 'liveWins'])->name('api.live-wins');

// Cashier Checkout
Route::middleware('auth')->group(function () {
    Route::post('/cashier/checkout', [CashierController::class, 'checkout'])->name('cashier.checkout');
});

// Legal Pages Routes
Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/terms', [LegalController::class, 'terms'])->name('terms');
    Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');
    Route::get('/aml-cft', [LegalController::class, 'aml'])->name('aml');
    Route::get('/responsible-gaming', [LegalController::class, 'responsibleGaming'])->name('responsible-gaming');
});

// Others Pages Routes
Route::prefix('info')->name('info.')->group(function () {
    Route::get('/contact', [LegalController::class, 'contact'])->name('contact');
    Route::get('/categories', [LegalController::class, 'categories'])->name('categories');
    Route::get('/faq', [LegalController::class, 'faq'])->name('faq');
    Route::get('/about', [LegalController::class, 'about'])->name('about');
});

// User Balance Polling Endpoint
Route::get('/user/balance', function (\Illuminate\Http\Request $request) {
    $user = $request->user();
    return response()->json([
        'balance' => $user ? (float) $user->balance : 0.00,
    ]);
});

// Store Purchase Endpoint
Route::post('/api/store/purchase', function (\Illuminate\Http\Request $request) {
    $user = $request->user() ?: \App\Models\User::first();
    $sc = (float) $request->input('amount_sc', 2000);

    if ($user) {
        $user->balance = (float) $user->balance + $sc;
        $user->save();
    }

    return response()->json([
        'status' => 'success',
        'new_balance' => $user ? (float) $user->balance : 12000.00,
    ]);
});

// Progressive Jackpot Endpoints
Route::get('/api/jackpot/status', function () {
    return response()->json([
        'status' => 'success',
        'jackpot_amount' => \App\Services\JackpotService::getCurrentJackpot(),
    ]);
});

Route::post('/api/jackpot/claim', function (\Illuminate\Http\Request $request) {
    $user = $request->user() ?: \App\Models\User::first();
    $result = \App\Services\JackpotService::claimJackpot($user);

    return response()->json($result);
});

// Daily Free 1 SC Bonus Endpoints (24h Cooldown)
Route::get('/api/daily-bonus/status', [\App\Http\Controllers\DailyBonusController::class, 'status']);
Route::post('/api/daily-bonus/claim', [\App\Http\Controllers\DailyBonusController::class, 'claim']);

// Wheel of Fortune Endpoints
Route::get('/api/wheel/status', [\App\Http\Controllers\WheelController::class, 'status']);
Route::post('/api/wheel/spin', [\App\Http\Controllers\WheelController::class, 'spin']);

// Game Favorites Endpoints
Route::get('/api/favorites', [\App\Http\Controllers\FavoriteController::class, 'index']);
Route::post('/api/favorites/toggle', [\App\Http\Controllers\FavoriteController::class, 'toggle']);





// Simulator Views
Route::get('/simulator/payment/{order_id}', [SimulatorController::class, 'paymentPage'])->name('simulator.payment');

Route::get('/simulator/gammaplus-iframe', [SimulatorController::class, 'iframePage'])->name('gammaplus.iframe');
Route::get('/ggr/demo-player', [SimulatorController::class, 'ggrDemoPlayer'])->name('ggr.demo-player');


// Admin Panel Routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users/{user}/toggle', [AdminController::class, 'toggleUserStatus'])->name('users.toggle');
    Route::post('/users/{user}/adjust-balance', [AdminController::class, 'adjustBalance'])->name('users.adjust-balance');
    Route::post('/users/{user}/set-rtp', [AdminController::class, 'setUserRtp'])->name('users.set-rtp');
    
    Route::get('/games', [AdminController::class, 'games'])->name('games');
    Route::post('/games/{game}/toggle', [AdminController::class, 'toggleGame'])->name('games.toggle');
    Route::post('/ggr/sync-games', [AdminController::class, 'syncGgrGames'])->name('ggr.sync-games');
    
    Route::post('/settings/exchange-rate', [AdminController::class, 'updateExchangeRate'])->name('settings.exchange-rate');
    Route::get('/logs', [AdminController::class, 'logs'])->name('logs');

    // Statistics Routes
    Route::get('/statistics/agents', [AdminController::class, 'agentStatistics'])->name('statistics.agents');
    Route::get('/statistics/agents/export', [AdminController::class, 'exportAgentStatistics'])->name('statistics.agents.export');

    Route::get('/statistics/users', [AdminController::class, 'userStatistics'])->name('statistics.users');
    Route::get('/statistics/users/export', [AdminController::class, 'exportUserStatistics'])->name('statistics.users.export');

    // Control RTP Routes
    Route::get('/control-rtp', [AdminController::class, 'controlRtpPage'])->name('control-rtp');
    Route::post('/control-rtp/global-update', [AdminController::class, 'updateGlobalRtp'])->name('control-rtp.global-update');
    Route::post('/control-rtp/{user}', [AdminController::class, 'setUserRtp'])->name('control-rtp.update');
});


// App Alias Route for Control RTP
Route::middleware(['auth'])->get('/app/control_rtp', [AdminController::class, 'controlRtpPage']);


