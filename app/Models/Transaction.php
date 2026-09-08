<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_id',
        'provider_tx_id',
        'txn_id',
        'type',
        'txn_type',
        'round_id',
        'amount',
        'bet_money',
        'win_money',
        'balance_before',
        'balance_after',
        'provider_code',
        'game_code',
        'raw_payload',
    ];

    protected $casts = [
        'amount' => 'float',
        'bet_money' => 'float',
        'win_money' => 'float',
        'balance_before' => 'float',
        'balance_after' => 'float',
        'raw_payload' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
