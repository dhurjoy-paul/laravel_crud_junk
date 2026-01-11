<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('headphones', function (Blueprint $table) {
            $table->id(); // id: number

            // Basic Info
            $table->string('brand');
            $table->string('model_name');
            $table->string('slug')->unique(); // Unique for SEO URLs

            // Tech Specs
            $table->string('type'); // 'Over-Ear' | 'On-Ear' | 'In-Ear'
            $table->string('connection_type'); // 'Wired' | 'Wireless' | 'Hybrid'
            $table->string('color');
            $table->boolean('has_microphone')->default(false);
            $table->boolean('is_noise_cancelling')->default(false);

            // Inventory & Pricing
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->enum('status', ['In Stock', 'Out of Stock', 'Pre-order'])->default('In Stock');

            // Content & Location
            $table->string('image_url')->nullable();
            $table->text('description');
            $table->string('location_rack');

            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('headphones');
    }
};
