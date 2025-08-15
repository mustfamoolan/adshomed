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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم العميل
            $table->string('phone')->unique(); // رقم الهاتف
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null'); // البرنامج/المشروع
            $table->enum('status', [
                'potential_buyer',      // مشتري محتمل
                'cancelled',           // ملغي
                'bad',                // سيء
                'service_request',     // عميل يطلب خدمة
                'service_completed',   // مكتمل الخدمة
                'subscriber'          // مشترك
            ])->default('potential_buyer');
            $table->string('activation_code')->nullable(); // كود التفعيل للمشتركين
            $table->timestamp('activation_code_expires_at')->nullable(); // انتهاء كود التفعيل
            $table->boolean('is_active')->default(true); // حالة العميل
            $table->json('metadata')->nullable(); // بيانات إضافية
            $table->text('initial_notes')->nullable(); // ملاحظات أولية
            $table->foreignId('client_project_id')->nullable()->constrained()->onDelete('set null'); // ربط بمشروع العميل
            $table->timestamp('last_contact_at')->nullable(); // آخر تواصل
            $table->string('source')->nullable(); // مصدر العميل (إعلان، مراجعة، إلخ)
            $table->decimal('total_spent', 10, 2)->default(0); // إجمالي ما أنفقه
            $table->integer('orders_count')->default(0); // عدد الطلبات
            $table->timestamp('subscribed_at')->nullable(); // تاريخ الاشتراك
            $table->timestamps();

            // Indexes للبحث السريع
            $table->index(['status', 'is_active']);
            $table->index(['phone']);
            $table->index(['project_id']);
            $table->index(['last_contact_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
