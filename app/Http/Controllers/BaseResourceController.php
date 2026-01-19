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
  /**
   * ========================================================================
   * PREREQUISITES FOR CHILD CONTROLLERS
   * ========================================================================
   * 1. MODEL: Define the main model class.
   * 2. VIEW & FOLDER: Define view name (Inertia) and storage folder.
   * 3. EXTRA DATA: Map plural relation keys to Model classes (e.g. 'students' => Student::class).
   * ---- This is required for search fallbacks and dropdown data.
   * 4. SEARCHABLE: Use dot notation for relations (e.g. 'students.name').
   * ---- Logic first checks for a relationship method (singular: student()).
   * ---- If missing, it joins via extraData key assuming a 'student_id' column.
   * 5. SYNCING: If table has a '*_name' column (e.g. 'student_name'), 
   * it is automatically populated from the related model's 'name' or 'title'.
   * ========================================================================
   */

  protected $model;                 // Example: Post::class
  protected $viewName;              // Example: 'posts' (Inertia render path)
  protected $folderName;            // Example: 'posts' (Folder name for file uploads)

  /**
   * Columns allowed for global search.
   * Local: ['title', 'isbn']
   * Relation: ['students.name'] -> Searches 'name' on the 'students' table.
   */
  protected $searchable = [];

  protected $isUserId = false;      // Set true if table has 'user_id' for ownership checks
  protected $slugColumn = null;     // Column to generate slug from (e.g. 'title')
  protected $fileColumn = 'image';  // Column name for file/image uploads

  /**
   * Eager load relationships for the index table.
   * Must correspond to Eloquent relationship methods in the Model.
   */
  protected $load = [];             // Example: ['student', 'book']

  /**
   * Map plural keys to Model classes.
   * Used for: 
   * a) Sending dropdown/list data to the frontend Inertia props.
   * b) Manual join searching if Eloquent relations aren't defined.
   * c) Auto-syncing '*_name' columns in store/update.
   */
  protected $extraData = [];        // Example: ['students' => Student::class]

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
            [$relationKey, $relCol] = explode('.', $column);

            $relationMethod = Str::singular($relationKey);

            if (method_exists($this->model, $relationMethod)) {
              $subQuery->orWhereHas($relationMethod, function ($rq) use ($relCol, $search) {
                $rq->where($relCol, 'like', "%{$search}%");
              });
            } elseif (isset($this->extraData[$relationKey])) {
              $relatedModel = new $this->extraData[$relationKey];
              $relatedTable = $relatedModel->getTable();
              // example: 'student_id'
              $foreignKey = $relationMethod . '_id';

              $subQuery->orWhereIn('id', function ($inner) use ($relatedTable, $relCol, $search, $foreignKey) {
                $inner->select($this->model->getTable() . '.id')
                  ->from($this->model->getTable())
                  ->join($relatedTable, $this->model->getTable() . '.' . $foreignKey, '=', $relatedTable . '.id')
                  ->where($relatedTable . '.' . $relCol, 'like', "%{$search}%");
              });
            }
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

    $data = $this->syncRelationNames($data);

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

    if ($this->slugColumn) {
      $data['slug'] = Str::slug($data[$this->slugColumn]) . '-' . Str::random(5);
    }

    $data = $this->syncRelationNames($data);

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

    if ($item->{$this->fileColumn}) Storage::disk('public')->delete($item->{$this->fileColumn});
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
      if ($item->{$this->fileColumn}) Storage::disk('public')->delete($item->{$this->fileColumn});
      $item->delete();
    }

    return redirect()->back()->with('message', 'Items deleted successfully');
  }

  /**
   * Synchronizes denormalized columns (e.g., student_name, book_title) 
   * based on '_id' fields using extraData mapping.
   */
  protected function syncRelationNames(array $data): array
  {
    $table = (new $this->model)->getTable();

    foreach ($data as $key => $value) {
      if (str_ends_with($key, '_id')) {
        $prefix = str_replace('_id', '', $key);
        $columns = Schema::getColumnListing($table);

        $targetColumn = collect($columns)->first(function ($col) use ($prefix) {
          return str_starts_with($col, $prefix . '_') && !str_ends_with($col, '_id');
        });

        if ($targetColumn) {
          $relationKey = Str::plural($prefix); // student -> students
          $modelClass = $this->extraData[$relationKey] ?? null;

          if ($modelClass && $value) {
            $relation = $modelClass::find($value);

            if ($relation) {
              $attributeToPull = str_replace($prefix . '_', '', $targetColumn); // 'title'
              $data[$targetColumn] = $relation->{$attributeToPull}
                ?? $relation->name
                ?? $relation->title
                ?? null;
            } else {
              $data[$targetColumn] = null;
            }
          } else {
            $data[$targetColumn] = null;
          }
        }
      }
    }

    return $data;
  }

  abstract protected function getValidationRules($id = null);
}
