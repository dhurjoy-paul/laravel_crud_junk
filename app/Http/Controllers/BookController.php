<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $sortColumn = $request->input('column', 'created_at');
        $sortDirection = $request->input('sort', 'desc');

        $query = Book::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%");
                });
            })
            ->when($request->input('genre'), function ($query, $genreId) {
                $query->where('genre_id', $genreId);
            });

        if ($sortColumn) {
            $query->orderBy($sortColumn, $sortDirection);
        } else {
            $query->latest();
        }

        $books = $query->paginate($perPage)->withQueryString()->onEachSide(1);

        return Inertia::render('books', [
            'genres' => Genre::all(),
            'books' => $books,
            'filters' => $request->only(['search', 'genre', 'per_page']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'author'         => ['nullable', 'string', 'max:255'],
            'isbn'           => ['nullable', 'string', 'unique:books,isbn'],
            'description'    => ['nullable', 'string'],
            'price'          => ['nullable', 'numeric'],
            'quantity'       => ['required', 'integer', 'min:0'],
            'image'          => ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'genre_id'       => ['required', 'exists:genres,id'],
            'published_date' => ['nullable', 'date'],
        ]);

        // Handle Image Upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('books', 'public');
        }

        $data['genre_name'] = Genre::find($data['genre_id'])->name;
        $data['slug']       = Str::slug($data['title'] . '-' . Str::random(5));

        Book::create($data);

        return redirect()->route('books.index')->with('success', 'Book created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'author'         => ['nullable', 'string', 'max:255'],
            'isbn'           => ['nullable', 'string', 'unique:books,isbn,' . $book->id],
            'description'    => ['nullable', 'string'],
            'price'          => ['nullable', 'numeric'],
            'quantity'       => ['required', 'integer', 'min:0'],
            'image'          => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'genre_id'       => ['required', 'exists:genres,id'],
            'published_date' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('image')) {
            if ($book->image) {
                Storage::disk('public')->delete($book->image);
            }
            $data['image'] = $request->file('image')->store('books', 'public');
        }

        $data['genre_name'] = Genre::find($data['genre_id'])->name;
        $data['slug']       = Str::slug($data['title']);

        $book->update($data);

        return redirect()->route('books.index')->with('message', 'Book updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // if ($book->user_id !== Auth::id()) {
        //     abort(403);
        // }
        $book->delete();
        return redirect()->back()->with('message', 'Book deleted successfully');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids');

        if (!$ids || empty($ids)) {
            return back()->with('error', 'No IDs received by the server.');
        }

        $books = Book::whereIn('id', $ids)->get();
        foreach ($books as $book) {
            if ($book->image) Storage::disk('public')->delete($book->image);
            $book->delete();
        }

        return redirect()->back()->with('message', "Book(s) deleted successfully");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }
}
