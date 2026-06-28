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
        Schema::create('water_qualities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('tanggal_pengukuran');
            $table->double('ph');
            $table->double('suhu');
            $table->double('dissolved_oxygen');
            $table->double('kekeruhan');
            $table->double('nitrate');
            $table->double('amonia');
            $table->string('status_air'); // 'Aman', 'Perlu Perhatian', 'Berbahaya'
            $table->text('rekomendasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('water_qualities');
    }
};
