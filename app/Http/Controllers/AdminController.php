<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Game;
use App\Models\Transaction;
use App\Models\DepositLog;
use App\Models\Setting;
use App\Services\GgrApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(GgrApiService $ggrApi)
    {
        $totalUsers = User::count();
        $totalDepositsEur = DepositLog::where('status', 'success')->sum('amount_eur');
        $totalCoinsDistributed = DepositLog::where('status', 'success')->sum('coins_received');
        $totalBets = Transaction::where('type', 'bet')->sum('amount');
        $totalWins = Transaction::where('type', 'win')->sum('amount');
        
        $recentUsers = User::latest()->limit(5)->get();
        $recentDeposits = DepositLog::with('user')->latest()->limit(5)->get();

        $agentInfo = $ggrApi->getMoneyInfo();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_deposits_eur' => (float) $totalDepositsEur,
                'total_coins_distributed' => (float) $totalCoinsDistributed,
                'total_bets' => (float) $totalBets,
                'total_wins' => (float) $totalWins,
                'ggr' => (float) ($totalBets - $totalWins),
                'ggr_agent_balance' => (float) ($agentInfo['agent']['balance'] ?? 0),
            ],
            'recentUsers' => $recentUsers,
            'recentDeposits' => $recentDeposits,
            'exchangeRate' => (float) Setting::get('exchange_rate', 10),
            'promoMultiplier' => (float) Setting::get('promo_multiplier', 1.0),
        ]);
    }

    public function users()
    {
        $users = User::withCount('deposits')->latest()->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function toggleUserStatus(Request $request, User $user)
    {
        $user->is_blocked = !$user->is_blocked;
        $user->status = $user->is_blocked ? 'blocked' : 'active';
        $user->save();

        $message = "User {$user->name} status updated to {$user->status}.";

        if ($user->is_blocked) {
            $caseNumber = 'CASE-' . date('Y') . '-' . str_pad((string)$user->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(substr(md5((string)$user->id . microtime()), 0, 6));

            try {
                // Send Official Notice to Compliance (renat@crowdplay.io)
                \Illuminate\Support\Facades\Mail::to('renat@crowdplay.io')
                    ->send(new \App\Mail\AccountBlockedNoticeMail($user, $caseNumber, 'renat@crowdplay.io'));

                // Also send copy to user's registered email if valid
                if (!empty($user->email) && filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
                    \Illuminate\Support\Facades\Mail::to($user->email)
                        ->send(new \App\Mail\AccountBlockedNoticeMail($user, $caseNumber, $user->email));
                }

                \Illuminate\Support\Facades\Log::info("Official Block Notice sent for {$user->name} [{$caseNumber}] to renat@crowdplay.io");
                $message = "User {$user->name} blocked. Official Notice ({$caseNumber}) sent to renat@crowdplay.io";
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error("Failed sending block email for user {$user->id}: " . $e->getMessage());
                $message = "User {$user->name} blocked. (Notice generated: {$caseNumber})";
            }
        }

        return redirect()->back()->with('success', $message);
    }


    public function setUserRtp(Request $request, User $user, GgrApiService $ggrApi)
    {
        $validated = $request->validate([
            'rtp' => ['required', 'integer', 'min:1', 'max:999'],
            'provider_code' => ['nullable', 'string'],
        ]);

        $user->target_rtp = $validated['rtp'];
        $user->save();

        $userCode = $user->user_code ?: ('user_' . $user->id);
        $providers = $validated['provider_code'] ? [$validated['provider_code']] : ['PRAGMATIC', 'PGSOFT', 'HACKSAW', 'PLAYNGO', 'AMATIC', 'EGT'];

        foreach ($providers as $prov) {
            $ggrApi->controlRtp($userCode, $prov, $user->target_rtp);
        }

        return redirect()->back()->with('success', "Target RTP for {$user->name} set to {$user->target_rtp}% across slot providers.");
    }


    /**
     * Update Global Default User RTP
     */
    public function updateGlobalRtp(Request $request)
    {
        $validated = $request->validate([
            'global_default_rtp' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        Setting::set('global_default_rtp', $validated['global_default_rtp']);

        return redirect()->back()->with('success', "Global Default User RTP updated to {$validated['global_default_rtp']}%.");
    }

    /**
     * Control RTP Management Page for Slot Games
     */
    public function controlRtpPage(Request $request)
    {
        $users = User::latest()->paginate(30);
        $slotProviders = [
            ['code' => 'PRAGMATIC', 'name' => 'Pragmatic Play Slots'],
            ['code' => 'PGSOFT', 'name' => 'PG Soft Slots'],
            ['code' => 'HACKSAW', 'name' => 'Hacksaw Gaming Slots'],
            ['code' => 'PLAYNGO', 'name' => "Play'n GO Slots"],
            ['code' => 'AMATIC', 'name' => 'Amatic Slots'],
            ['code' => 'EGT', 'name' => 'EGT Interactive Slots'],
        ];

        return Inertia::render('Admin/ControlRtp', [
            'users' => $users,
            'slotProviders' => $slotProviders,
            'agentRtpBenchmark' => 95,
            'globalDefaultRtp' => (int) Setting::get('global_default_rtp', 90),
        ]);
    }



    public function adjustBalance(Request $request, User $user)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric'],
            'reason' => ['nullable', 'string'],
        ]);

        $balanceBefore = $user->balance;
        $user->balance += $validated['amount'];
        $user->save();

        Transaction::create([
            'user_id' => $user->id,
            'game_id' => null,
            'provider_tx_id' => 'ADMIN-ADJUST-' . time() . '-' . rand(100, 999),
            'txn_id' => 'ADMIN-ADJUST-' . time() . '-' . rand(100, 999),
            'type' => 'bonus',
            'amount' => abs($validated['amount']),
            'balance_before' => $balanceBefore,
            'balance_after' => $user->balance,
            'raw_payload' => ['reason' => $validated['reason'] ?? 'Manual admin adjustment'],
        ]);

        return redirect()->back()->with('success', "Adjusted balance for {$user->name} by {$validated['amount']} coins.");
    }

    public function games()
    {
        $games = Game::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Games', [
            'games' => $games,
        ]);
    }

    public function toggleGame(Request $request, Game $game)
    {
        $game->is_active = !$game->is_active;
        $game->save();

        return redirect()->back()->with('success', "Game '{$game->title}' status updated.");
    }

    public function syncGgrGames(Request $request)
    {
        Artisan::call('ggr:sync-games');
        $output = Artisan::output();

        return redirect()->back()->with('success', 'GGR Games synced successfully! ' . trim($output));
    }

    public function updateExchangeRate(Request $request)
    {
        $validated = $request->validate([
            'exchange_rate' => ['required', 'numeric', 'min:1'],
            'promo_multiplier' => ['required', 'numeric', 'min:0.5', 'max:10'],
        ]);

        Setting::set('exchange_rate', $validated['exchange_rate']);
        Setting::set('promo_multiplier', $validated['promo_multiplier']);

        return redirect()->back()->with('success', 'Exchange rate and promotional multiplier updated.');
    }

    public function logs()
    {
        $transactions = Transaction::with(['user', 'game'])->latest()->paginate(25);
        $deposits = DepositLog::with('user')->latest()->paginate(25);

        return Inertia::render('Admin/Logs', [
            'transactions' => $transactions,
            'deposits' => $deposits,
        ]);
    }

    /**
     * Agent Statistics Page (Hourly / Daily balance & consumption analytics)
     */
    public function agentStatistics(Request $request, GgrApiService $ggrApi)
    {
        $grouping = $request->input('grouping', 'daily'); // 'hourly' or 'daily'
        $startDate = $request->input('start_date', now()->subDays(14)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $query = Transaction::whereBetween('created_at', [
            $startDate . ' 00:00:00',
            $endDate . ' 23:59:59'
        ]);

        $dateFormat = $grouping === 'hourly' ? '%Y-%m-%d %H:00' : '%Y-%m-%d';

        $statsData = (clone $query)
            ->selectRaw("
                DATE_FORMAT(created_at, '{$dateFormat}') as time_key,
                SUM(bet_money) as total_bets,
                SUM(win_money) as total_wins,
                SUM(bet_money - win_money) as net_ggr,
                COUNT(*) as total_spins
            ")
            ->groupBy('time_key')
            ->orderBy('time_key', 'asc')
            ->get();

        $agentInfo = $ggrApi->getMoneyInfo();

        return Inertia::render('Admin/AgentStatistics', [
            'statsData' => $statsData,
            'grouping' => $grouping,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'agentBalance' => (float) ($agentInfo['agent']['balance'] ?? 0),
        ]);
    }

    /**
     * Export Agent Statistics to Excel/CSV
     */
    public function exportAgentStatistics(Request $request)
    {
        $grouping = $request->input('grouping', 'daily');
        $startDate = $request->input('start_date', now()->subDays(14)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $dateFormat = $grouping === 'hourly' ? '%Y-%m-%d %H:00' : '%Y-%m-%d';

        $records = Transaction::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->selectRaw("
                DATE_FORMAT(created_at, '{$dateFormat}') as time_key,
                SUM(bet_money) as total_bets,
                SUM(win_money) as total_wins,
                SUM(bet_money - win_money) as net_ggr,
                COUNT(*) as total_spins
            ")
            ->groupBy('time_key')
            ->orderBy('time_key', 'asc')
            ->get();

        $filename = "agent_statistics_{$grouping}_{$startDate}_to_{$endDate}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($records, $grouping) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [$grouping === 'hourly' ? 'Date & Hour' : 'Date', 'Total Bets (SC)', 'Total Wins (SC)', 'Net GGR (SC)', 'Total Spins']);

            foreach ($records as $row) {
                fputcsv($file, [
                    $row->time_key,
                    number_format((float)$row->total_bets, 2, '.', ''),
                    number_format((float)$row->total_wins, 2, '.', ''),
                    number_format((float)$row->net_ggr, 2, '.', ''),
                    $row->total_spins,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * User Statistics Page (Per-player bet summaries)
     */
    public function userStatistics(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $userStats = User::withCount(['transactions as spin_count' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }])
            ->withSum(['transactions as total_bets' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }], 'bet_money')
            ->withSum(['transactions as total_wins' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }], 'win_money')
            ->latest()
            ->paginate(30);

        return Inertia::render('Admin/UserStatistics', [
            'userStats' => $userStats,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    /**
     * Export User Statistics to Excel/CSV
     */
    public function exportUserStatistics(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $users = User::withCount(['transactions as spin_count' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }])
            ->withSum(['transactions as total_bets' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }], 'bet_money')
            ->withSum(['transactions as total_wins' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
            }], 'win_money')
            ->get();

        $filename = "user_statistics_{$startDate}_to_{$endDate}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($users) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['User ID', 'User Code', 'Name', 'Email', 'Total Bets (SC)', 'Total Wins (SC)', 'Net GGR (SC)', 'Actual RTP %', 'Total Spins']);

            foreach ($users as $u) {
                $bets = (float) ($u->total_bets ?? 0);
                $wins = (float) ($u->total_wins ?? 0);
                $ggr = $bets - $wins;
                $rtp = $bets > 0 ? number_format(($wins / $bets) * 100, 2, '.', '') . '%' : '0.00%';

                fputcsv($file, [
                    $u->id,
                    $u->user_code ?? ('user_' . $u->id),
                    $u->name,
                    $u->email,
                    number_format($bets, 2, '.', ''),
                    number_format($wins, 2, '.', ''),
                    number_format($ggr, 2, '.', ''),
                    $rtp,
                    $u->spin_count ?? 0,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

