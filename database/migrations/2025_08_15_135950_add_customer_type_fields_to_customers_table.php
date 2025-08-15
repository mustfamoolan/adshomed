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
        Schema::table('customers', function (Blueprint $table) {
            $table->enum('customer_type', ['service_request', 'our_project_client', 'client_project_owner'])
                  ->after('status')
                  ->default('service_request');
            $table->enum('subscription_type', ['sale', 'subscription', 'download'])
                  ->after('customer_type')
                  ->nullable();
            $table->string('download_id', 100)
                  ->after('activation_code')
                  ->nullable()
                  ->comment('معرف التحميل الخاص للعميل في برنامج المحمل');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['customer_type', 'subscription_type', 'download_id']);
        });
    }
};
