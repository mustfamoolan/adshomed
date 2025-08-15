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
        Schema::table('customer_notes', function (Blueprint $table) {
            // إعادة تعريف العمود بدون نوع subscription
            $table->enum('type', [
                'general',          // عام
                'call',            // مكالمة
                'meeting',         // اجتماع
                'complaint',       // شكوى
                'follow_up',       // متابعة
                'payment',         // دفع
                'service_update',  // تحديث خدمة
                'status_change'    // تغيير حالة
            ])->default('general')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_notes', function (Blueprint $table) {
            // إضافة نوع subscription مرة أخرى
            $table->enum('type', [
                'general',          // عام
                'call',            // مكالمة
                'meeting',         // اجتماع
                'complaint',       // شكوى
                'follow_up',       // متابعة
                'payment',         // دفع
                'service_update',  // تحديث خدمة
                'status_change',   // تغيير حالة
                'subscription'     // اشتراك
            ])->default('general')->change();
        });
    }
};
