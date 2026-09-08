<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Services\GgrApiService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GgrSyncGames extends Command
{
    protected $signature = 'ggr:sync-games {--fresh : Truncate existing games table before syncing}';
    protected $description = 'Sync game providers, banners, and categories from GGR Gold API into MySQL database';

    public function handle(GgrApiService $ggrApi): int
    {
        $this->info('Starting GGR Gold API games catalog sync...');

        if ($this->option('fresh')) {
            $this->warn('Truncating existing games table...');
            Game::query()->delete();
        }

        $providersRes = $ggrApi->getProviders();

        if (($providersRes['status'] ?? 0) !== 1) {
            $this->error('Failed to fetch providers: ' . ($providersRes['msg'] ?? 'UNKNOWN_ERROR'));
            return Command::FAILURE;
        }

        $providers = $providersRes['providers'] ?? [];
        $this->info('Found ' . count($providers) . ' providers from GGR API.');

        $totalSynced = 0;
        $categoryCounts = [];

        $fallbackCovers = [
            'Slots' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
            'Baccarat' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60',
            'Roulette' => 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800&auto=format&fit=crop&q=60',
            'Blackjack' => 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
            'Mini Games' => 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&auto=format&fit=crop&q=60',
            'Sportsbook' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=60',
        ];

        foreach ($providers as $provider) {
            $providerCode = strtoupper($provider['code'] ?? 'PRAGMATIC');
            $providerName = $provider['name'] ?? $providerCode;

            $this->line("Fetching games for provider: {$providerName} ({$providerCode})...");

            // Comply with GGR Rate Limit (max 1 request per second)
            usleep(1100000);

            $gamesRes = $ggrApi->getGames($providerCode);

            if (($gamesRes['status'] ?? 0) !== 1) {
                $this->warn("Could not fetch games for {$providerCode}: " . ($gamesRes['msg'] ?? ''));
                continue;
            }

            $gamesList = $gamesRes['games'] ?? [];

            foreach ($gamesList as $g) {
                $gameCode = $g['game_code'] ?? null;
                $gameName = $g['game_name'] ?? $gameCode;
                $banner = $g['banner'] ?? null;
                $status = $g['status'] ?? 1;

                if (!$gameCode) {
                    continue;
                }

                // Determine Category & Game Type
                $titleLower = strtolower($gameName);
                if ($providerCode === 'SPRIBE' || str_contains($titleLower, 'aviator') || str_contains($titleLower, 'plinko') || str_contains($titleLower, 'mines')) {
                    $category = 'Mini Games';
                    $gameType = 'MN';
                } elseif ($providerCode === 'SPORTSBOOK') {
                    $category = 'Sportsbook';
                    $gameType = 'SB';
                } elseif (str_contains($titleLower, 'baccarat')) {
                    $category = 'Baccarat';
                    $gameType = in_array($providerCode, ['EVOLUTION', 'PP_LIVE_PRO', 'PRAGMATICLIVE', 'EZUGI']) ? 'live' : 'slot';
                } elseif (str_contains($titleLower, 'roulette')) {
                    $category = 'Roulette';
                    $gameType = in_array($providerCode, ['EVOLUTION', 'PP_LIVE_PRO', 'PRAGMATICLIVE', 'EZUGI']) ? 'live' : 'slot';
                } elseif (str_contains($titleLower, 'blackjack')) {
                    $category = 'Blackjack';
                    $gameType = in_array($providerCode, ['EVOLUTION', 'PP_LIVE_PRO', 'PRAGMATICLIVE', 'EZUGI']) ? 'live' : 'slot';
                } elseif (in_array($providerCode, ['EVOLUTION', 'PP_LIVE_PRO', 'PRAGMATICLIVE', 'EZUGI'])) {
                    $category = 'Roulette';
                    $gameType = 'live';
                } else {
                    $category = 'Slots';
                    $gameType = 'slot';
                }

                $providerGameId = "ggr_{$providerCode}_{$gameCode}";
                $slug = Str::slug("{$providerName} {$gameName} {$gameCode}");

                $isRecommended = in_array($gameCode, ['vs20doghouse', 'vs20midas', 'vs20olympus', 'nxpkul2hgclallno', 'minigame_aviator']);

                $cover = $banner ?: ($fallbackCovers[$category] ?? $fallbackCovers['Slots']);

                Game::updateOrCreate(
                    ['provider_game_id' => $providerGameId],
                    [
                        'provider_code' => $providerCode,
                        'game_code' => $gameCode,
                        'title' => $gameName,
                        'slug' => $slug,
                        'category' => $category,
                        'game_type' => $gameType,
                        'cover_image' => $cover,
                        'banner' => $banner,
                        'is_active' => $status == 1,
                        'is_recommended' => $isRecommended,
                        'sort_order' => $totalSynced + 1,
                    ]
                );

                $totalSynced++;
                $categoryCounts[$category] = ($categoryCounts[$category] ?? 0) + 1;
            }
        }

        $this->info("Successfully synced {$totalSynced} GGR games into database!");
        $this->table(['Category', 'Count'], collect($categoryCounts)->map(fn($count, $cat) => ['Category' => $cat, 'Count' => $count]));

        return Command::SUCCESS;
    }
}
