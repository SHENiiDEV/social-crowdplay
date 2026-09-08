<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@socialcasino.com'],
            [
                'name' => 'Casino Admin',
                'password' => Hash::make('admin123'),
                'game_balance' => 10000.00,
                'referral_code' => 'ADMINVIP',
                'is_admin' => true,
                'status' => 'active',
            ]
        );

        // 2. Create Demo User
        User::updateOrCreate(
            ['email' => 'user@socialcasino.com'],
            [
                'name' => 'Alex Player',
                'password' => Hash::make('user123'),
                'game_balance' => 500.00,
                'referral_code' => 'ALEX2026',
                'is_admin' => false,
                'status' => 'active',
            ]
        );

        // 3. App Settings
        Setting::set('exchange_rate', '10'); // 1 EUR = 10 Coins
        Setting::set('promo_multiplier', '1.0');

        // 4. Seed Games Catalog
        $games = [
            [
                'provider_game_id' => 'gp_baccarat_vip',
                'title' => 'Baccarat Speed VIP',
                'slug' => 'baccarat-speed-vip',
                'category' => 'Baccarat',
                'cover_image' => 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => true,
                'sort_order' => 1,
            ],
            [
                'provider_game_id' => 'gp_baccarat_squeeze',
                'title' => 'Baccarat Squeeze',
                'slug' => 'baccarat-squeeze',
                'category' => 'Baccarat',
                'cover_image' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => false,
                'sort_order' => 2,
            ],
            [
                'provider_game_id' => 'gp_roulette_oracle',
                'title' => 'Oracle Lightning Roulette',
                'slug' => 'oracle-lightning-roulette',
                'category' => 'Roulette',
                'cover_image' => 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => true,
                'sort_order' => 3,
            ],
            [
                'provider_game_id' => 'gp_roulette_auto',
                'title' => 'Auto-Roulette VIP',
                'slug' => 'auto-roulette-vip',
                'category' => 'Roulette',
                'cover_image' => 'https://images.unsplash.com/photo-1596838132731-3301c3fd431b?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => false,
                'sort_order' => 4,
            ],
            [
                'provider_game_id' => 'gp_oracle_dragon',
                'title' => 'Oracle Dragon Tiger',
                'slug' => 'oracle-dragon-tiger',
                'category' => 'Oracle',
                'cover_image' => 'https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => true,
                'sort_order' => 5,
            ],
            [
                'provider_game_id' => 'gp_oracle_sicbo',
                'title' => 'Oracle Super Sic Bo',
                'slug' => 'oracle-super-sic-bo',
                'category' => 'Oracle',
                'cover_image' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => false,
                'sort_order' => 6,
            ],
            [
                'provider_game_id' => 'gp_blackjack_pro',
                'title' => 'Blackjack Unlimited VIP',
                'slug' => 'blackjack-unlimited-vip',
                'category' => 'Blackjack',
                'cover_image' => 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => true,
                'sort_order' => 7,
            ],
            [
                'provider_game_id' => 'gp_slots_megaways',
                'title' => 'Gamma Fortune Megaways',
                'slug' => 'gamma-fortune-megaways',
                'category' => 'Slots',
                'cover_image' => 'https://images.unsplash.com/photo-1596838132731-3301c3fd431b?auto=format&fit=crop&w=600&q=80',
                'is_recommended' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($games as $gameData) {
            Game::updateOrCreate(
                ['provider_game_id' => $gameData['provider_game_id']],
                $gameData
            );
        }
    }
}
