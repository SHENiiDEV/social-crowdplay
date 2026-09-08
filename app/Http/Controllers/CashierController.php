<?php

namespace App\Http\Controllers;

use App\Models\DepositLog;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CashierController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'amount_eur' => ['required', 'numeric', 'min:1', 'max:5000'],
            'payment_method' => ['required', 'string'],
        ]);

        $user = $request->user();
        $rate = (float) Setting::get('exchange_rate', 10);
        $promoMultiplier = (float) Setting::get('promo_multiplier', 1.0);
        $effectiveRate = $rate * $promoMultiplier;

        $coinsToReceive = $validated['amount_eur'] * $effectiveRate;
        $orderId = 'ORD-' . strtoupper(Str::random(12));

        $deposit = DepositLog::create([
            'order_id' => $orderId,
            'user_id' => $user->id,
            'amount_eur' => $validated['amount_eur'],
            'coins_received' => $coinsToReceive,
            'rate_used' => $effectiveRate,
            'payment_method' => $validated['payment_method'],
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'order_id' => $orderId,
            'amount_eur' => $validated['amount_eur'],
            'coins' => $coinsToReceive,
            'redirect_url' => route('simulator.payment', ['order_id' => $orderId]),
        ]);
    }

    /**
     * Webhook Handler for Mock Payment Gateway (Stripe / CoinPayments / Cards)
     */
    public function webhook(Request $request)
    {
        $orderId = $request->input('order_id');
        $status = $request->input('status', 'success'); // 'success' or 'declined'
        $providerTxId = $request->input('provider_tx_id', 'TX-' . Str::random(10));

        try {
            return DB::transaction(function () use ($orderId, $status, $providerTxId) {
                $deposit = DepositLog::where('order_id', $orderId)->lockForUpdate()->first();

                if (!$deposit) {
                    return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
                }

                if ($deposit->status === 'success') {
                    return response()->json(['status' => 'already_processed', 'message' => 'Order already completed']);
                }

                if ($status === 'success') {
                    $deposit->status = 'success';
                    $deposit->provider_tx_id = $providerTxId;
                    $deposit->save();

                    // Atomically add game_balance to user
                    $user = User::where('id', $deposit->user_id)->lockForUpdate()->first();
                    if ($user) {
                        $user->game_balance += $deposit->coins_received;
                        $user->save();
                    }

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Payment processed and coins added to user balance!',
                        'user_balance' => (float) $user->game_balance,
                    ]);
                } else {
                    $deposit->status = 'declined';
                    $deposit->save();

                    return response()->json([
                        'status' => 'declined',
                        'message' => 'Payment was declined by processor.',
                    ]);
                }
            });
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
