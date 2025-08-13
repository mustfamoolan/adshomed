<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // أولاً تحديث القيم الموجودة
        DB::table('project_expenses')
            ->where('category', 'marketing')
            ->update(['category' => 'advertising']);

        // تعديل العمود لإضافة قيم جديدة
        Schema::table('project_expenses', function (Blueprint $table) {
            $table->enum('category', [
                'advertising',
                'marketing',
                'development',
                'management',
                'design',
                'hosting',
                'equipment',
                'licenses',
                'testing',
                'maintenance',
                'other'
            ])->default('other')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_expenses', function (Blueprint $table) {
            $table->enum('category', [
                'advertising',
                'development',
                'management',
                'design',
                'hosting',
                'other'
            ])->default('other')->change();
        });
    }
};
