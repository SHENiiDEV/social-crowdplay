<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'user_code')) {
                $table->string('user_code')->nullable()->unique();
            }
            if (!Schema::hasColumn('users', 'balance')) {
                $table->decimal('balance', 16, 2)->default(100.00);
            }
            if (!Schema::hasColumn('users', 'is_blocked')) {
                $table->boolean('is_blocked')->default(false);
            }
            if (!Schema::hasColumn('users', 'target_rtp')) {
                $table->integer('target_rtp')->default(92);
            }
        });

        Schema::table('games', function (Blueprint $table) {
            if (!Schema::hasColumn('games', 'provider_code')) {
                $table->string('provider_code')->default('PRAGMATIC');
            }
            if (!Schema::hasColumn('games', 'game_code')) {
                $table->string('game_code')->nullable();
            }
            if (!Schema::hasColumn('games', 'game_type')) {
                $table->enum('game_type', ['slot', 'live', 'SB', 'MN'])->default('slot');
            }
            if (!Schema::hasColumn('games', 'banner')) {
                $table->string('banner')->nullable();
            }
        });

        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'txn_id')) {
                $table->string('txn_id')->nullable()->unique();
            }
            if (!Schema::hasColumn('transactions', 'txn_type')) {
                $table->string('txn_type')->default('debit_credit');
            }
            if (!Schema::hasColumn('transactions', 'round_id')) {
                $table->string('round_id')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'bet_money')) {
                $table->decimal('bet_money', 16, 2)->default(0);
            }
            if (!Schema::hasColumn('transactions', 'win_money')) {
                $table->decimal('win_money', 16, 2)->default(0);
            }
            if (!Schema::hasColumn('transactions', 'provider_code')) {
                $table->string('provider_code')->nullable();
            }
            if (!Schema::hasColumn('transactions', 'game_code')) {
                $table->string('game_code')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['txn_id', 'txn_type', 'round_id', 'bet_money', 'win_money', 'provider_code', 'game_code']);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['provider_code', 'game_code', 'game_type', 'banner']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_code', 'balance', 'is_blocked', 'target_rtp']);
        });
    }
};
