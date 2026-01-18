<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\BookLoanController;
use App\Http\Controllers\HeadphoneController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // library
    Route::delete('/students/bulk', [StudentController::class, 'bulkDestroy'])
        ->name('students.bulk');
    Route::resource('students', StudentController::class);

    Route::delete('/books/bulk', [BookController::class, 'bulkDestroy'])->name('books.bulk');
    Route::resource('books', BookController::class);

    Route::delete('/bookLoans/bulk', [BookLoanController::class, 'bulkDestroy'])
        ->name('bookLoans.bulk');
    Route::resource('bookLoans', BookLoanController::class);
    // library

    Route::delete('/posts/bulk', [PostController::class, 'bulkDestroy'])->name('posts.bulk');
    Route::resource('posts', PostController::class);

    Route::delete('/headphones/bulk', [HeadphoneController::class, 'bulkDestroy'])->name('headphones.bulk');
    Route::resource('headphones', HeadphoneController::class);
});

require __DIR__ . '/settings.php';
