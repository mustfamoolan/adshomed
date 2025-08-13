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
        Schema::table('projects', function (Blueprint $table) {
            // تغيير تسميات التواريخ الموجودة
            $table->renameColumn('start_date', 'development_start_date');
            $table->renameColumn('end_date', 'development_end_date');

            // إضافة حقول جديدة
            $table->date('publication_date')->nullable()->after('development_end_date');
            $table->enum('publication_status', ['published', 'unpublished', 'not_displayed'])->default('not_displayed')->after('publication_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->renameColumn('development_start_date', 'start_date');
            $table->renameColumn('development_end_date', 'end_date');
            $table->dropColumn(['publication_date', 'publication_status']);
        });
    }
};
