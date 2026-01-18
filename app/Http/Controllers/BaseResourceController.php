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
  protected $slugColumn = null;     // which column will create the slug? 'title', 'name', 'product_name'
  protected $fileColumn = 'image';  // image column name, default to image

  // for eager loading relationships in the table
  protected $load = [];             // ['student', 'book']
  // for multiple dropdowns/lists in the frontend ['props name' => desired model]
  protected $extraData = [];        // ['students' => Student::class, 'books' => Book::class]

  // need to remove, using at store and update now
  protected $filterKey = null;
  protected $filterName = null;

  protected $relationModel = null;  // (optional) Category::class, Genre::class
  protected $relationName = null;   // (optional) 'categories', 'genres' (for the frontend prop)

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $allFilters = $request->all();
    $perPage = $request->input('per_page', 5);
    $search = $request->input('search');
    $sortColumn = $request->input('column', 'created_at');
    $sortDirection = $request->input('sort', 'desc');

    // initializing query with eager loading
    $query = $this->model::with($this->load);

    // 1. search query
    $query->when($search, function ($q) use ($search) {
      $q->where(function ($subQuery) use ($search) {
        foreach ($this->searchable as $column) {
          if (str_contains($column, '.')) {
            [$relation, $relCol] = explode('.', $column);
            $subQuery->orWhereHas($relation, function ($rq) use ($relCol, $search) {
              $rq->where($relCol, 'like', "%{$search}%");
            });
          } else {
            $subQuery->orWhere($column, 'like', "%{$search}%");
          }
        }
      });
    });

    // 2. filter queries
    foreach ($allFilters as $key => $value) {
      if (in_array($key, ['search', 'per_page', 'column', 'sort', 'page'])) continue;
      if (!$value) continue;

      if (Schema::hasColumn((new $this->model)->getTable(), $key)) {
        $values = explode(',', $value);
        $query->whereIn($key, $values);
      }
    }

    // 3. sort query
    if ($sortColumn && Schema::hasColumn((new $this->model)->getTable(), $sortColumn)) {
      $query->orderBy($sortColumn, $sortDirection);
    } else {
      $query->latest();
    }

    // 4. pagination query
    $items = $query->paginate($perPage)->withQueryString()->onEachSide(1);

    $inertiaData = [
      'items' => $items,
      'filters' => $request->all(),
    ];

    if (!empty($this->extraData)) {
      foreach ($this->extraData as $propName => $modelClass) {
        $inertiaData[$propName] = $modelClass::all();
      }
    }

    // cant remove relationName, relationModel right now
    // if ($this->relationName && $this->relationModel) {
    //   $inertiaData[$this->relationName] = $this->relationModel::all();
    // }

    return Inertia::render($this->viewName, $inertiaData);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $fileColumn = $this->fileColumn;
    $data = $request->validate($this->getValidationRules());

    if ($request->hasFile($fileColumn)) {
      $data[$fileColumn] = $request->file($fileColumn)->store($this->folderName, 'public');
    }

    if ($this->isUserId) {
      $data['user_id'] = Auth::id();
    }

    if ($this->slugColumn) {
      $data['slug'] = Str::slug($data[$this->slugColumn]) . '-' . Str::random(5);
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

    $this->model::create($data);

    return redirect()->route($this->viewName . '.index')->with('success', 'Created successfully.');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, $id)
  {
    $fileColumn = $this->fileColumn;
    $item = $this->model::findOrFail($id);

    if ($this->isUserId) {
      if (isset($item->user_id) && $item->user_id !== Auth::id()) abort(403);
    }

    $data = $request->validate($this->getValidationRules($id));

    if ($request->hasFile($fileColumn)) {
      if ($item->{$fileColumn}) {
        Storage::disk('public')->delete($item->{$fileColumn});
      }
      $data[$fileColumn] = $request->file($fileColumn)->store($this->folderName, 'public');
    } else {
      unset($data[$fileColumn]);
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
