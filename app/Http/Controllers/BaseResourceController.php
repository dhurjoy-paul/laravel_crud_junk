<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

abstract class BaseResourceController extends Controller
{
  protected $model;          // Post::class
  protected $viewName;       // 'posts'
  protected $folderName;     // 'posts' (for storage)
  protected $filterKey;      // 'category_id'
  protected $relationModel;  // Category::class
  protected $relationName;   // 'categories' (for the frontend prop)

  protected $searchable = []; // ['title', 'content', 'isbn']
  protected $relations = [];  // ['categories' => [\App\Models\Category::class, 'category_id']]

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $perPage = $request->input('per_page', 5);
    $search = $request->input('search');
    $filterValue = $request->input($this->relationName === 'genres' ? 'genre' : 'category');

    $sortColumn = $request->input('column', 'created_at');
    $sortDirection = $request->input('sort', 'desc');

    $query = $this->model::query()
      ->when($search, function ($q) use ($search) {
        $q->where(function ($subQuery) use ($search) {
          foreach ($this->searchable as $column) {
            $subQuery->orWhere($column, 'like', "%{$search}%");
          }
        });
      })
      ->when($filterValue, function ($query) use ($filterValue) {
        $query->where($this->filterKey, $filterValue);
      });

    if ($sortColumn) {
      $query->orderBy($sortColumn, $sortDirection);
    } else {
      $query->latest();
    }

    $items = $query->paginate($perPage)->withQueryString()->onEachSide(1);

    return Inertia::render($this->viewName, [
      $this->relationName => $this->relationModel::all(),
      str_replace('post', 'post', $this->viewName) => $items,
      'filters' => $request->only(['search', 'per_page', 'category', 'genre']),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $data = $request->validate($this->getValidationRules());

    if ($request->hasFile('image')) {
      $data['image'] = $request->file('image')->store($this->folderName, 'public');
    }

    if (isset($data[$this->filterKey])) {
      $relation = $this->relationModel::find($data[$this->filterKey]);
      $data[str_replace('_id', '_name', $this->filterKey)] = $relation->name;
    }

    $data['user_id'] = Auth::id();
    $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);

    $this->model::create($data);

    return redirect()->back()->with('message', 'Created successfully');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, $id)
  {
    $item = $this->model::findOrFail($id);

    // if (isset($item->user_id) && $item->user_id !== Auth::id()) abort(403);

    $data = $request->validate($this->getValidationRules($id));

    if ($request->hasFile('image')) {
      if ($item->image) Storage::disk('public')->delete($item->image);
      $data['image'] = $request->file('image')->store($this->folderName, 'public');
    }

    if (isset($data[$this->filterKey])) {
      $relation = $this->relationModel::find($data[$this->filterKey]);
      $data[str_replace('_id', '_name', $this->filterKey)] = $relation->name;
    }

    $data['slug'] = Str::slug($data['title']);
    $item->update($data);

    return redirect()->back()->with('message', 'Updated successfully');
  }

  /**
   * Remove the specified resource.
   */
  public function destroy($id)
  {
    $item = $this->model::findOrFail($id);
    if (isset($item->user_id) && $item->user_id !== Auth::id()) abort(403);

    if ($item->image) Storage::disk('public')->delete($item->image);
    $item->delete();

    return redirect()->back()->with('message', 'Deleted successfully');
  }

  /**
   * Bulk Delete
   */
  public function bulkDestroy(Request $request)
  {
    $ids = $request->input('ids', []);
    $items = $this->model::whereIn('id', $ids)->get();

    foreach ($items as $item) {
      if (isset($item->user_id) && $item->user_id !== Auth::id()) continue;
      if ($item->image) Storage::disk('public')->delete($item->image);
      $item->delete();
    }

    return redirect()->back()->with('message', 'Items deleted successfully');
  }

  abstract protected function getValidationRules($id = null);
}
