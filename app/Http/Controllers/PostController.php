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
    public function index(Request $request)
    {
        $posts = Post::where('user_id', Auth::id())
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($request->input('category'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('posts', [
            'categories' => Category::all(),
            'posts' => $posts,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function welcome(Request $request)
    {
        $posts = Post::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($request->input('category'), function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('welcome', [
            'categories' => Category::all(),
            'posts' => $posts,
            'filters' => $request->only(['search', 'category']),
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

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
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
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
     * Show the form for editing the specified resource.
     */
    // App\Http\Controllers\PostController.php

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('post/edit', [
            'post' => $post,
            'categories' => Category::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        $rules = [
            'title' => 'required',
            'content' => 'required',
            'category_id' => ['required', 'exists:categories,id'],
            'published_at' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg,gif', 'max:2048'],
        ];

        $data = $request->validate($rules);

        // Handle Image if uploaded
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
            $data['image'] = $imagePath;
        } else {
            unset($data['image']);
        }

        $data['slug'] = Str::slug($data['title']);

        $post->update($data);

        return redirect()->route('posts')->with('message', 'Post updated successfully');
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }
        $post->delete();
        return redirect()->back()->with('message', 'Post deleted successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }
}
