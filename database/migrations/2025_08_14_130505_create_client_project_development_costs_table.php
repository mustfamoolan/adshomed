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
        Schema::create('client_project_development_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_project_id')->constrained('client_projects')->onDelete('cascade');
            $table->foreignId('development_category_id')->constrained('development_categories');
            $table->decimal('amount', 10, 2); // المبلغ
            $table->text('description')->nullable(); // وصف التكلفة
            $table->date('expense_date')->default(now()); // تاريخ الصرف
            $table->string('receipt_number')->nullable(); // رقم الإيصال أو المرجع
            $table->json('additional_data')->nullable(); // بيانات إضافية
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_project_development_costs');
    }
};
