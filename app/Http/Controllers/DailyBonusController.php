<?php

namespace App\Http\Controllers;

use App\Models\DepositLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DailyBonusController extends Controller
{
    /**
     * Get Daily 1 SC Bonus Status (24-hour cooldown)
     */
    public function status(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'success',
                'authenticated' => false,
                'can_claim' => false,
                'cooldown_seconds' => 0,
                'amount' => 1.00,
                'reason' => 'unauthenticated',
            ]);
        }

        $lastClaim = $user->last_daily_bonus_at;
        if (!$lastClaim) {
            return response()->json([
                'status' => 'success',
                'authenticated' => true,
                'can_claim' => true,
                'cooldown_seconds' => 0,
                'amount' => 1.00,
            ]);
        }

        $nextAvailable = Carbon::parse($lastClaim)->addHours(24);
        $now = Carbon::now();

        if ($now->greaterThanOrEqualTo($nextAvailable)) {
            return response()->json([
                'status' => 'success',
                'authenticated' => true,
                'can_claim' => true,
                'cooldown_seconds' => 0,
                'amount' => 1.00,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'authenticated' => true,
            'can_claim' => false,
            'cooldown_seconds' => $now->diffInSeconds($nextAvailable),
            'next_available' => $nextAvailable->toIso8601String(),
            'amount' => 1.00,
        ]);
    }

    /**
     * Claim Daily Free 1 SC Bonus
     */
    public function claim(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please log in or create an account to claim your free daily 1.00 SC.',
            ], 401);
        }

        $lastClaim = $user->last_daily_bonus_at;
        if ($lastClaim && Carbon::now()->lessThan(Carbon::parse($lastClaim)->addHours(24))) {
            $nextAvailable = Carbon::parse($lastClaim)->addHours(24);
            $secondsRemaining = Carbon::now()->diffInSeconds($nextAvailable);
            $hours = floor($secondsRemaining / 3600);
            $minutes = floor(($secondsRemaining % 3600) / 60);

            return response()->json([
                'status' => 'error',
                'message' => "Daily bonus already claimed. Next claim available in {$hours}h {$minutes}m.",
                'cooldown_seconds' => $secondsRemaining,
                'next_available' => $nextAvailable->toIso8601String(),
            ], 422);
        }

        $bonusAmount = 1.00;
        $user->game_balance = (float) $user->game_balance + $bonusAmount;
        $user->last_daily_bonus_at = Carbon::now();
        $user->save();

        // Record in DepositLog for audit trail
        try {
            DepositLog::create([
                'order_id' => 'BONUS-' . strtoupper(Str::random(10)),
                'user_id' => $user->id,
                'amount_eur' => 0.00,
                'coins_received' => $bonusAmount,
                'rate_used' => 1.0,
                'payment_method' => 'daily_free_bonus',
                'status' => 'success',
            ]);
        } catch (\Throwable $e) {
            // Ignore if deposit log fails
        }

        return response()->json([
            'status' => 'success',
            'message' => '🎁 Free Daily Reward Claimed! +1.00 SC added to your balance.',
            'reward_amount' => $bonusAmount,
            'new_balance' => (float) $user->game_balance,
            'cooldown_seconds' => 86400,
            'next_available' => Carbon::now()->addHours(24)->toIso8601String(),
        ]);
    }
}
