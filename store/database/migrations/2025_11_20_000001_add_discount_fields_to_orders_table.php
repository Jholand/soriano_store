<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->after('total_amount')->default(0);
            $table->decimal('discount', 10, 2)->after('subtotal')->default(0);
            $table->string('discount_type')->after('discount')->nullable();
            $table->decimal('discount_value', 10, 2)->after('discount_type')->default(0);
            $table->string('discount_category')->after('discount_value')->nullable();
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'discount', 'discount_type', 'discount_value', 'discount_category']);
        });
    }
};
