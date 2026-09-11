<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'street_address',
        'city',
        'country',
        'postal_code',
        'terms_accepted_at',
        'user_code',
        'game_balance',
        'referral_code',
        'referred_by',
        'is_admin',
        'status',
        'is_blocked',
        'target_rtp',
        'last_wheel_spin_at',
        'last_daily_bonus_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'terms_accepted_at' => 'datetime',
            'game_balance' => 'float',
            'is_admin' => 'boolean',
            'is_blocked' => 'boolean',
            'target_rtp' => 'integer',
            'last_wheel_spin_at' => 'datetime',
            'last_daily_bonus_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->referral_code)) {
                $user->referral_code = strtoupper(Str::random(8));
            }
        });
    }

    /**
     * Virtual Accessor for $user->balance mapping directly to $user->game_balance
     */
    public function getBalanceAttribute()
    {
        return (float) ($this->attributes['game_balance'] ?? 0.00);
    }

    /**
     * Virtual Mutator for $user->balance mapping directly to $user->game_balance
     */
    public function setBalanceAttribute($value)
    {
        $this->attributes['game_balance'] = (float) $value;
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function deposits()
    {
        return $this->hasMany(DepositLog::class);
    }
}
