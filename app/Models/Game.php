<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_game_id',
        'provider_code',
        'game_code',
        'title',
        'slug',
        'category',
        'game_type',
        'cover_image',
        'banner',
        'is_active',
        'sort_order',
        'is_recommended',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_recommended' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function sessions()
    {
        return $this->hasMany(GameSession::class);
    }
}
