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
        Schema::table('projects', function (Blueprint $table) {
            // For Sales projects
            $table->decimal('product_price', 12, 2)->nullable()->after('total_expenses');

            // For Downloads projects (manual revenue input)
            $table->decimal('manual_revenue', 12, 2)->default(0)->after('product_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['product_price', 'manual_revenue']);
        });
    }
};
