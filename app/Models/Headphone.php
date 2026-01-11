<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Headphone extends Model
{
    protected $fillable = [
        'brand',
        'model_name',
        'slug',
        'type',
        'connection_type',
        'color',
        'has_microphone',
        'is_noise_cancelling',
        'price',
        'discount_price',
        'stock_quantity',
        'status',
        'image_url',
        'description',
        'location_rack',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'has_microphone' => 'boolean',
        'is_noise_cancelling' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];
}
