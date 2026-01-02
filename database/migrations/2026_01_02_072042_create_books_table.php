<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    { {
            Schema::create('books', function (Blueprint $table) {
                $table->id();
                $table->string('slug')->unique();
                $table->string('image')->nullable();
                $table->string('title');
                $table->string('author')->nullable();
                $table->string('isbn')->unique()->nullable();
                $table->text('description')->nullable();
                $table->decimal('price', 8, 2)->nullable();
                $table->integer('quantity')->default(0);
                $table->date('published_date')->nullable();
                $table->string('genre_name');
                $table->foreignId('genre_id')->constrained()->onDelete('cascade');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
