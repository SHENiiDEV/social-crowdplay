<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositLog extends Model
{
    use HasFactory;

    protected $table = 'deposits_log';

    protected $fillable = [
        'order_id',
        'user_id',
        'amount_eur',
        'coins_received',
        'rate_used',
        'payment_method',
        'status',
        'provider_tx_id',
    ];

    protected $casts = [
        'amount_eur' => 'float',
        'coins_received' => 'float',
        'rate_used' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
