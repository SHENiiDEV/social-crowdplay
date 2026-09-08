<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WheelController extends Controller
{
    const SLICES = [
        ['id' => 0, 'amount' => 1, 'label' => '1 SC', 'color' => '#3b82f6'],
        ['id' => 1, 'amount' => 2, 'label' => '2 SC', 'color' => '#10b981'],
        ['id' => 2, 'amount' => 3, 'label' => '3 SC', 'color' => '#8b5cf6'],
        ['id' => 3, 'amount' => 4, 'label' => '4 SC', 'color' => '#f59e0b'],
        ['id' => 4, 'amount' => 5, 'label' => '5 SC', 'color' => '#ec4899'],
        ['id' => 5, 'amount' => 6, 'label' => '6 SC', 'color' => '#06b6d4'],
        ['id' => 6, 'amount' => 8, 'label' => '8 SC', 'color' => '#a855f7'],
        ['id' => 7, 'amount' => 10, 'label' => '10 SC', 'color' => '#fbbf24'],
    ];



    /**
     * Check if user can spin daily wheel (24h cooldown)
     */
    public function status(Request $request)
    {
        $user = $request->user() ?: User::first();

        if (!$user) {
            return response()->json(['can_spin' => false, 'reason' => 'unauthenticated']);
        }

        $lastSpin = $user->last_wheel_spin_at;
        if (!$lastSpin) {
            return response()->json(['can_spin' => true, 'cooldown_seconds' => 0]);
        }

        $nextSpinAvailable = Carbon::parse($lastSpin)->addHours(24);
        $now = Carbon::now();

        if ($now->greaterThanOrEqualTo($nextSpinAvailable)) {
            return response()->json(['can_spin' => true, 'cooldown_seconds' => 0]);
        }

        $secondsRemaining = $now->diffInSeconds($nextSpinAvailable);

        return response()->json([
            'can_spin' => false,
            'cooldown_seconds' => $secondsRemaining,
            'next_available' => $nextSpinAvailable->toIso8601String(),
        ]);
    }

    /**
     * Execute spin on daily wheel and credit reward
     */
    public function spin(Request $request)
    {
        $user = $request->user() ?: User::first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401);
        }

        $lastSpin = $user->last_wheel_spin_at;
        if ($lastSpin && Carbon::now()->lessThan(Carbon::parse($lastSpin)->addHours(24))) {
            return response()->json(['status' => 'error', 'message' => 'Wheel already spun today. Please wait for cooldown.'], 403);
        }

        // Pick slice (weighted randomly towards fun engagement)
        $winningSliceIndex = rand(0, count(self::SLICES) - 1);
        $slice = self::SLICES[$winningSliceIndex];
        $rewardAmount = (float) $slice['amount'];

        // Credit reward to user balance
        $user->balance = (float) $user->balance + $rewardAmount;
        $user->last_wheel_spin_at = Carbon::now();
        $user->save();

        return response()->json([
            'status' => 'success',
            'winning_slice' => $winningSliceIndex,
            'reward_amount' => $rewardAmount,
            'reward_label' => $slice['label'],
            'new_balance' => (float) $user->balance,
        ]);
    }
}
