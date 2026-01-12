# Common Module CRUD – Usage Guide

This repository includes a reusable **Common Module CRUD system** designed to accelerate backend–frontend CRUD development using Laravel controllers, React (Inertia) and WayFinder.

## Table of Contents

- [Use and update the module](#using-the-common-module-without-cloning-the-repository)
- [Folder Overview](#folder-overview)
- [Core Type Definitions](#core-type-definitions-typests)
- [Recommended Use Path](#recommended-use-path-use-cases)
- [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
- [Final Reminder](#final-reminder)

## Using the Common Module (`Without Cloning the Repository`)

If you are **not cloning the entire repository**, follow these steps carefully:

### 1. Copy Required Files Manually

You must copy the following `every time` you want to `use` or `update` the Common Module:

- **Frontend**

    ```
    resources/js/components/modules/common_module
    ```

- **Backend**

    ```
    app/Http/Controllers/BaseResourceController.php
    ```

> ⚠️ Ensure the **folder structure and import paths** remain correct after pasting.

---

## Folder Overview

### Frontend (React / Inertia)

```
resources/
└── js/
    └── components/
        └── modules/
            └── common_module/
                ├── hooks/
                │   └── useColumnSettings.ts
                ├── columnSettingsDropdown.tsx
                ├── CommonModule.tsx
                ├── DataTable.tsx
                ├── DataTableCell.tsx
                ├── FormDrawer.tsx
                ├── Pagination.tsx
                ├── ReusableFilter.tsx
                ├── Search.tsx
                └── types.ts
```

### Backend (Laravel)

```
app/
└── Http/
    └── Controllers/
        ├── BaseResourceController.php
        └── // your controllers
```

---

### 2. Verify Updates After Copying

After copying, you **must review updates** in the following places:

#### Backend

- Protected properties
  `BaseResourceController.php`

#### Frontend

- Interfaces located in
  `resources/js/components/modules/common_module/types.ts`

**_These define how the module behaves and what data it expects._**

---

## Core Type Definitions (`types.ts`)

Understanding these interfaces is **mandatory** for proper usage.

---

### `ModuleConfig`

Controls **module-level behavior** and configuration.

```ts
export interface ModuleConfig {
    module_name: string; // Display name (e.g. 'Posts')
    route_name: string; // API route (e.g. '/posts')
    model_name: string; // Laravel model name (e.g. 'Post')
    fields: ModuleField[];
    filter_name?: string;
    actions?: boolean; // Enable action buttons
}
```

---

### `ModuleField`

Defines how each database column behaves in **table view**, **forms**, and **filters**.

```ts
export interface ModuleField {
    name: string; // Table header & form label
    key: string; // Database column name (e.g. 'title', 'published_at')
    input_type:
        | 'tinymce' // TinyMCE editor, Can be used instead of textarea
        | 'textarea'
        | 'select' // This select's options will come from another database table
        | 'manualSelect' // This select's options can be made on frontend
        | 'checkbox' // For boolean values
        | 'file' // now supports single 'image'
    //  | 'files' // coming soon
        | 'text'
        | 'email'
        | 'number'
        | 'date'
        | 'tel';
    //  | 'radio' // coming soon

    options?: any[]; // Used for select inputs (category, genre, etc.)
    css_style?: string; // Custom CSS classes
    custom_style?: 'badge' | 'truncate'; // Custom display style
    form_sn?: number; // Form input order
    table_hide?: boolean; // Hide column from table
    form_hide?: boolean; // Hide field from form
    sort?: boolean; // Enable column sorting
}
```

---

## Recommended Use Path (Use Cases)

For better understanding of usage, follow the **three provided use cases** inside the repository.

### Most Updated Example

```
resources/js/pages/headphones.tsx

app/Http/Controllers/HeadphoneController.php
```

### Others are

```
resources/js/pages/books.tsx

app/Http/Controllers/BookController.php
```

```
resources/js/pages/posts.tsx

app/Http/Controllers/PostController.php
```

This file reflects the **latest and most complete implementation** of the Common Module and should be used as the primary reference.

---

## Step-by-Step Implementation Guide

This section describes the **standard workflow** for creating a new CRUD module using the Common Module pattern (example: **Headphones**).

---

### Step 1: Generate Base Files

Create the model, migration, and controller using Laravel’s `-mcr` flag:

```bash
php artisan make:model Headphone -mcr
```

This generates:

- Model (`Headphone.php`)
- Migration file
- Controller (`HeadphoneController.php`)

---

### Step 2: Define the TypeScript Model Interface

Create a **TypeScript interface** that fully represents the database table structure.

📄 `resources/js/types/index.d.ts`

```ts
export interface Headphone {
    id: number;
    brand: string;
    model_name: string;
    slug: string;
    type: 'Over-Ear' | 'On-Ear' | 'In-Ear';
    connection_type: 'Wired' | 'Wireless' | 'Hybrid';
    color: string;
    has_microphone: boolean;
    is_noise_cancelling: boolean;
    price: number;
    discount_price?: number;
    stock_quantity: number;
    status: 'In Stock' | 'Out of Stock' | 'Pre-order';
    image_url: string;
    description: string;
    location_rack: string;
}
```

> ⚠️ This interface **must stay in sync** with the database schema.

---

### Step 3: Configure the Eloquent Model

Update the model’s `$fillable` and `$casts` properties.

📄 `app/Models/Headphone.php`

- Add all database columns to `$fillable`
- Cast booleans, integers, and decimals properly

This ensures:

- Mass assignment works
- Data types remain consistent

---

### Step 4: Define the Migration Schema

Update the generated migration to match the model and TS interface.

📄 `database/migrations/xxxx_create_headphones_table.php`

- Use proper column types
- Add defaults where applicable
- Ensure enum values match frontend options

---

### Step 5: Extend `BaseResourceController`

Make the controller extend `BaseResourceController` and configure module behavior.

📄 `app/Http/Controllers/HeadphoneController.php`

Key properties to review:

- `$model`
- `$viewName`
- `$folderName`
- `$searchable`
- `$slugColumn`
- `$fileColumn`

Also define validation rules via `getValidationRules()`.

---

### Step 6: Register Routes

Add resource and bulk routes.

📄 `routes/web.php`

```php
Route::delete('/headphones/bulk', [HeadphoneController::class, 'bulkDestroy'])
    ->name('headphones.bulk');

Route::resource('headphones', HeadphoneController::class);
```

---

### Step 7: Define `moduleConfig`

Define how fields behave in:

- Table
- Form
- Filters
- Sorting

This configuration **connects backend data to UI behavior**.

Key properties:

- `module_name`
- `route_name`
- `model_name`
- `fields[]`

---

### Step 8: Create the Page Component

Create the page that consumes the Common Module.

📄 `resources/js/pages/headphones.tsx`

Responsibilities:

- Import `CommonModule`
- Receive paginated data from backend
- Pass configuration via `moduleConfig`

---

### Step 9: Run Database Migration

Finally, migrate the database:

```bash
php artisan migrate
```

---

### Important Notes

- Backend schema, validation rules, and frontend `ModuleConfig` **must always match**
- Any change in one layer **requires updates in the others**
- Use the **Headphones module** as the most up-to-date reference

## Final Reminder

The Common Module is **powerful but tightly coupled** between frontend and backend.
Any change on one side **must be reflected on the other**.
