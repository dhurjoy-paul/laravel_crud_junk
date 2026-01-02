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
        'published_date',
        'genre_name',
        'genre_id',
    ];
}
