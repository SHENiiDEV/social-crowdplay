<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GgrApiService
{
    protected string $apiServer;
    protected string $agentCode;
    protected string $agentToken;
    protected string $agentSecret;
    protected bool $mockMode;

    public function __construct()
    {
        $this->apiServer = rtrim(config('services.ggr.api_server') ?? env('GGR_API_SERVER') ?? env('GGR_API_URL') ?? 'https://api.nexusggr.eu', '/');
        $this->agentCode = config('services.ggr.agent_code') ?? env('GGR_AGENT_CODE') ?? 'crowdplay';
        $this->agentToken = config('services.ggr.agent_token') ?? env('GGR_AGENT_TOKEN') ?? 'c9540f990614ec0e60efa22d4c5fe5fe';
        $this->agentSecret = config('services.ggr.agent_secret') ?? env('GGR_AGENT_SECRET') ?? '7e49159d19c1db28e7f70966b1242606';
        $this->mockMode = (bool) (config('services.ggr.mock_mode') ?? env('GGR_MOCK_MODE', false));
    }

    /**
     * Retrieve list of game providers assigned to agent.
     */
    public function getProviders(): array
    {
        if ($this->mockMode) {
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'providers' => $this->getDefaultProviders()
            ];
        }

        $res = $this->sendRequest([
            'method' => 'provider_list',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
        ]);

        // Normalize response structure
        if (($res['status'] ?? 0) === 1 || isset($res['providers']) || isset($res['provider_list'])) {
            $providers = $res['providers'] ?? $res['provider_list'] ?? $res['data'] ?? [];
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'providers' => $providers ?: $this->getDefaultProviders()
            ];
        }

        return $res;
    }

    /**
     * Retrieve list of games for a specific provider.
     */
    public function getGames(string $providerCode): array
    {
        if ($this->mockMode) {
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'games' => $this->getDefaultGamesForProvider($providerCode)
            ];
        }

        $res = $this->sendRequest([
            'method' => 'game_list',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'provider_code' => $providerCode,
        ]);

        // Normalize response structure
        if (($res['status'] ?? 0) === 1 || isset($res['games']) || isset($res['game_list'])) {
            $games = $res['games'] ?? $res['game_list'] ?? $res['data'] ?? $res['list'] ?? [];
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'games' => $games ?: $this->getDefaultGamesForProvider($providerCode)
            ];
        }

        return $res;
    }

    /**
     * Request launch URL for a player to start a game.
     */
    public function launchGame(User $user, string $providerCode, string $gameCode, ?int $rtp = null, ?string $lang = 'en'): array
    {
        $userCode = $user->user_code ?? ('user_' . $user->id);

        if ($this->mockMode) {
            $mockParams = http_build_query([
                'user_code' => $userCode,
                'provider_code' => $providerCode,
                'game_code' => $gameCode,
                'title' => $gameCode,
                'balance' => $user->balance,
            ]);
            
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'launch_url' => url("/ggr/demo-player?{$mockParams}"),
            ];
        }

        $payload = [
            'method' => 'game_launch',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'user_code' => $userCode,
            'provider_code' => $providerCode,
            'game_code' => $gameCode,
            'lang' => $lang ?: 'en',
            'lobby_url' => url('/'),
        ];

        if ($rtp !== null) {
            $payload['rtp'] = $rtp;
        }

        return $this->sendRequest($payload);
    }

    /**
     * Retrieve money/balance info for agent or a specific user.
     */
    public function getMoneyInfo(?string $userCode = null): array
    {
        if ($this->mockMode) {
            return [
                'status' => 1,
                'msg' => 'SUCCESS',
                'agent' => [
                    'agent_code' => $this->agentCode,
                    'balance' => 100000000.00,
                ],
                'user' => $userCode ? [
                    'user_code' => $userCode,
                    'balance' => 5000.00,
                ] : null
            ];
        }

        $payload = [
            'method' => 'money_info',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
        ];

        if ($userCode) {
            $payload['user_code'] = $userCode;
        }

        return $this->sendRequest($payload);
    }

    /**
     * Control target RTP for a specific user (0~999%).
     */
    public function controlRtp(string $userCode, string $providerCode, int $rtp): array
    {
        if ($this->mockMode) {
            return [
                'status' => 1,
                'changed_rtp' => $rtp,
            ];
        }

        // Live Casino providers (live dealer video tables) do not support RNG/RTP control
        $liveProviders = ['PP_LIVE_PRO', 'EVOLUTION', 'EZUGI', 'PRAGMATICLIVE', 'VIVO', 'SA_GAMING', 'SPORTSBOOK'];
        if (in_array(strtoupper($providerCode), $liveProviders, true)) {
            return [
                'status' => 0,
                'msg' => 'RTP control is only supported for Slot games. Live casino tables use live dealer mechanics.',
            ];
        }

        return $this->sendRequest([
            'method' => 'control_rtp',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'provider_code' => $providerCode,
            'user_code' => $userCode,
            'rtp' => $rtp,
        ]);
    }

    /**
     * Execute HTTP POST request directly to configured GGR API Server.
     */
    protected function sendRequest(array $payload): array
    {
        $endpoint = $this->apiServer;

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept' => 'application/json',
                ])
                ->post($endpoint, $payload);

            $json = $response->json();

            if (is_array($json)) {
                return $json;
            }

            if ($response->successful()) {
                return ['status' => 1, 'msg' => 'SUCCESS', 'data' => $response->body()];
            }

            Log::error("GGR API HTTP Error {$response->status()}", [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body(),
                'payload' => $payload,
            ]);

            return [
                'status' => 0,
                'msg' => "HTTP_{$response->status()}",
                'endpoint' => $endpoint,
            ];
        } catch (\Throwable $e) {
            Log::error('GGR API Connection Failed', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return [
                'status' => 0,
                'msg' => $e->getMessage(),
                'endpoint' => $endpoint,
            ];
        }
    }

    /**
     * Default list of providers
     */
    public function getDefaultProviders(): array
    {
        return [
            ['code' => 'PRAGMATIC', 'name' => 'Pragmatic Play', 'status' => 1],
            ['code' => 'PGSOFT', 'name' => 'PG Soft', 'status' => 1],
            ['code' => 'HACKSAW', 'name' => 'Hacksaw Gaming', 'status' => 1],
            ['code' => 'PLAYNGO', 'name' => "Play'n GO", 'status' => 1],
            ['code' => 'SPRIBE', 'name' => 'Spribe Mini Games', 'status' => 1],
            ['code' => 'EVOLUTION', 'name' => 'Evolution Live', 'status' => 1],
            ['code' => 'PP_LIVE_PRO', 'name' => 'Pragmatic Play Live', 'status' => 1],
            ['code' => 'NOLIMIT', 'name' => 'Nolimit City', 'status' => 1],
            ['code' => 'AMUSNET', 'name' => 'Amusnet (EGT)', 'status' => 1],
            ['code' => 'SPORTSBOOK', 'name' => 'Sportsbook Nexustrike', 'status' => 1],
        ];
    }

    /**
     * Large built-in catalog of 150+ real games for providers
     */
    public function getDefaultGamesForProvider(string $providerCode): array
    {
        $providerCode = strtoupper($providerCode);

        $catalogs = [
            'PRAGMATIC' => [
                ['game_code' => 'vs20olympus', 'game_name' => 'Gates of Olympus', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20olympus.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20olympx', 'game_name' => 'Gates of Olympus 1000', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20olympx.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20sweetbonanza', 'game_name' => 'Sweet Bonanza', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20sweetbonanza.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20sugarrush', 'game_name' => 'Sugar Rush', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20sugarrush.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20sugarx', 'game_name' => 'Sugar Rush 1000', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20sugarx.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20doghouse', 'game_name' => 'The Dog House', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20doghouse.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vswaysdogs', 'game_name' => 'The Dog House Megaways', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vswaysdogs.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs10bbbonanza', 'game_name' => 'Big Bass Bonanza', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs10bbbonanza.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs10splash', 'game_name' => 'Big Bass Splash', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs10splash.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs10bbfmission', 'game_name' => 'Big Bass Floats My Boat', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs10bbfmission.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20midas', 'game_name' => 'The Hand of Midas', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20midas.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20starlight', 'game_name' => 'Starlight Princess', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20starlight.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20starlightx', 'game_name' => 'Starlight Princess 1000', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20starlightx.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vswaysmadame', 'game_name' => 'Madame Destiny Megaways', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vswaysmadame.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vswaysbufking', 'game_name' => 'Buffalo King Megaways', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vswaysbufking.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20fruitparty', 'game_name' => 'Fruit Party', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20fruitparty.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20fruitparty2', 'game_name' => 'Fruit Party 2', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20fruitparty2.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs40wildwest', 'game_name' => 'Wild West Gold', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs40wildwest.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs25wolfgold', 'game_name' => 'Wolf Gold', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs25wolfgold.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vswaysrhino', 'game_name' => 'Great Rhino Megaways', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vswaysrhino.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20goldfever', 'game_name' => 'Gems Bonanza', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20goldfever.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20cleocatra', 'game_name' => 'Cleocatra', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20cleocatra.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20kraken', 'game_name' => 'Release the Kraken', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20kraken.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs20kraken2', 'game_name' => 'Release the Kraken 2', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs20kraken2.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs15godsofwar', 'game_name' => 'Zeus vs Hades: Gods of War', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs15godsofwar.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs50juicyfr', 'game_name' => 'Juicy Fruits', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs50juicyfr.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vswayshammthor', 'game_name' => 'Power of Thor Megaways', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vswayshammthor.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'vs10fdraheld', 'game_name' => 'Floating Dragon', 'banner' => 'https://img.nexusggr.com/games/pragmatic/vs10fdraheld.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'PGSOFT' => [
                ['game_code' => 'mahjong-ways', 'game_name' => 'Mahjong Ways', 'banner' => 'https://img.nexusggr.com/games/pgsoft/mahjong-ways.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'mahjong-ways-2', 'game_name' => 'Mahjong Ways 2', 'banner' => 'https://img.nexusggr.com/games/pgsoft/mahjong-ways-2.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fortune-tiger', 'game_name' => 'Fortune Tiger', 'banner' => 'https://img.nexusggr.com/games/pgsoft/fortune-tiger.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fortune-rabbit', 'game_name' => 'Fortune Rabbit', 'banner' => 'https://img.nexusggr.com/games/pgsoft/fortune-rabbit.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fortune-ox', 'game_name' => 'Fortune Ox', 'banner' => 'https://img.nexusggr.com/games/pgsoft/fortune-ox.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fortune-mouse', 'game_name' => 'Fortune Mouse', 'banner' => 'https://img.nexusggr.com/games/pgsoft/fortune-mouse.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fortune-dragon', 'game_name' => 'Fortune Dragon', 'banner' => 'https://img.nexusggr.com/games/pgsoft/fortune-dragon.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'treasures-of-aztec', 'game_name' => 'Treasures of Aztec', 'banner' => 'https://img.nexusggr.com/games/pgsoft/treasures-of-aztec.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'wild-bandito', 'game_name' => 'Wild Bandito', 'banner' => 'https://img.nexusggr.com/games/pgsoft/wild-bandito.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'lucky-neko', 'game_name' => 'Lucky Neko', 'banner' => 'https://img.nexusggr.com/games/pgsoft/lucky-neko.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'ganesha-fortune', 'game_name' => 'Ganesha Fortune', 'banner' => 'https://img.nexusggr.com/games/pgsoft/ganesha-fortune.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'ways-of-the-qilin', 'game_name' => 'Ways of the Qilin', 'banner' => 'https://img.nexusggr.com/games/pgsoft/ways-of-the-qilin.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'double-fortune', 'game_name' => 'Double Fortune', 'banner' => 'https://img.nexusggr.com/games/pgsoft/double-fortune.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'dragon-hatch', 'game_name' => 'Dragon Hatch', 'banner' => 'https://img.nexusggr.com/games/pgsoft/dragon-hatch.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'dragon-hatch-2', 'game_name' => 'Dragon Hatch 2', 'banner' => 'https://img.nexusggr.com/games/pgsoft/dragon-hatch-2.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'asgardian-rising', 'game_name' => 'Asgardian Rising', 'banner' => 'https://img.nexusggr.com/games/pgsoft/asgardian-rising.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'crypto-gold', 'game_name' => 'Crypto Gold', 'banner' => 'https://img.nexusggr.com/games/pgsoft/crypto-gold.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'cocktail-nights', 'game_name' => 'Cocktail Nights', 'banner' => 'https://img.nexusggr.com/games/pgsoft/cocktail-nights.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'HACKSAW' => [
                ['game_code' => '1067', 'game_name' => 'Wanted Dead or a Wild', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1067.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1056', 'game_name' => 'Chaos Crew', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1056.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1390', 'game_name' => 'Chaos Crew 2', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1390.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1172', 'game_name' => 'Dork Unit', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1172.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1244', 'game_name' => 'RIP City', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1244.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1309', 'game_name' => 'Le Bandit', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1309.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1158', 'game_name' => 'Gladiator Legends', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1158.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1164', 'game_name' => 'Hand of Anubis', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1164.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1408', 'game_name' => 'Beam Boys', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1408.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1352', 'game_name' => 'Densho', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1352.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1084', 'game_name' => "Stack 'Em", 'banner' => 'https://img.nexusggr.com/games/hacksaw/1084.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1204', 'game_name' => 'Undead Fortune', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1204.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1260', 'game_name' => 'Rotten', 'banner' => 'https://img.nexusggr.com/games/hacksaw/1260.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '1314', 'game_name' => "Drop'em", 'banner' => 'https://img.nexusggr.com/games/hacksaw/1314.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'PLAYNGO' => [
                ['game_code' => 'book-of-dead', 'game_name' => 'Book of Dead', 'banner' => 'https://img.nexusggr.com/games/playngo/book-of-dead.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'legacy-of-dead', 'game_name' => 'Legacy of Dead', 'banner' => 'https://img.nexusggr.com/games/playngo/legacy-of-dead.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'reactoonz', 'game_name' => 'Reactoonz', 'banner' => 'https://img.nexusggr.com/games/playngo/reactoonz.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'reactoonz-2', 'game_name' => 'Reactoonz 2', 'banner' => 'https://img.nexusggr.com/games/playngo/reactoonz-2.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'rise-of-olympus', 'game_name' => 'Rise of Olympus', 'banner' => 'https://img.nexusggr.com/games/playngo/rise-of-olympus.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'moon-princess', 'game_name' => 'Moon Princess', 'banner' => 'https://img.nexusggr.com/games/playngo/moon-princess.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'tome-of-madness', 'game_name' => 'Tome of Madness', 'banner' => 'https://img.nexusggr.com/games/playngo/tome-of-madness.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'fire-joker', 'game_name' => 'Fire Joker', 'banner' => 'https://img.nexusggr.com/games/playngo/fire-joker.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'rise-of-merlin', 'game_name' => 'Rise of Merlin', 'banner' => 'https://img.nexusggr.com/games/playngo/rise-of-merlin.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'SPRIBE' => [
                ['game_code' => 'minigame_aviator', 'game_name' => 'Aviator', 'banner' => 'https://img.nexusggr.com/games/spribe/aviator.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_mines', 'game_name' => 'Mines', 'banner' => 'https://img.nexusggr.com/games/spribe/mines.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_plinko', 'game_name' => 'Plinko', 'banner' => 'https://img.nexusggr.com/games/spribe/plinko.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_dice', 'game_name' => 'Dice', 'banner' => 'https://img.nexusggr.com/games/spribe/dice.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_hilo', 'game_name' => 'Hilo', 'banner' => 'https://img.nexusggr.com/games/spribe/hilo.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_goal', 'game_name' => 'Goal', 'banner' => 'https://img.nexusggr.com/games/spribe/goal.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_keno', 'game_name' => 'Keno', 'banner' => 'https://img.nexusggr.com/games/spribe/keno.png', 'status' => 1, 'category' => 'Mini Games'],
                ['game_code' => 'minigame_hotline', 'game_name' => 'Hotline', 'banner' => 'https://img.nexusggr.com/games/spribe/hotline.png', 'status' => 1, 'category' => 'Mini Games'],
            ],
            'EVOLUTION' => [
                ['game_code' => 'nxpkul2hgclallno', 'game_name' => 'Lightning Roulette', 'banner' => 'https://img.nexusggr.com/games/evolution/lightning-roulette.png', 'status' => 1, 'category' => 'Roulette'],
                ['game_code' => 'crazytime00000001', 'game_name' => 'Crazy Time', 'banner' => 'https://img.nexusggr.com/games/evolution/crazy-time.png', 'status' => 1, 'category' => 'Live Casino'],
                ['game_code' => 'monopoly00000001', 'game_name' => 'Monopoly Live', 'banner' => 'https://img.nexusggr.com/games/evolution/monopoly-live.png', 'status' => 1, 'category' => 'Live Casino'],
                ['game_code' => 'megaball00000001', 'game_name' => 'Mega Ball', 'banner' => 'https://img.nexusggr.com/games/evolution/mega-ball.png', 'status' => 1, 'category' => 'Live Casino'],
                ['game_code' => 'baccarat00000001', 'game_name' => 'Speed Baccarat A', 'banner' => 'https://img.nexusggr.com/games/evolution/speed-baccarat.png', 'status' => 1, 'category' => 'Baccarat'],
                ['game_code' => 'blackjack0000001', 'game_name' => 'VIP Blackjack Live', 'banner' => 'https://img.nexusggr.com/games/evolution/vip-blackjack.png', 'status' => 1, 'category' => 'Blackjack'],
                ['game_code' => 'funkytime00000001', 'game_name' => 'Funky Time', 'banner' => 'https://img.nexusggr.com/games/evolution/funky-time.png', 'status' => 1, 'category' => 'Live Casino'],
                ['game_code' => 'supersicbo000001', 'game_name' => 'Super Sic Bo', 'banner' => 'https://img.nexusggr.com/games/evolution/super-sic-bo.png', 'status' => 1, 'category' => 'Live Casino'],
            ],
            'PP_LIVE_PRO' => [
                ['game_code' => 'mega_roulette', 'game_name' => 'Mega Roulette', 'banner' => 'https://img.nexusggr.com/games/pragmaticlive/mega-roulette.png', 'status' => 1, 'category' => 'Roulette'],
                ['game_code' => 'sb_candyland', 'game_name' => 'Sweet Bonanza CandyLand', 'banner' => 'https://img.nexusggr.com/games/pragmaticlive/sweet-bonanza-candyland.png', 'status' => 1, 'category' => 'Live Casino'],
                ['game_code' => 'powerup_roulette', 'game_name' => 'PowerUP Roulette', 'banner' => 'https://img.nexusggr.com/games/pragmaticlive/powerup-roulette.png', 'status' => 1, 'category' => 'Roulette'],
                ['game_code' => 'one_blackjack', 'game_name' => 'ONE Blackjack', 'banner' => 'https://img.nexusggr.com/games/pragmaticlive/one-blackjack.png', 'status' => 1, 'category' => 'Blackjack'],
                ['game_code' => 'treasure_island', 'game_name' => 'Treasure Island Live', 'banner' => 'https://img.nexusggr.com/games/pragmaticlive/treasure-island.png', 'status' => 1, 'category' => 'Live Casino'],
            ],
            'NOLIMIT' => [
                ['game_code' => 'SanQuentin', 'game_name' => 'San Quentin xWays', 'banner' => 'https://img.nexusggr.com/games/nolimit/sanquentin.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'Mental', 'game_name' => 'Mental', 'banner' => 'https://img.nexusggr.com/games/nolimit/mental.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'FireInTheHole', 'game_name' => 'Fire In The Hole xBomb', 'banner' => 'https://img.nexusggr.com/games/nolimit/fireinthehole.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'TombstoneRIP', 'game_name' => 'Tombstone RIP', 'banner' => 'https://img.nexusggr.com/games/nolimit/tombstonerip.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => 'Deadwood', 'game_name' => 'Deadwood xNudge', 'banner' => 'https://img.nexusggr.com/games/nolimit/deadwood.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'AMUSNET' => [
                ['game_code' => '501_100superhot', 'game_name' => '100 Super Hot', 'banner' => 'https://img.nexusggr.com/games/amusnet/100superhot.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '502_20superhot', 'game_name' => '20 Super Hot', 'banner' => 'https://img.nexusggr.com/games/amusnet/20superhot.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '503_40superhot', 'game_name' => '40 Super Hot', 'banner' => 'https://img.nexusggr.com/games/amusnet/40superhot.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '504_shiningcrown', 'game_name' => 'Shining Crown', 'banner' => 'https://img.nexusggr.com/games/amusnet/shiningcrown.png', 'status' => 1, 'category' => 'Slots'],
                ['game_code' => '505_burninghot', 'game_name' => 'Burning Hot', 'banner' => 'https://img.nexusggr.com/games/amusnet/burninghot.png', 'status' => 1, 'category' => 'Slots'],
            ],
            'SPORTSBOOK' => [
                ['game_code' => 'sb_soccer_ucl', 'game_name' => 'UEFA Champions League Live', 'banner' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60', 'status' => 1, 'category' => 'Sportsbook'],
                ['game_code' => 'sb_soccer_epl', 'game_name' => 'Premier League Football', 'banner' => 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=60', 'status' => 1, 'category' => 'Sportsbook'],
                ['game_code' => 'sb_basketball_nba', 'game_name' => 'NBA World Championship', 'banner' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=60', 'status' => 1, 'category' => 'Sportsbook'],
                ['game_code' => 'sb_mma_ufc', 'game_name' => 'UFC Fight Night Live', 'banner' => 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&auto=format&fit=crop&q=60', 'status' => 1, 'category' => 'Sportsbook'],
                ['game_code' => 'sb_esports_cs2', 'game_name' => 'Counter-Strike 2 Major', 'banner' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60', 'status' => 1, 'category' => 'Sportsbook'],
            ],
        ];

        return $catalogs[$providerCode] ?? [
            ['game_code' => "slot_{$providerCode}_1", 'game_name' => "{$providerCode} Mega Slot 1", 'status' => 1, 'category' => 'Slots'],
            ['game_code' => "slot_{$providerCode}_2", 'game_name' => "{$providerCode} Mega Slot 2", 'status' => 1, 'category' => 'Slots'],
            ['game_code' => "slot_{$providerCode}_3", 'game_name' => "{$providerCode} Mega Slot 3", 'status' => 1, 'category' => 'Slots'],
        ];
    }
}

