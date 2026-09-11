<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameSession;
use App\Models\User;
use App\Services\GgrApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GameController extends Controller
{
    public function play(Request $request, string $slug, GgrApiService $ggrApi)
    {
        $game = Game::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $user = $request->user();

        // 1. Require authentication to play games
        if (!$user) {
            return redirect()->route('home', ['auth_prompt' => 'register', 'game' => $slug])
                ->with('error', 'Please log in or register an account to play casino games.');
        }

        // 2. Ensure user has a user_code identifier
        if (empty($user->user_code)) {
            $user->user_code = 'user_' . $user->id;
            $user->save();
        }


        // 2. Create or refresh game session token
        $sessionToken = Str::uuid()->toString();
        $userCode = $user ? $user->user_code : ('guest_' . rand(100, 999));

        if ($user) {
            GameSession::create([
                'session_token' => $sessionToken,
                'user_id' => $user->id,
                'game_id' => $game->id,
                'status' => 'active',
            ]);
        }

        // 3. Obtain GGR launch URL via GgrApiService with target RTP control
        $providerCode = strtoupper($game->provider_code ?: 'PRAGMATIC');
        $gameCode = $game->game_code ?: $game->provider_game_id;
        $targetRtp = ($user && $user->target_rtp) ? (int) $user->target_rtp : null;

        if ($user && $targetRtp) {
            $ggrApi->controlRtp($user->user_code, $providerCode, $targetRtp);
        }

        $playerForLaunch = $user ?: new User(['user_code' => $userCode]);
        $launchRes = $ggrApi->launchGame($playerForLaunch, $providerCode, $gameCode, null);



        $launchUrl = null;
        if (($launchRes['status'] ?? 0) === 1 && !empty($launchRes['launch_url'])) {
            $launchUrl = $launchRes['launch_url'];
        }

        // Fallback to Interactive GGR Player if launch fails
        if (!$launchUrl) {
            $mockParams = http_build_query([
                'user_code' => $userCode,
                'provider_code' => $providerCode,
                'game_code' => $gameCode,
                'title' => $game->title,
            ]);
            $launchUrl = url("/ggr/demo-player?{$mockParams}");
        }

        return Inertia::render('GamePlay', [
            'game' => $game,
            'iframeUrl' => $launchUrl,
            'sessionToken' => $sessionToken,
            'isDemo' => !$user,
        ]);
    }
}
