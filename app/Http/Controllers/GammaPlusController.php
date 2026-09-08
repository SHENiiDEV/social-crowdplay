<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Game;
use App\Models\Transaction;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GammaPlusController extends Controller
{
    private string $secretKey = 'gammaplus_secret_key_change_in_prod';

    /**
     * Validate HMAC-SHA256 signature from GammaPlus
     */
    private function isValidSignature(Request $request): bool
    {
        $signature = $request->header('X-GammaPlus-Signature') ?? $request->input('signature');
        if (!$signature) {
            return false;
        }

        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $this->secretKey);

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Authenticate / Check Balance before bet
     */
    public function authenticate(Request $request)
    {
        $token = $request->input('token');
        $session = GameSession::where('session_token', $token)->where('status', 'active')->first();

        if (!$session) {
            return response()->json([
                'status' => 'error',
                'error_code' => 'INVALID_TOKEN',
                'message' => 'Session not found or expired',
            ], 401);
        }

        $user = $session->user;
        if ($user->status === 'blocked') {
            return response()->json([
                'status' => 'error',
                'error_code' => 'USER_BLOCKED',
                'message' => 'User account is blocked',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'user_id' => (string) $user->id,
            'username' => $user->name,
            'currency' => 'SC', // Social Coins
            'balance' => (float) $user->game_balance,
        ]);
    }

    /**
     * Balance Check Endpoint
     */
    public function balance(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['status' => 'error', 'error_code' => 'USER_NOT_FOUND'], 404);
        }

        return response()->json([
            'status' => 'success',
            'user_id' => (string) $user->id,
            'balance' => (float) $user->game_balance,
        ]);
    }

    /**
     * Bet (Atomic deduction of Social Coins)
     */
    public function bet(Request $request)
    {
        $userId = $request->input('user_id');
        $amount = (float) $request->input('amount');
        $providerTxId = $request->input('provider_tx_id');
        $gameId = $request->input('game_id');

        if ($amount < 0) {
            return response()->json(['status' => 'error', 'error_code' => 'INVALID_AMOUNT'], 422);
        }

        try {
            return DB::transaction(function () use ($userId, $amount, $providerTxId, $gameId, $request) {
                // Lock user row for update to ensure atomic operations
                $user = User::where('id', $userId)->lockForUpdate()->first();

                if (!$user) {
                    return response()->json(['status' => 'error', 'error_code' => 'USER_NOT_FOUND'], 404);
                }

                // Check duplicate transaction
                if (Transaction::where('provider_tx_id', $providerTxId)->exists()) {
                    return response()->json([
                        'status' => 'success',
                        'balance' => (float) $user->game_balance,
                        'message' => 'Duplicate transaction',
                    ]);
                }

                if ($user->game_balance < $amount) {
                    return response()->json([
                        'status' => 'error',
                        'error_code' => 'INSUFFICIENT_FUNDS',
                        'message' => 'Not enough social coins',
                        'balance' => (float) $user->game_balance,
                    ], 400);
                }

                $balanceBefore = (float) $user->game_balance;
                $user->game_balance -= $amount;
                $user->save();
                $balanceAfter = (float) $user->game_balance;

                $game = Game::where('provider_game_id', $gameId)->first();

                Transaction::create([
                    'user_id' => $user->id,
                    'game_id' => $game ? $game->id : null,
                    'provider_tx_id' => $providerTxId,
                    'type' => 'bet',
                    'amount' => $amount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'raw_payload' => $request->all(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'tx_id' => $providerTxId,
                    'balance' => $balanceAfter,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('GammaPlus Bet Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'error_code' => 'SERVER_ERROR'], 500);
        }
    }

    /**
     * Win (Atomic addition of Social Coins)
     */
    public function win(Request $request)
    {
        $userId = $request->input('user_id');
        $amount = (float) $request->input('amount');
        $providerTxId = $request->input('provider_tx_id');
        $gameId = $request->input('game_id');

        try {
            return DB::transaction(function () use ($userId, $amount, $providerTxId, $gameId, $request) {
                $user = User::where('id', $userId)->lockForUpdate()->first();

                if (!$user) {
                    return response()->json(['status' => 'error', 'error_code' => 'USER_NOT_FOUND'], 404);
                }

                // Check duplicate transaction
                if (Transaction::where('provider_tx_id', $providerTxId)->exists()) {
                    return response()->json([
                        'status' => 'success',
                        'balance' => (float) $user->game_balance,
                        'message' => 'Duplicate transaction',
                    ]);
                }

                $balanceBefore = (float) $user->game_balance;
                $user->game_balance += $amount;
                $user->save();
                $balanceAfter = (float) $user->game_balance;

                $game = Game::where('provider_game_id', $gameId)->first();

                Transaction::create([
                    'user_id' => $user->id,
                    'game_id' => $game ? $game->id : null,
                    'provider_tx_id' => $providerTxId,
                    'type' => 'win',
                    'amount' => $amount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'raw_payload' => $request->all(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'tx_id' => $providerTxId,
                    'balance' => $balanceAfter,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('GammaPlus Win Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'error_code' => 'SERVER_ERROR'], 500);
        }
    }

    /**
     * Rollback (Revert transaction)
     */
    public function rollback(Request $request)
    {
        $userId = $request->input('user_id');
        $providerTxId = $request->input('provider_tx_id');
        $originalTxId = $request->input('original_tx_id');

        try {
            return DB::transaction(function () use ($userId, $providerTxId, $originalTxId, $request) {
                $user = User::where('id', $userId)->lockForUpdate()->first();

                if (!$user) {
                    return response()->json(['status' => 'error', 'error_code' => 'USER_NOT_FOUND'], 404);
                }

                $originalTx = Transaction::where('provider_tx_id', $originalTxId)->first();
                if (!$originalTx) {
                    return response()->json([
                        'status' => 'success',
                        'balance' => (float) $user->game_balance,
                        'message' => 'Original transaction not found, nothing to rollback',
                    ]);
                }

                if (Transaction::where('provider_tx_id', $providerTxId)->exists()) {
                    return response()->json([
                        'status' => 'success',
                        'balance' => (float) $user->game_balance,
                        'message' => 'Rollback already processed',
                    ]);
                }

                $balanceBefore = (float) $user->game_balance;
                if ($originalTx->type === 'bet') {
                    $user->game_balance += $originalTx->amount;
                } elseif ($originalTx->type === 'win') {
                    $user->game_balance -= $originalTx->amount;
                }
                $user->save();
                $balanceAfter = (float) $user->game_balance;

                Transaction::create([
                    'user_id' => $user->id,
                    'game_id' => $originalTx->game_id,
                    'provider_tx_id' => $providerTxId,
                    'type' => 'rollback',
                    'amount' => $originalTx->amount,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'raw_payload' => $request->all(),
                ]);

                return response()->json([
                    'status' => 'success',
                    'balance' => $balanceAfter,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('GammaPlus Rollback Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'error_code' => 'SERVER_ERROR'], 500);
        }
    }
}
