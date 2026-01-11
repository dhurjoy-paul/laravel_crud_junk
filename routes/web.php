<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\HeadphoneController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('/posts/bulk', [PostController::class, 'bulkDestroy'])->name('posts.bulk');
    Route::resource('posts', PostController::class);

    Route::delete('/books/bulk', [BookController::class, 'bulkDestroy'])->name('books.bulk');
    Route::resource('books', BookController::class);

    Route::delete('/headphones/bulk', [HeadphoneController::class, 'bulkDestroy'])->name('headphones.bulk');
    Route::resource('headphones', HeadphoneController::class);

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
