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
  protected $model;                 // Post::class
  protected $viewName;              // 'posts'
  protected $folderName;            // 'posts' (for storage)
  protected $searchable = [];       // ['title', 'content', 'isbn']

  protected $isUserId = false;      // boolean, if database table need/has user_id column
  protected $slugColumn;            // which column will create the slug? 'title', 'name', 'product_name'
  protected $fileColumn = 'image';  // image column name, default to image

  protected $filterKey = null;      // (optional) 'category_id', 'genre_id'
  protected $filterName = null;     // (optional) 'category', 'genre'
  protected $relationModel = null;  // (optional) Category::class, Genre::class
  protected $relationName = null;   // (optional) 'categories', 'genres' 
                                    // (for the frontend prop)

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $perPage = $request->input('per_page', 5);
    $search = $request->input('search');
    $filterValue = $this->filterName ? $request->input($this->filterName) : null;

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
      ->when(($this->filterKey && $filterValue), function ($query) use ($filterValue) {
        if (str_contains($filterValue, ',')) {
          $ids = explode(',', $filterValue);
          $query->whereIn($this->filterKey, $ids);
        } else {
          $query->where($this->filterKey, $filterValue);
        }
      });

    if ($sortColumn) {
      $query->orderBy($sortColumn, $sortDirection);
    } else {
      $query->latest();
    }

    $items = $query->paginate($perPage)->withQueryString()->onEachSide(1);

    $inertiaData = [
      'items' => $items,
      'filters' => $request->only(['search', 'per_page', $this->filterName]),
    ];

    if ($this->relationName && $this->relationModel) {
      $inertiaData[$this->relationName] = $this->relationModel::all();
    }

    return Inertia::render($this->viewName, $inertiaData);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $data = $request->validate($this->getValidationRules());

    if ($request->hasFile($this->fileColumn)) {
      $data[$this->fileColumn] = $request->file($this->fileColumn)->store($this->folderName, 'public');
    }

    if ($this->filterKey && $this->relationModel) {
      $columnName = str_replace('_id', '_name', $this->filterKey);

      if (Schema::hasColumn((new $this->model)->getTable(), $columnName)) {
        $relationId = $data[$this->filterKey] ?? null;

        if ($relationId) {
          $relation = $this->relationModel::find($relationId);
          $data[$columnName] = $relation ? $relation->name : null;
        } else {
          $data[$columnName] = null;
        }
      }
    }

    if ($this->isUserId) {
      $data['user_id'] = Auth::id();
    }

    if ($this->slugColumn) {
      $data['slug'] = Str::slug($data[$this->slugColumn]) . '-' . Str::random(5);
    }

    $this->model::create($data);

    return redirect()->route($this->viewName . '.index')->with('success', 'Created successfully.');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, $id)
  {
    $item = $this->model::findOrFail($id);

    if ($this->isUserId) {
      if (isset($item->user_id) && $item->user_id !== Auth::id()) abort(403);
    }

    $data = $request->validate($this->getValidationRules($id));

    if ($request->hasFile($this->fileColumn)) {
      if ($item->{$this->fileColumn}) {
        Storage::disk('public')->delete($item->{$this->fileColumn});
      }
      $data[$this->fileColumn] = $request->file($this->fileColumn)->store($this->folderName, 'public');
    }

    if ($this->filterKey && $this->relationModel) {
      $columnName = str_replace('_id', '_name', $this->filterKey);

      if (Schema::hasColumn((new $this->model)->getTable(), $columnName)) {
        $relationId = $data[$this->filterKey] ?? null;

        if ($relationId) {
          $relation = $this->relationModel::find($relationId);
          $data[$columnName] = $relation ? $relation->name : null;
        } else {
          $data[$columnName] = null;
        }
      }
    }

    if ($this->slugColumn) {
      $data['slug'] = Str::slug($data[$this->slugColumn]) . '-' . Str::random(5);
    }

    $item->update($data);

    return redirect()->route($this->viewName . '.index')->with('success', 'Updated successfully.');
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
