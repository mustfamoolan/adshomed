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
        Schema::create('customer_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // الموظف الذي نفذ النشاط
            $table->string('type'); // نوع النشاط (subscription_added, subscription_status_changed, etc.)
            $table->string('title'); // عنوان النشاط
            $table->text('description'); // وصف النشاط
            $table->json('meta_data')->nullable(); // بيانات إضافية (مثل الحالة القديمة والجديدة)
            $table->timestamps();

            $table->index(['customer_id', 'created_at']);
            $table->index(['type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_activities');
    }
};
