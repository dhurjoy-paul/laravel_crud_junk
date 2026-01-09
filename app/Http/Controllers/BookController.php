<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Genre;

class BookController extends BaseResourceController
{
    protected $model = Book::class;
    protected $viewName = 'books';
    protected $folderName = 'books';
    protected $filterKey = 'genre_id';
    protected $filterName = 'genre';
    protected $relationModel = Genre::class;
    protected $relationName = 'genres';
    protected $searchable = ['title', 'author', 'isbn', 'description'];
    protected $isUserId = false;
    protected $slugColumn = 'title';

    protected function getValidationRules($id = null)
    {
        return [
            'title'          => ['required', 'string', 'max:255'],
            'author'         => ['nullable', 'string', 'max:255'],
            'isbn'           => ['nullable', 'string', 'unique:books,isbn'],
            'description'    => ['nullable', 'string'],
            'price'          => ['nullable', 'numeric'],
            'quantity'       => ['required', 'integer', 'min:0'],
            'image'          => ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'genre_id'       => ['required', 'exists:genres,id'],
            'published_date' => ['nullable', 'date'],
        ];
    }
}
