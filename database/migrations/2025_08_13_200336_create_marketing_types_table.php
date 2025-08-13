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
        Schema::create('marketing_types', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // المفتاح الإنجليزي
            $table->string('name_ar'); // الاسم العربي
            $table->string('name_en'); // الاسم الإنجليزي
            $table->string('category'); // الفئة الرئيسية
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_types');
    }
};
