<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GgrSeamlessWalletTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        config([
            'services.ggr.agent_code' => 'crowdplay_agent',
            'services.ggr.agent_secret' => 'test_agent_secret_8371c59',
        ]);
    }

    public function test_user_balance_method_returns_player_balance()
    {
        $user = User::factory()->create([
            'user_code' => 'test_player_balance',
            'game_balance' => 750.50,
        ]);

        $payload = [
            'method' => 'user_balance',
            'agent_code' => 'crowdplay_agent',
            'agent_secret' => 'test_agent_secret_8371c59',
            'user_code' => 'test_player_balance',
            'user_token' => 'token_123',
            'game_code' => 'vs20olympgate',
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 1,
                'user_balance' => 750.50,
            ]);
    }

    public function test_debit_credit_transaction_updates_user_balance_atomically()
    {
        $user = User::factory()->create([
            'user_code' => 'test_player_1',
            'game_balance' => 500.00,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_code' => 'crowdplay_agent',
            'agent_secret' => 'test_agent_secret_8371c59',
            'user_code' => 'test_player_1',
            'game_type' => 'slot',
            'slot' => [
                'provider_code' => 'PRAGMATIC',
                'game_code' => 'vs20midas',
                'type' => 'BASE',
                'bet_money' => 10.00,
                'win_money' => 50.00,
                'round_id' => '12345678',
                'txn_id' => 'tx_ggr_test_001',
                'txn_type' => 'debit_credit',
            ]
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 1,
                'user_balance' => 540.00,
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'game_balance' => 540.00,
        ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'txn_id' => 'tx_ggr_test_001',
            'bet_money' => 10.00,
            'win_money' => 50.00,
        ]);
    }

    public function test_idempotent_duplicate_transaction_returns_current_balance_without_double_deduction()
    {
        $user = User::factory()->create([
            'user_code' => 'test_player_2',
            'game_balance' => 200.00,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_code' => 'crowdplay_agent',
            'agent_secret' => 'test_agent_secret_8371c59',
            'user_code' => 'test_player_2',
            'game_type' => 'slot',
            'slot' => [
                'provider_code' => 'PRAGMATIC',
                'game_code' => 'vs20doghouse',
                'type' => 'BASE',
                'bet_money' => 20.00,
                'win_money' => 0.00,
                'round_id' => '8888',
                'txn_id' => 'tx_duplicate_001',
                'txn_type' => 'debit',
            ]
        ];

        // First call
        $firstRes = $this->postJson('/gold_api', $payload);
        $firstRes->assertStatus(200)->assertJson(['status' => 1, 'user_balance' => 180.00]);

        // Duplicate call with same txn_id
        $secondRes = $this->postJson('/gold_api', $payload);
        $secondRes->assertStatus(200)->assertJson(['status' => 1, 'user_balance' => 180.00]);

        $this->assertEquals(1, Transaction::where('txn_id', 'tx_duplicate_001')->count());
    }

    public function test_insufficient_funds_returns_error()
    {
        $user = User::factory()->create([
            'user_code' => 'test_player_poor',
            'game_balance' => 5.00,
        ]);

        $payload = [
            'method' => 'transaction',
            'agent_code' => 'crowdplay_agent',
            'agent_secret' => 'test_agent_secret_8371c59',
            'user_code' => 'test_player_poor',
            'game_type' => 'slot',
            'slot' => [
                'provider_code' => 'PRAGMATIC',
                'game_code' => 'vs20doghouse',
                'type' => 'BASE',
                'bet_money' => 500.00,
                'win_money' => 0.00,
                'round_id' => '9999',
                'txn_id' => 'tx_poor_001',
                'txn_type' => 'debit',
            ]
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 0,
                'msg' => 'INSUFFICIENT_USER_FUNDS',
            ]);
    }

    public function test_invalid_agent_secret_returns_unauthorized()
    {
        $payload = [
            'method' => 'transaction',
            'agent_code' => 'invalid_agent',
            'agent_secret' => 'wrong_secret',
            'user_code' => 'test_player_1',
            'game_type' => 'slot',
            'slot' => [
                'txn_id' => 'tx_invalid_001',
            ]
        ];

        $response = $this->postJson('/gold_api', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 0,
                'msg' => 'INVALID_AGENT_CREDENTIALS',
            ]);
    }
}

