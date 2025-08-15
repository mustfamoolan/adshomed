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
        Schema::create('project_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_subscription_plan_id')->constrained()->onDelete('cascade');
            $table->string('activation_code')->unique();
            $table->enum('status', ['pending', 'active', 'expired', 'cancelled'])->default('pending');
            $table->datetime('started_at')->nullable();
            $table->datetime('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_subscriptions');
    }
};
