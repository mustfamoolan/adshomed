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
        Schema::create('client_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم المشروع
            $table->text('description')->nullable(); // وصف المشروع
            $table->string('client_name'); // اسم العميل
            $table->string('client_phone')->nullable(); // هاتف العميل
            $table->string('client_email')->nullable(); // بريد العميل
            $table->decimal('project_value', 10, 2); // قيمة المشروع
            $table->decimal('paid_amount', 10, 2)->default(0); // المبلغ المدفوع
            $table->decimal('remaining_amount', 10, 2)->default(0); // المبلغ المتبقي
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending'); // حالة المشروع
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid'); // حالة الدفع
            $table->date('start_date')->nullable(); // تاريخ البداية
            $table->date('end_date')->nullable(); // تاريخ الانتهاء
            $table->date('delivery_date')->nullable(); // تاريخ التسليم
            $table->foreignId('manager_id')->constrained('users'); // مدير المشروع
            $table->text('notes')->nullable(); // ملاحظات
            $table->json('requirements')->nullable(); // متطلبات المشروع
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_projects');
    }
};
