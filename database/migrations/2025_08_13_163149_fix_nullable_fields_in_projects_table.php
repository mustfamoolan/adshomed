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
            $table->integer('sales_count')->nullable()->default(0)->change();
            $table->integer('downloads_count')->nullable()->default(0)->change();
            $table->decimal('total_revenue', 12, 2)->nullable()->default(0)->change();
            $table->decimal('total_expenses', 12, 2)->nullable()->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->integer('sales_count')->default(0)->change();
            $table->integer('downloads_count')->default(0)->change();
            $table->decimal('total_revenue', 12, 2)->default(0)->change();
            $table->decimal('total_expenses', 12, 2)->default(0)->change();
        });
    }
};
