<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'game_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'last_wheel_spin_at')) {
                $table->timestamp('last_wheel_spin_at')->nullable()->after('game_balance');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_favorites');
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'last_wheel_spin_at')) {
                $table->dropColumn('last_wheel_spin_at');
            }
        });
    }
};
