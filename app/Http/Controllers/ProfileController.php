<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display user profile page with statistics and spin history
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('home')->with('error', 'Please log in to view your profile.');
        }

        // Calculate User Statistics
        $totalSpins = Transaction::where('user_id', $user->id)->count();
        $totalBet = (float) Transaction::where('user_id', $user->id)->sum('bet_money');
        $totalWin = (float) Transaction::where('user_id', $user->id)->sum('win_money');
        $biggestWin = (float) Transaction::where('user_id', $user->id)->max('win_money');
        $netProfit = $totalWin - $totalBet;

        // Fetch recent spin history
        $recentTransactions = Transaction::with('game')
            ->where('user_id', $user->id)
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('Profile', [
            'stats' => [
                'total_spins' => $totalSpins,
                'total_bet' => $totalBet,
                'total_win' => $totalWin,
                'biggest_win' => $biggestWin,
                'net_profit' => $netProfit,
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * Update user profile information
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user->name = $request->input('name');
        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Public Live Feed API of recent wins for ticker marquee and live feed widget
     */
    public function liveWins()
    {
        $realWins = Transaction::with(['user', 'game'])
            ->where('win_money', '>', 0)
            ->latest()
            ->take(15)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'user' => $t->user ? maskUsername($t->user->name) : 'Player_' . rand(100, 999),
                    'game' => $t->game ? $t->game->title : ($t->game_code ?: 'The Dog House'),
                    'provider' => $t->provider_code ?: 'PRAGMATIC',
                    'bet' => (float) $t->bet_money,
                    'win' => (float) $t->win_money,
                    'multiplier' => $t->bet_money > 0 ? round($t->win_money / $t->bet_money, 1) : 1,
                    'time' => $t->created_at->diffForHumans(),
                ];
            });

        // Rich pool of realistic live wins to maintain continuous live ticker motion
        $mockFeed = [
            ['id' => 'm1', 'user' => 'Alex_Crypto', 'game' => 'Gates of Olympus 1000', 'provider' => 'PRAGMATIC', 'bet' => 20.00, 'win' => 1484.60, 'multiplier' => 74.2, 'time' => '1m ago'],
            ['id' => 'm2', 'user' => 'Elena_Spins', 'game' => 'Aviator Crash', 'provider' => 'SPRIBE', 'bet' => 50.00, 'win' => 2458.25, 'multiplier' => 49.1, 'time' => '2m ago'],
            ['id' => 'm3', 'user' => 'Winner777', 'game' => 'Sweet Bonanza', 'provider' => 'PRAGMATIC', 'bet' => 10.00, 'win' => 854.80, 'multiplier' => 85.4, 'time' => '3m ago'],
            ['id' => 'm4', 'user' => 'Sarah_M', 'game' => 'Lightning Roulette', 'provider' => 'EVOLUTION', 'bet' => 100.00, 'win' => 4985.50, 'multiplier' => 49.8, 'time' => '4m ago'],
            ['id' => 'm5', 'user' => 'Marcus_B', 'game' => 'Wanted Dead or a Wild', 'provider' => 'HACKSAW', 'bet' => 25.00, 'win' => 3127.40, 'multiplier' => 125.1, 'time' => '5m ago'],
            ['id' => 'm6', 'user' => 'Satoshi_N', 'game' => 'The Dog House Multihold', 'provider' => 'PRAGMATIC', 'bet' => 5.00, 'win' => 642.15, 'multiplier' => 128.4, 'time' => '6m ago'],
            ['id' => 'm7', 'user' => 'Katerina_S', 'game' => 'Sugar Rush 1000', 'provider' => 'PRAGMATIC', 'bet' => 40.00, 'win' => 2803.90, 'multiplier' => 70.1, 'time' => '7m ago'],
            ['id' => 'm8', 'user' => 'Dmitry_K', 'game' => 'Rip City', 'provider' => 'HACKSAW', 'bet' => 15.00, 'win' => 978.45, 'multiplier' => 65.2, 'time' => '8m ago'],
            ['id' => 'm9', 'user' => 'JackpotKing', 'game' => 'Zeus vs Hades Gods of War', 'provider' => 'PRAGMATIC', 'bet' => 100.00, 'win' => 14560.80, 'multiplier' => 145.6, 'time' => '9m ago'],
            ['id' => 'm10', 'user' => 'Vadim_R', 'game' => 'Book of Dead', 'provider' => 'PLAYNGO', 'bet' => 30.00, 'win' => 1805.35, 'multiplier' => 60.1, 'time' => '10m ago'],
            ['id' => 'm11', 'user' => 'Sofia_Luck', 'game' => 'Starlight Princess 1000', 'provider' => 'PRAGMATIC', 'bet' => 20.00, 'win' => 2109.70, 'multiplier' => 105.5, 'time' => '11m ago'],
            ['id' => 'm12', 'user' => 'Lucas_M', 'game' => 'Speed Baccarat A', 'provider' => 'EVOLUTION', 'bet' => 200.00, 'win' => 4012.50, 'multiplier' => 20.0, 'time' => '12m ago'],
        ];


        $combined = collect($realWins)->merge($mockFeed)->take(25);

        return response()->json([
            'status' => 'success',
            'wins' => $combined,
        ]);
    }
}


/**
 * Mask username for privacy (e.g. "Alexander" -> "Alex***")
 */
function maskUsername(string $name): string
{
    if (strlen($name) <= 3) {
        return $name . '***';
    }
    return substr($name, 0, 4) . '***';
}
