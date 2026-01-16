<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Validation\Rule;

class BookController extends BaseResourceController
{
    protected $model = Book::class;
    protected $viewName = 'books';
    protected $folderName = 'books';
    protected $searchable = ['title', 'author', 'isbn', 'genre', 'description'];

    protected $isUserId = false;
    protected $slugColumn = 'title';
    protected $fileColumn = 'image';

    protected function getValidationRules($id = null)
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'author'           => ['required', 'string', 'max:255'],
            'genre'            => ['required', 'string'],
            'isbn'             => ['nullable', 'string', Rule::unique('books', 'isbn')->ignore($id)],
            'description'      => ['nullable', 'string'],
            'price'            => ['nullable', 'numeric', 'min:0'],
            'quantity'         => ['required', 'integer', 'min:0'],
            'available_copies' => ['required', 'integer', 'min:0', 'lte:quantity'],
            'published_date'   => ['nullable', 'date'],
            'floor'            => ['nullable', 'string'],
            'section'          => ['nullable', 'string'],
            'rack'             => ['nullable', 'string'],
            'image'          => $id ? ['nullable', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'] : ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
        ];
    }
}
