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
        $this->apiServer = rtrim(config('services.ggr.api_server', 'https://api.ggr.casino'), '/');
        $this->agentCode = config('services.ggr.agent_code', 'crowdplay');
        $this->agentToken = config('services.ggr.agent_token', 'c9540f990614ec0e60efa22d4c5fe5fe');
        $this->agentSecret = config('services.ggr.agent_secret', '7e49159d19c1db28e7f70966b1242606');
        $this->mockMode = (bool) config('services.ggr.mock_mode', false);
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
                'providers' => [
                    ['code' => 'PRAGMATIC', 'name' => 'Pragmatic Play', 'status' => 1],
                    ['code' => 'PP_LIVE_PRO', 'name' => 'Pragmatic Play Live', 'status' => 1],
                    ['code' => 'EVOLUTION', 'name' => 'Evolution Live', 'status' => 1],
                    ['code' => 'PGSOFT', 'name' => 'PG Soft', 'status' => 1],
                    ['code' => 'HACKSAW', 'name' => 'Hacksaw Gaming', 'status' => 1],
                    ['code' => 'PLAYNGO', 'name' => "Play'n GO", 'status' => 1],
                    ['code' => 'SPRIBE', 'name' => 'Spribe Mini Games', 'status' => 1],
                    ['code' => 'SPORTSBOOK', 'name' => 'Sportsbook Nexustrike', 'status' => 1],
                ]
            ];
        }

        return $this->sendRequest([
            'method' => 'provider_list',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
        ]);
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
                'games' => [
                    [
                        'game_code' => 'vs20doghouse',
                        'game_name' => 'The Dog House',
                        'banner' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
                        'status' => 1,
                        'category' => 'Slots'
                    ],
                    [
                        'game_code' => 'vs20midas',
                        'game_name' => 'The Hand of Midas',
                        'banner' => 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60',
                        'status' => 1,
                        'category' => 'Slots'
                    ],
                    [
                        'game_code' => 'vs20olympus',
                        'game_name' => 'Gates of Olympus',
                        'banner' => 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
                        'status' => 1,
                        'category' => 'Slots'
                    ],
                    [
                        'game_code' => 'nxpkul2hgclallno',
                        'game_name' => 'Lightning Roulette',
                        'banner' => 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800&auto=format&fit=crop&q=60',
                        'status' => 1,
                        'category' => 'Roulette'
                    ],
                    [
                        'game_code' => 'minigame_aviator',
                        'game_name' => 'Aviator Spribe',
                        'banner' => 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&auto=format&fit=crop&q=60',
                        'status' => 1,
                        'category' => 'Mini Games'
                    ]
                ]
            ];
        }

        return $this->sendRequest([
            'method' => 'game_list',
            'agent_code' => $this->agentCode,
            'agent_token' => $this->agentToken,
            'provider_code' => $providerCode,
        ]);
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
     * Execute HTTP POST request to GGR API Server.
     */
    protected function sendRequest(array $payload): array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                ])
                ->post($this->apiServer, $payload);

            if ($response->successful()) {
                return $response->json() ?? ['status' => 0, 'msg' => 'INVALID_JSON_RESPONSE'];
            }

            Log::error('GGR API HTTP Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'payload' => $payload,
            ]);

            return ['status' => 0, 'msg' => 'HTTP_ERROR_' . $response->status()];
        } catch (\Throwable $e) {
            Log::error('GGR API Exception: ' . $e->getMessage(), ['payload' => $payload]);
            return ['status' => 0, 'msg' => 'API_CONNECTION_FAILED'];
        }
    }
}
