<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use App\Models\Transaction;

class JackpotService
{
    const CACHE_KEY = 'grand_jackpot_amount';
    const SEED_AMOUNT = 50000.00; // Starting jackpot pool after reset
    const DEFAULT_INITIAL = 1284959.92; // Initial seed for display

    /**
     * Get current accumulated progressive jackpot amount
     */
    public static function getCurrentJackpot(): float
    {
        return (float) Cache::rememberForever(self::CACHE_KEY, function () {
            return self::DEFAULT_INITIAL;
        });
    }

    /**
     * Add percentage of bet to progressive jackpot pool
     */
    public static function contributeBet(float $betAmount): float
    {
        if ($betAmount <= 0) {
            return self::getCurrentJackpot();
        }

        $contribution = $betAmount * 0.005; // 0.5% of bet added to jackpot
        $current = self::getCurrentJackpot();
        $newAmount = $current + $contribution;

        Cache::forever(self::CACHE_KEY, $newAmount);

        return $newAmount;
    }

    /**
     * Add explicit amount to persistent jackpot pool
     */
    public static function addAmount(float $amount): float
    {
        $current = self::getCurrentJackpot();
        $newAmount = $current + max(0, $amount);
        Cache::forever(self::CACHE_KEY, $newAmount);

        return $newAmount;
    }


    /**
     * Trigger/Claim Jackpot: Credit won amount to user and reset jackpot to SEED_AMOUNT
     */
    public static function claimJackpot($user): array
    {
        $wonAmount = self::getCurrentJackpot();

        if ($user) {
            $user->balance = (float) $user->balance + $wonAmount;
            $user->save();
        }

        // Reset Jackpot pool back to seed amount (50,000.00 SC)
        Cache::forever(self::CACHE_KEY, self::SEED_AMOUNT);

        return [
            'status' => 'success',
            'won_amount' => $wonAmount,
            'new_jackpot' => self::SEED_AMOUNT,
            'user_balance' => $user ? (float) $user->balance : 0.00,
        ];
    }
}
