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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('books');

        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('title');
            $table->string('author');
            $table->string('isbn')->unique()->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('available_copies')->default(0);
            $table->string('genre');
            $table->date('published_date')->nullable();

            // Physical location
            $table->string('floor')->nullable();
            $table->string('section')->nullable();
            $table->string('rack')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
