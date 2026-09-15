<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GiftCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'amount_sc',
        'title',
        'note',
        'created_by',
        'redeemed_by',
        'redeemed_at',
        'expires_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amount_sc' => 'float',
            'redeemed_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function redeemer()
    {
        return $this->belongsTo(User::class, 'redeemed_by');
    }

    public function isRedeemable(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Generate a unique, human-friendly gift card code.
     * Format: PREFIX-XXXX-XXXX-XXXX (e.g. CROWD-8F29-A7BC-412E)
     */
    public static function generateUniqueCode(string $prefix = 'CROWD'): string
    {
        $prefix = strtoupper(trim(preg_replace('/[^a-zA-Z0-9]/', '', $prefix) ?: 'CROWD'));
        
        do {
            $part1 = strtoupper(Str::random(4));
            $part2 = strtoupper(Str::random(4));
            $part3 = strtoupper(Str::random(4));
            $code = "{$prefix}-{$part1}-{$part2}-{$part3}";
        } while (static::where('code', $code)->exists());

        return $code;
    }
}
