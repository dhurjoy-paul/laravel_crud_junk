<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;

class PostController extends BaseResourceController
{
    protected $model = Post::class;
    protected $viewName = 'posts';
    protected $folderName = 'posts';
    protected $filterKey = 'category_id';
    protected $filterName = 'category';
    protected $relationModel = Category::class;
    protected $relationName = 'categories';
    protected $searchable = ['title', 'content'];
    protected $isUserId = true;
    protected $slugColumn = 'title';

    protected function getValidationRules($id = null)
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => $id ? ['nullable', 'image', 'max:2048'] : ['required', 'image', 'max:2048'],
            'category_id' => ['required', 'exists:categories,id'],
            'published_at' => ['nullable', 'date']
        ];
    }
}
