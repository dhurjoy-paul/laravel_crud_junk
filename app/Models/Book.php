<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'slug',
        'image',
        'title',
        'author',
        'isbn',
        'description',
        'price',
        'quantity',
        'available_copies',
        'genre',
        'published_date',
        'floor',
        'section',
        'rack'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'available_copies' => 'integer',
        'published_date' => 'datetime',
    ];

    // defined the relationship with BookLoan
    public function loans()
    {
        return $this->hasMany(BookLoan::class);
    }
}
