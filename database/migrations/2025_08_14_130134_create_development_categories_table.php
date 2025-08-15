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
        Schema::create('development_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الفئة
            $table->string('name_en')->nullable(); // الاسم بالإنجليزية
            $table->text('description')->nullable(); // وصف الفئة
            $table->string('icon')->nullable(); // أيقونة الفئة
            $table->string('color')->default('#3B82F6'); // لون الفئة
            $table->boolean('is_active')->default(true); // حالة التفعيل
            $table->integer('sort_order')->default(0); // ترتيب العرض
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_categories');
    }
};
