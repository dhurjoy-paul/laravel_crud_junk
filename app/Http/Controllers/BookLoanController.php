<?php

namespace App\Http\Controllers;

use App\Models\BookLoan;
use App\Models\Student;
use App\Models\Book;

class BookLoanController extends BaseResourceController
{
    protected $model = BookLoan::class;
    protected $viewName = 'bookLoans';
    protected $folderName = 'book-loans';
    protected $searchable = ['students.name', 'books.title', 'loan_date', 'due_date'];

    protected $load = ['student', 'book'];
    protected $extraData = [
        'students' => Student::class,
        'books' => Book::class,
    ];

    protected function getValidationRules($id = null)
    {
        return [
            'student_id'    => ['required', 'exists:students,id'],
            'book_id'       => ['required', 'exists:books,id'],
            'loan_date'     => ['required', 'date'],
            'due_date'      => ['required', 'date', 'after_or_equal:loan_date'],
            'returned_date' => ['nullable', 'date', 'after_or_equal:loan_date'],
        ];
    }
}
