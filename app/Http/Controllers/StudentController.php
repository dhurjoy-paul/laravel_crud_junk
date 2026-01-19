<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Validation\Rule;

class StudentController extends BaseResourceController
{
    protected $model = Student::class;
    protected $viewName = 'students';
    protected $folderName = 'students';
    protected $searchable = ['name', 'email', 'student_card_id'];

    protected $isUserId = false;
    protected $slugColumn = null;
    protected $fileColumn = 'image';

    protected function getValidationRules($id = null)
    {
        return [
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', Rule::unique('students', 'email')->ignore($id)],
            'student_card_id'  => ['nullable', 'string', Rule::unique('students', 'student_card_id')->ignore($id)],
            'image'          => $id ? ['nullable', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'] : ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'is_active'        => ['required', 'string'],
            'max_borrow_limit' => ['required', 'integer', 'min:0'],
        ];
    }
}
