<?php

namespace App\Http\Controllers;

use App\Models\GiftCard;
use App\Models\DepositLog;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GiftCardController extends Controller
{
    /**
     * Redeem a gift card code for the authenticated user.
     */
    public function redeem(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please log in or create an account to redeem gift cards.',
            ], 401);
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $code = strtoupper(trim($validated['code']));
        // Strip common whitespace/symbols if user pasted with spaces
        $normalizedCode = str_replace(' ', '', $code);

        $giftCard = GiftCard::where('code', $code)
            ->orWhere('code', $normalizedCode)
            ->first();

        if (!$giftCard) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gift card code not found. Please verify the code and try again.',
            ], 404);
        }

        if ($giftCard->status === 'redeemed') {
            $redeemedDate = $giftCard->redeemed_at ? $giftCard->redeemed_at->format('M d, Y') : 'earlier';
            return response()->json([
                'status' => 'error',
                'message' => "This gift card was already redeemed on {$redeemedDate}.",
            ], 422);
        }

        if ($giftCard->status === 'revoked') {
            return response()->json([
                'status' => 'error',
                'message' => 'This gift card has been cancelled or revoked.',
            ], 422);
        }

        if ($giftCard->expires_at && $giftCard->expires_at->isPast()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This gift card expired on ' . $giftCard->expires_at->format('Y-m-d') . '.',
            ], 422);
        }

        try {
            DB::transaction(function () use ($giftCard, $user) {
                // 1. Mark gift card as redeemed
                $giftCard->status = 'redeemed';
                $giftCard->redeemed_by = $user->id;
                $giftCard->redeemed_at = now();
                $giftCard->save();

                // 2. Add SC to user balance
                $amount = (float) $giftCard->amount_sc;
                $user->game_balance = (float) ($user->game_balance ?? 0) + $amount;
                $user->save();

                // 3. Log deposit / transaction
                DepositLog::create([
                    'user_id' => $user->id,
                    'order_id' => 'GIFT-' . $giftCard->code,
                    'amount_eur' => 0.00,
                    'coins_received' => $amount,
                    'payment_method' => 'gift_card',
                    'status' => 'success',
                ]);
            });

            Log::info("Gift card {$giftCard->code} ({$giftCard->amount_sc} SC) successfully redeemed by User {$user->id} ({$user->name}).");

            return response()->json([
                'status' => 'success',
                'message' => "Congratulations! You received +{$giftCard->amount_sc} Social Coins!",
                'amount_sc' => (float) $giftCard->amount_sc,
                'new_balance' => (float) $user->game_balance,
                'gift_card' => [
                    'code' => $giftCard->code,
                    'title' => $giftCard->title,
                    'amount_sc' => (float) $giftCard->amount_sc,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error("Failed to redeem gift card {$giftCard->code}: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred while redeeming. Please contact support.',
            ], 500);
        }
    }

    /**
     * Preview / Check a gift card status without redeeming.
     */
    public function check(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $code = strtoupper(trim($validated['code']));
        $giftCard = GiftCard::where('code', $code)->first();

        if (!$giftCard) {
            return response()->json([
                'valid' => false,
                'message' => 'Code not found',
            ], 404);
        }

        if (!$giftCard->isRedeemable()) {
            return response()->json([
                'valid' => false,
                'status' => $giftCard->status,
                'message' => $giftCard->status === 'redeemed' ? 'Already redeemed' : 'Invalid or expired',
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'amount_sc' => (float) $giftCard->amount_sc,
            'title' => $giftCard->title ?: 'CrowdPlay Gift Card',
            'code' => $giftCard->code,
        ]);
    }

    /**
     * User-facing generation of a gift card from their own balance.
     */
    public function generate(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'amount_sc' => ['required', 'numeric', 'min:1', 'max:100000'],
            'title' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:255'],
            'prefix' => ['nullable', 'string', 'max:10'],
        ]);

        $amount = (float) $validated['amount_sc'];
        $currentBalance = (float) ($user->game_balance ?? 0);

        // If not admin, check if user has enough balance to create a gift card
        if (!$user->is_admin && $currentBalance < $amount) {
            return response()->json([
                'status' => 'error',
                'message' => "Insufficient SC balance. You need at least {$amount} SC to generate this gift card.",
            ], 422);
        }

        try {
            $prefix = !empty($validated['prefix']) ? $validated['prefix'] : 'GIFT';
            $code = GiftCard::generateUniqueCode($prefix);

            $giftCard = DB::transaction(function () use ($user, $amount, $code, $validated) {
                if (!$user->is_admin) {
                    $user->game_balance = (float) $user->game_balance - $amount;
                    $user->save();
                }

                return GiftCard::create([
                    'code' => $code,
                    'amount_sc' => $amount,
                    'title' => $validated['title'] ?: "Gift from {$user->name}",
                    'note' => $validated['note'] ?? null,
                    'created_by' => $user->id,
                    'status' => 'active',
                ]);
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Gift card successfully generated!',
                'gift_card' => [
                    'id' => $giftCard->id,
                    'code' => $giftCard->code,
                    'amount_sc' => (float) $giftCard->amount_sc,
                    'title' => $giftCard->title,
                    'created_at' => $giftCard->created_at->format('Y-m-d H:i:s'),
                ],
                'new_balance' => (float) $user->game_balance,
            ]);
        } catch (\Throwable $e) {
            Log::error("Failed to generate gift card by user {$user->id}: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create gift card. Please try again.',
            ], 500);
        }
    }
}
