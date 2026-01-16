<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name',
        'email',
        'image',
        'student_card_id',
        'is_active',
        'max_borrow_limit'
    ];

    protected $casts = [
        'max_borrow_limit' => 'integer',
    ];

    // defined the relationship with BookLoan
    public function loans()
    {
        return $this->hasMany(BookLoan::class);
    }
}
