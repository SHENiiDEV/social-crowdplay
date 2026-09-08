<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category', 'All');
        $search = $request->query('search', '');

        $query = Game::where('is_active', true);

        if ($category !== 'All') {
            if ($category === 'Recommended') {
                $query->where('is_recommended', true);
            } else {
                $query->where('category', $category);
            }
        }

        if (!empty($search)) {
            $query->where('title', 'like', "%{$search}%");
        }

        $games = $query->orderBy('sort_order', 'asc')->get();

        $categories = ['All', 'Recommended', 'Slots', 'Live Casino', 'Roulette', 'Blackjack', 'Baccarat', 'Mini Games'];

        return Inertia::render('Home', [
            'games' => $games,
            'currentCategory' => $category,
            'searchQuery' => $search,
            'categories' => $categories,
            'jackpotAmount' => \App\Services\JackpotService::getCurrentJackpot(),
            'heroBanner' => [
                'title' => 'BLACKJACK VIP & SOCIAL BACCARAT',
                'subtitle' => 'Play top casino games with zero risk using Social Coins',
                'ctaText' => 'Play Now',
                'badge' => 'Exclusive GammaPlus Provider',
            ]
        ]);

    }
}
