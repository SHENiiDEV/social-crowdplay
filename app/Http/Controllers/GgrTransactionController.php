<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GgrTransactionController extends Controller
{
    /**
     * Handle incoming GGR Gold API transaction & user_balance webhook callbacks.
     * Endpoint: POST /gold_api
     */
    public function handleTransaction(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Log incoming GGR callback payload for auditing
        Log::info('GGR Webhook Received', ['payload' => $payload]);

        // 1. Verify method (user_balance OR transaction)
        $method = $request->input('method');
        if (!in_array($method, ['transaction', 'user_balance'])) {
            return response()->json(['status' => 0, 'msg' => 'INVALID_METHOD']);
        }

        // 2. Verify agent credentials
        $agentCode = $request->input('agent_code');
        $agentSecret = $request->input('agent_secret');
        $expectedAgentCode = config('services.ggr.agent_code', 'crowdplay');
        $expectedAgentSecret = config('services.ggr.agent_secret', '7e49159d19c1db28e7f70966b1242606');

        if ($agentCode !== $expectedAgentCode || $agentSecret !== $expectedAgentSecret) {
            Log::warning('GGR Webhook: Invalid Agent Credentials', [
                'provided_agent' => $agentCode,
                'expected_agent' => $expectedAgentCode,
            ]);
            return response()->json(['status' => 0, 'msg' => 'INVALID_AGENT_CREDENTIALS']);
        }

        $userCode = $request->input('user_code');
        if (!$userCode) {
            return response()->json(['status' => 0, 'msg' => 'INVALID_PARAMETER']);
        }

        // 3. Handle method: "user_balance" (Initial balance check when game opens)
        if ($method === 'user_balance') {
            $user = User::where('user_code', $userCode)
                ->orWhere('id', (int) str_replace('user_', '', $userCode))
                ->first();

            if (!$user) {
                $user = User::create([
                    'name' => 'Player ' . substr($userCode, -6),
                    'email' => $userCode . '@crowdplay.local',
                    'password' => bcrypt('guest_password'),
                    'user_code' => $userCode,
                    'game_balance' => 10000.00,
                ]);
            }

            return response()->json([
                'status' => 1,
                'msg' => 'SUCCESS',
                'user_balance' => (float) $user->balance,
                'balance' => (float) $user->balance,
            ]);
        }

        // 4. Handle method: "transaction" (Bet & Win transactions)
        $gameType = $request->input('game_type', 'slot');

        // Extract game details object matching game_type key (slot / live / SB / MN)
        $gameData = $request->input($gameType) ?? $request->input('slot') ?? $request->input('live') ?? $request->input('SB') ?? $request->input('MN');

        if (!$gameData) {
            return response()->json(['status' => 0, 'msg' => 'INVALID_PARAMETER']);
        }

        $rawTxnId = $gameData['txn_id'] ?? null;
        $txnIdV2 = $gameData['txn_id_v2'] ?? null;
        $txnType = strtolower($gameData['txn_type'] ?? 'debit_credit');
        $betMoney = (float) ($gameData['bet_money'] ?? 0);
        $winMoney = (float) ($gameData['win_money'] ?? 0);
        $providerCode = strtoupper($gameData['provider_code'] ?? 'PRAGMATIC');
        $gameCode = $gameData['game_code'] ?? 'unknown';
        $roundId = (string) ($gameData['round_id'] ?? '');

        if (!$rawTxnId) {
            return response()->json(['status' => 0, 'msg' => 'MISSING_TXN_ID']);
        }

        $storeTxnId = $txnIdV2 ?: $rawTxnId;

        try {
            return DB::transaction(function () use ($userCode, $storeTxnId, $rawTxnId, $txnIdV2, $txnType, $betMoney, $winMoney, $providerCode, $gameCode, $roundId, $gameType, $payload) {
                // Idempotency Check: match exact txn_id_v2 OR (txn_id + txn_type)
                $existingTxn = Transaction::where(function ($q) use ($storeTxnId, $rawTxnId, $txnIdV2, $txnType) {
                    if ($txnIdV2) {
                        $q->where('txn_id', $txnIdV2)->orWhere('provider_tx_id', $txnIdV2);
                    } else {
                        $q->where('txn_id', $rawTxnId)->where('txn_type', $txnType);
                    }
                })->first();

                if ($existingTxn) {
                    $user = User::where('user_code', $userCode)
                        ->orWhere('id', (int) str_replace('user_', '', $userCode))
                        ->first();

                    return response()->json([
                        'status' => 1,
                        'msg' => 'SUCCESS',
                        'user_balance' => (float) ($user ? $user->balance : 10000.00),
                        'balance' => (float) ($user ? $user->balance : 10000.00),
                    ]);
                }

                // Lock User for Update (Atomic Balance Protection)
                $user = User::where('user_code', $userCode)
                    ->orWhere('id', (int) str_replace('user_', '', $userCode))
                    ->lockForUpdate()
                    ->first();

                // Auto-provision guest/demo user in DB if user does not exist yet
                if (!$user) {
                    $newUser = User::create([
                        'name' => 'Player ' . substr($userCode, -6),
                        'email' => $userCode . '@crowdplay.local',
                        'password' => bcrypt('guest_password'),
                        'user_code' => $userCode,
                        'game_balance' => 10000.00,
                    ]);
                    $user = User::where('id', $newUser->id)->lockForUpdate()->first();
                }

                if ($user->is_blocked) {
                    return response()->json(['status' => 0, 'msg' => 'USER_BLOCKED']);
                }

                $balanceBefore = (float) $user->balance;

                // Calculate net balance change based on txn_type
                if (in_array($txnType, ['debit', 'debit_credit'])) {
                    if ($balanceBefore < $betMoney) {
                        return response()->json([
                            'status' => 0,
                            'msg' => 'INSUFFICIENT_USER_FUNDS'
                        ]);
                    }
                }

                // User balance update matching the exact in-game spin win received from slot server
                $balanceAfter = $balanceBefore - $betMoney + $winMoney;
                $user->balance = max(0, $balanceAfter);
                $user->save();

                // Contribute 0.5% of bet to Progressive Jackpot Pool
                if ($betMoney > 0) {
                    \App\Services\JackpotService::contributeBet($betMoney);
                }

                // Associate game_id if present
                $game = Game::where('provider_code', $providerCode)
                    ->where('game_code', $gameCode)
                    ->first();

                // Log Transaction Record
                Transaction::create([
                    'user_id' => $user->id,
                    'game_id' => $game ? $game->id : null,
                    'provider_tx_id' => $storeTxnId,
                    'txn_id' => $storeTxnId,
                    'type' => $winMoney > 0 ? 'win' : 'bet',
                    'txn_type' => $txnType,
                    'round_id' => $roundId,
                    'amount' => max($betMoney, $winMoney),
                    'bet_money' => $betMoney,
                    'win_money' => $winMoney,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $user->balance,
                    'provider_code' => $providerCode,
                    'game_code' => $gameCode,
                    'raw_payload' => $payload,
                ]);

                return response()->json([
                    'status' => 1,
                    'msg' => 'SUCCESS',
                    'user_balance' => (float) $user->balance,
                    'balance' => (float) $user->balance,
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('GGR Seamless Webhook Error: ' . $e->getMessage(), [
                'exception' => $e,
                'payload' => $payload,
            ]);

            return response()->json([
                'status' => 0,
                'msg' => 'INTERNAL_ERROR',
            ]);
        }
    }
}

