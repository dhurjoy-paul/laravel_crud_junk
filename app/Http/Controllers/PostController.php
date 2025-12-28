<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Common data
        $data = [
            'categories' => Category::all(),
            'posts' => Post::latest()->paginate(6),
        ];

        return Inertia::render('posts', $data);
    }

    public function welcome()
    {
        $data = [
            'categories' => Category::all(),
            'posts' => Post::latest()->paginate(6),
            'canRegister' => Features::enabled(Features::registration()),
        ];

        return Inertia::render('welcome', $data);
    }
    // public function index()
    // {
    //     $categories = Category::get();
    //     $posts = Post::orderBy('created_at', 'DESC')->paginate(6);
    //     return Inertia::render('posts', 'welcome', [
    //         'categories' => $categories,
    //         'posts' => $posts,
    //     ]);
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::get();
        return Inertia::render('post/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg|max:2048'],
            'category_id' => ['required', 'exists:categories,id'],
            'published_at' => ['nullable', 'date']
        ]);

        $image = $data['image'];
        unset($data['image']);
        $imagePath = $image->store('posts', 'public');

        $data['image'] = $imagePath;
        $data['user_id'] = Auth::id();
        $data['slug'] = Str::slug($data['title']);

        Post::create($data);

        return redirect()->route('posts');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
