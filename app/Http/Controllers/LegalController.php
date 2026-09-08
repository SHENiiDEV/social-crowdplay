<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalController extends Controller
{
    public function terms()
    {
        return Inertia::render('Legal/Terms');
    }

    public function privacy()
    {
        return Inertia::render('Legal/Privacy');
    }

    public function aml()
    {
        return Inertia::render('Legal/Aml');
    }

    public function responsibleGaming()
    {
        return Inertia::render('Legal/ResponsibleGaming');
    }

    public function contact()
    {
        return Inertia::render('Others/Contact');
    }

    public function categories()
    {
        $categories = [
            [
                'name' => 'Baccarat',
                'description' => 'Fast-paced live social baccarat with squeeze and speed variations.',
                'count' => Game::where('category', 'Baccarat')->count(),
                'icon' => '🎴',
            ],
            [
                'name' => 'Roulette',
                'description' => 'European and Oracle Lightning Roulette with multipliers.',
                'count' => Game::where('category', 'Roulette')->count(),
                'icon' => '🎰',
            ],
            [
                'name' => 'Oracle',
                'description' => 'Super Sic Bo, Dragon Tiger, and Asian specialty table games.',
                'count' => Game::where('category', 'Oracle')->count(),
                'icon' => '🔮',
            ],
            [
                'name' => 'Blackjack',
                'description' => 'Unlimited VIP Blackjack tables with live interactive dealers.',
                'count' => Game::where('category', 'Blackjack')->count(),
                'icon' => '🃏',
            ],
            [
                'name' => 'Slots',
                'description' => 'Megaways and bonus buy video slots powered by GammaPlus.',
                'count' => Game::where('category', 'Slots')->count(),
                'icon' => '⚡',
            ],
        ];

        return Inertia::render('Others/Categories', [
            'categories' => $categories,
        ]);
    }

    public function faq()
    {
        return Inertia::render('Others/Faq');
    }

    public function about()
    {
        return Inertia::render('Others/About');
    }
}
