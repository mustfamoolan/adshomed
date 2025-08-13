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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('initial_budget', 12, 2)->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->decimal('total_expenses', 12, 2)->default(0);
            $table->integer('sales_count')->default(0);
            $table->integer('downloads_count')->default(0);
            $table->enum('type', ['sales', 'subscription', 'free', 'downloads'])->default('sales');
            $table->enum('status', ['planning', 'active', 'completed', 'paused', 'cancelled'])->default('planning');
            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
