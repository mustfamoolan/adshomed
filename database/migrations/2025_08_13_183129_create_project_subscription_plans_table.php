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
        Schema::create('project_subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('plan_name'); // باقة 1، باقة 2، الخ
            $table->decimal('price', 12, 2); // سعر الباقة
            $table->enum('billing_cycle', ['monthly', 'yearly', 'lifetime'])->default('monthly'); // شهري، سنوي، مدى الحياة
            $table->integer('subscribers_count')->default(0); // عدد المشتركين
            $table->text('description')->nullable(); // وصف الباقة
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_subscription_plans');
    }
};
