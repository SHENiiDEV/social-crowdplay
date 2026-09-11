<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Services\GgrApiService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GgrSyncGames extends Command
{
    protected $signature = 'ggr:sync-games {--fresh : Truncate existing games table before syncing} {--force-catalog : Use built-in 150+ verified games catalog}';
    protected $description = 'Sync game providers, banners, and categories from GGR Gold API into MySQL database';

    public function handle(GgrApiService $ggrApi): int
    {
        $this->info('🚀 Starting GGR Gold API games catalog sync...');

        if ($this->option('fresh')) {
            $this->warn('Truncating existing games table...');
            Game::query()->delete();
        }

        $providers = [];

        if (!$this->option('force-catalog')) {
            $providersRes = $ggrApi->getProviders();

            if (($providersRes['status'] ?? 0) !== 1 && empty($providersRes['providers'])) {
                $errorMsg = $providersRes['msg'] ?? ($providersRes['message'] ?? 'UNKNOWN_ERROR');
                $this->warn("⚠️ API Warning: {$errorMsg}");
                if (str_contains($errorMsg, 'whitelist') || str_contains($errorMsg, 'INVALID_IP')) {
                    $this->error("🔒 Notice: Add your VPS server IP to the whitelist in your Nexus GGR panel / bot.");
                }
                $this->info("⚡ Using built-in verified provider catalog...");
                $providers = $ggrApi->getDefaultProviders();
            } else {
                $providers = $providersRes['providers'] ?? $providersRes['provider_list'] ?? $ggrApi->getDefaultProviders();
            }
        } else {
            $providers = $ggrApi->getDefaultProviders();
        }

        $this->info('Found ' . count($providers) . ' providers to sync.');

        $totalSynced = 0;
        $categoryCounts = [];

        $apiServer = $ggrApi->getApiServer();

        foreach ($providers as $provider) {
            $providerCode = strtoupper($provider['code'] ?? 'PRAGMATIC');
            $providerName = $provider['name'] ?? $providerCode;

            $this->line("Fetching games for provider: {$providerName} ({$providerCode})...");

            $gamesList = [];

            if (!$this->option('force-catalog')) {
                // Rate limit spacing for API calls
                usleep(500000);
                $gamesRes = $ggrApi->getGames($providerCode);

                if (($gamesRes['status'] ?? 0) === 1 && !empty($gamesRes['games'])) {
                    $gamesList = $gamesRes['games'];
                } elseif (!empty($gamesRes['game_list'])) {
                    $gamesList = $gamesRes['game_list'];
                } elseif (!empty($gamesRes['data'])) {
                    $gamesList = $gamesRes['data'];
                } else {
                    $gamesList = $ggrApi->getDefaultGamesForProvider($providerCode);
                }
            } else {
                $gamesList = $ggrApi->getDefaultGamesForProvider($providerCode);
            }

            foreach ($gamesList as $g) {
                $gameCode = $g['game_code'] ?? ($g['code'] ?? null);
                if (!$gameCode) {
                    continue;
                }

                // Handle multi-language or string game names
                $rawGameName = $g['game_name'] ?? ($g['name'] ?? ($g['title'] ?? $gameCode));
                if (is_array($rawGameName)) {
                    $gameName = $rawGameName['en'] ?? reset($rawGameName) ?: (string) $gameCode;
                } else {
                    $gameName = (string) ($rawGameName ?: $gameCode);
                }

                // Handle banner extraction across various GGR API schema versions
                $rawBanner = $g['banner'] ?? ($g['image'] ?? ($g['cover_image'] ?? ($g['icon'] ?? ($g['thumbnail'] ?? ($g['img'] ?? ($g['img_url'] ?? null))))));
                $banner = null;

                if (!empty($rawBanner) && is_string($rawBanner)) {
                    if (str_starts_with($rawBanner, 'http://') || str_starts_with($rawBanner, 'https://')) {
                        $banner = $rawBanner;
                    } elseif (str_starts_with($rawBanner, '/')) {
                        $banner = "{$apiServer}{$rawBanner}";
                    } else {
                        $banner = "{$apiServer}/storage/games/" . strtolower($providerCode) . "/{$rawBanner}";
                    }
                } else {
                    // Default standard Nexus CDN format
                    $banner = "{$apiServer}/storage/games/" . strtolower($providerCode) . "/{$gameCode}.png";
                }

                $status = $g['status'] ?? 1;

                // Determine Category & Game Type
                $titleLower = strtolower($gameName);
                if ($providerCode === 'SPRIBE' || str_contains($titleLower, 'aviator') || str_contains($titleLower, 'plinko') || str_contains($titleLower, 'mines') || str_contains($titleLower, 'dice') || str_contains($titleLower, 'hilo')) {
                    $category = 'Mini Games';
                    $gameType = 'MN';
                } elseif ($providerCode === 'SPORTSBOOK' || str_contains($titleLower, 'league') || str_contains($titleLower, 'football') || str_contains($titleLower, 'basketball')) {
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
                    $category = 'Live Casino';
                    $gameType = 'live';
                } else {
                    $category = 'Slots';
                    $gameType = 'slot';
                }

                $providerGameId = "ggr_{$providerCode}_{$gameCode}";
                $slug = Str::slug("{$providerName} {$gameName} {$gameCode}");

                $isRecommended = in_array($gameCode, [
                    'vs20olympus', 'vs20olympx', 'vs20sweetbonanza', 'vs20sugarrush', 'vs20doghouse',
                    'vswaysdogs', 'vs10bbbonanza', 'vs10splash', 'mahjong-ways-2', 'fortune-tiger',
                    'fortune-rabbit', '1067', '1309', 'minigame_aviator', 'nxpkul2hgclallno', 'crazytime00000001'
                ]);

                Game::updateOrCreate(
                    ['provider_game_id' => $providerGameId],
                    [
                        'provider_code' => $providerCode,
                        'game_code' => $gameCode,
                        'title' => $gameName,
                        'slug' => $slug,
                        'category' => $category,
                        'game_type' => $gameType,
                        'cover_image' => $banner,
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

        $this->info("✨ Successfully synced {$totalSynced} GGR games into database!");
        $this->table(['Category', 'Count'], collect($categoryCounts)->map(fn($count, $cat) => ['Category' => $cat, 'Count' => $count]));

        return Command::SUCCESS;
    }
}

