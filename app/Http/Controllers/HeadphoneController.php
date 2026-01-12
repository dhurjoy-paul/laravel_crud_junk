<?php

namespace App\Http\Controllers;

use App\Models\Headphone;
use Illuminate\Validation\Rule;

class HeadphoneController extends BaseResourceController
{
    protected $model = Headphone::class;
    protected $viewName = 'headphones';
    protected $folderName = 'headphones';
    protected $searchable = ['brand', 'model_name', 'description', 'color', 'location_rack'];

    protected $isUserId = false;
    protected $slugColumn = 'model_name';
    protected $fileColumn = 'image_url';

    /**
     * Get the validation rules for the resource.
     */
    protected function getValidationRules($id = null)
    {
        return [
            'brand'               => ['required', 'string', 'max:255'],
            'model_name'          => ['required', 'string', 'max:255'],
            'slug'                => ['nullable', 'string', Rule::unique('headphones', 'slug')->ignore($id)],

            'type'                => ['required', Rule::in(['Over-Ear', 'On-Ear', 'In-Ear'])],
            'connection_type'     => ['required', Rule::in(['Wired', 'Wireless', 'Hybrid'])],

            'color'               => ['required', 'string', 'max:50'],

            'has_microphone'      => ['boolean'],
            'is_noise_cancelling' => ['boolean'],

            'price'               => ['required', 'numeric', 'min:0'],
            'discount_price'      => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock_quantity'      => ['required', 'integer', 'min:0'],
            'status'              => ['required', Rule::in(['In Stock', 'Out of Stock', 'Pre-order'])],
            'image_url'          => $id ? ['nullable', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'] : ['required', 'image', 'mimes:jpeg,png,jpg,svg', 'max:2048'],
            'description'         => ['required', 'string'],
            'location_rack'       => ['required', 'string', 'max:100'],
        ];
    }
}
