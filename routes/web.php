<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [PostController::class, 'welcome'])->name('home');
// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');
// Route::middleware(['auth', 'verified'])->group(function () {
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostController::class);

    Route::resource('tables', TableController::class);

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // for DELETE a post
    Route::delete('/posts/bulk', [PostController::class, 'bulkDestroy'])->name('posts.bulk');

    // table GET
    // Route::get('/table', [TableController::class, 'index'])->name('table');

    // posts GET
    // Route::get('/posts', [PostController::class, 'index'])->name('post');

    // create post
    // Route::get('/post/create', [PostController::class, 'create'])->name('post.create');

    // for POST a post
    // Route::post('/post/create', [PostController::class, 'store'])->name('post.store');

    // for get edit data
    // Route::get('/post/{post}/edit', [PostController::class, 'edit'])->name('post.edit');

    // for update a post
    // Route::post('/post/{post}/update', [PostController::class, 'update'])->name('post.update');

    // for DELETE a post
    // Route::delete('/post/{post}', [PostController::class, 'destroy'])->name('post.destroy');
});

require __DIR__ . '/settings.php';
