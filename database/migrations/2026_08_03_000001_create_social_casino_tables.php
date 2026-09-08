<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Games Catalog Table
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('provider_game_id')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category'); // Baccarat, Roulette, Oracle, Blackjack, Slots
            $table->string('cover_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_recommended')->default(false);
            $table->timestamps();
        });

        // Game Sessions Table (for GammaPlus iframe launch)
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_token')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('active'); // active, closed
            $table->timestamps();
        });

        // Transactions Log (Bet, Win, Rollback)
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider_tx_id')->unique();
            $table->enum('type', ['bet', 'win', 'rollback', 'bonus']);
            $table->decimal('amount', 16, 2);
            $table->decimal('balance_before', 16, 2);
            $table->decimal('balance_after', 16, 2);
            $table->json('raw_payload')->nullable();
            $table->timestamps();
        });

        // Deposits Log (EUR Fiat -> Social Coins)
        Schema::create('deposits_log', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount_eur', 10, 2);
            $table->decimal('coins_received', 16, 2);
            $table->decimal('rate_used', 10, 2); // default 10.00
            $table->string('payment_method')->default('card'); // card, crypto, stripe
            $table->enum('status', ['pending', 'success', 'declined', 'refunded'])->default('pending');
            $table->string('provider_tx_id')->nullable();
            $table->timestamps();
        });

        // Application Settings (Key-Value)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('deposits_log');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('game_sessions');
        Schema::dropIfExists('games');
    }
};
