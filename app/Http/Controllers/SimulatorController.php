<?php

namespace App\Http\Controllers;

use App\Models\DepositLog;
use App\Models\GameSession;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SimulatorController extends Controller
{
    /**
     * Render payment simulator page for an order
     */
    public function paymentPage(Request $request, string $orderId)
    {
        $deposit = DepositLog::with('user')->where('order_id', $orderId)->firstOrFail();

        return Inertia::render('Simulator/Payment', [
            'deposit' => $deposit,
        ]);
    }

    /**
     * Render GammaPlus Iframe Game Simulation
     */
    public function iframePage(Request $request)
    {
        $gameId = $request->query('game_id');
        $token = $request->query('token');
        $isDemo = $request->boolean('demo');

        $session = GameSession::with(['user', 'game'])->where('session_token', $token)->first();

        return view('simulator.iframe', [
            'gameId' => $gameId,
            'token' => $token,
            'isDemo' => $isDemo,
            'session' => $session,
        ]);
    }

    /**
     * Render GGR Gold API Interactive Demo Player
     */
    public function ggrDemoPlayer(Request $request)
    {
        $userCode = $request->query('user_code');
        $providerCode = $request->query('provider_code', 'PRAGMATIC');
        $gameCode = $request->query('game_code', 'vs20doghouse');
        $title = $request->query('title', 'The Dog House');

        $user = User::where('user_code', $userCode)
            ->orWhere('id', (int) str_replace('user_', '', $userCode))
            ->first();

        return view('simulator.ggr_player', [
            'userCode' => $userCode,
            'providerCode' => $providerCode,
            'gameCode' => $gameCode,
            'title' => $title,
            'user' => $user,
        ]);
    }
}
