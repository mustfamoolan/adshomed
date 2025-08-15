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
        Schema::create('customer_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null'); // المشروع المطلوب
            $table->foreignId('client_project_id')->nullable()->constrained()->onDelete('set null'); // مشروع العميل إذا كان طلب خدمة
            $table->enum('type', [
                'subscription',     // طلب اشتراك
                'service',         // طلب خدمة
                'consultation',    // استشارة
                'support',         // دعم فني
                'customization',   // تخصيص
                'maintenance',     // صيانة
                'upgrade',         // ترقية
                'refund'          // استرداد
            ]);
            $table->enum('status', [
                'pending',         // قيد الانتظار
                'in_progress',     // قيد التنفيذ
                'completed',       // مكتمل
                'cancelled',       // ملغي
                'on_hold',         // معلق
                'rejected'         // مرفوض
            ])->default('pending');
            $table->string('title'); // عنوان الطلب
            $table->text('description'); // وصف الطلب
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->decimal('estimated_cost', 10, 2)->nullable(); // التكلفة المقدرة
            $table->decimal('final_cost', 10, 2)->nullable(); // التكلفة النهائية
            $table->timestamp('requested_delivery_date')->nullable(); // التاريخ المطلوب للتسليم
            $table->timestamp('actual_delivery_date')->nullable(); // التاريخ الفعلي للتسليم
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // الموظف المكلف
            $table->json('requirements')->nullable(); // متطلبات تفصيلية
            $table->json('deliverables')->nullable(); // المخرجات المطلوبة
            $table->text('admin_notes')->nullable(); // ملاحظات الإدارة
            $table->text('customer_feedback')->nullable(); // تقييم العميل
            $table->integer('rating')->nullable(); // تقييم من 1-5
            $table->timestamps();

            $table->index(['customer_id', 'status']);
            $table->index(['type', 'status']);
            $table->index(['assigned_to']);
            $table->index(['requested_delivery_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_requests');
    }
};
