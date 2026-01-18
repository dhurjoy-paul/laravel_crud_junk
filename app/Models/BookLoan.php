<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookLoan extends Model
{
    protected $fillable = [
        'student_id',
        'student_name',
        'book_id',
        'book_title',
        'loan_date',
        'due_date',
        'returned_date',
    ];

    protected $casts = [
        'student_id' => 'integer',
        'book_id' => 'integer',
        'loan_date' => 'datetime',
        'due_date' => 'datetime',
        'returned_date' => 'datetime',
    ];

    // defined the relationship to Student and Book
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    protected static function booted()
    {
        static::creating(function ($loan) {
            $book = $loan->book;
            if ($book->available_copies <= 0) {
                throw new \Exception("Cannot loan book: '{$book->title}' is out of stock.");
            }
        });

        static::created(function ($loan) {
            $loan->book()->decrement('available_copies');
        });

        static::updated(function ($loan) {
            if (
                $loan->wasChanged('returned_date') &&
                $loan->getOriginal('returned_date') === null &&
                $loan->returned_date !== null
            ) {

                if ($loan->book->available_copies < $loan->book->quantity) {
                    $loan->book()->increment('available_copies');
                }
            }
        });
    }
}
