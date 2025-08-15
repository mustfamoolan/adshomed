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
        Schema::create('customer_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // الموظف الذي أضاف الملاحظة
            $table->enum('type', [
                'general',          // عام
                'call',            // مكالمة
                'meeting',         // اجتماع
                'complaint',       // شكوى
                'follow_up',       // متابعة
                'payment',         // دفع
                'service_update',  // تحديث خدمة
                'status_change'    // تغيير حالة
            ])->default('general');
            $table->string('title'); // عنوان الملاحظة
            $table->text('content'); // محتوى الملاحظة
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->boolean('is_important')->default(false); // ملاحظة مهمة
            $table->timestamp('follow_up_date')->nullable(); // تاريخ المتابعة
            $table->json('attachments')->nullable(); // مرفقات (صور، ملفات)
            $table->timestamps();

            $table->index(['customer_id', 'created_at']);
            $table->index(['type']);
            $table->index(['follow_up_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_notes');
    }
};
