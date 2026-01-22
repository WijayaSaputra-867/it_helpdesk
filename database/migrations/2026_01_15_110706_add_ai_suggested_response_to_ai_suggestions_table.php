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
        Schema::table('ai_suggestions', function (Blueprint $table) {
            $table->text('ai_suggested_response')->nullable()->after('ai_suggested_priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_suggestions', function (Blueprint $table) {
            $table->dropColumn('ai_suggested_response');
        });
    }
};
