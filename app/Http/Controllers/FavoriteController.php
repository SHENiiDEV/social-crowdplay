<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    /**
     * Get user's favorite game IDs
     */
    public function index(Request $request)
    {
        $user = $request->user() ?: User::first();

        if (!$user) {
            return response()->json(['favorite_ids' => []]);
        }

        $favoriteIds = DB::table('user_favorites')
            ->where('user_id', $user->id)
            ->pluck('game_id');

        return response()->json([
            'favorite_ids' => $favoriteIds,
        ]);
    }

    /**
     * Toggle game favorite status
     */
    public function toggle(Request $request)
    {
        $user = $request->user() ?: User::first();
        $gameId = (int) $request->input('game_id');

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401);
        }

        $existing = DB::table('user_favorites')
            ->where('user_id', $user->id)
            ->where('game_id', $gameId)
            ->first();

        if ($existing) {
            DB::table('user_favorites')
                ->where('user_id', $user->id)
                ->where('game_id', $gameId)
                ->delete();
            $isFavorite = false;
        } else {
            DB::table('user_favorites')->insert([
                'user_id' => $user->id,
                'game_id' => $gameId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $isFavorite = true;
        }

        return response()->json([
            'status' => 'success',
            'is_favorite' => $isFavorite,
            'game_id' => $gameId,
        ]);
    }
}
