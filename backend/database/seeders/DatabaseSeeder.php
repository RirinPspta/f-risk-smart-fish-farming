<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WaterQuality;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat User Admin
        $admin = User::create([
            'name' => 'Administrator F-RISK',
            'email' => 'admin@smartfishing.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Buat User Petambak
        $petambak = User::create([
            'name' => 'Budi Santoso (Petambak Ikan)',
            'email' => 'petambak@smartfishing.com',
            'password' => Hash::make('password'),
            'role' => 'petambak',
        ]);

        // 3. Buat User Petambak Tambahan untuk Variasi
        $petambak2 = User::create([
            'name' => 'Joko Widodo (Petambak Tambak)',
            'email' => 'joko@smartfishing.com',
            'password' => Hash::make('password'),
            'role' => 'petambak',
        ]);

        // 4. Data Historis Kualitas Air selama 10 hari ke belakang untuk Budi
        $baseTime = Carbon::now();
        
        $historicalData = [
            [
                'days_ago' => 9,
                'ph' => 7.2,
                'suhu' => 28.5,
                'dissolved_oxygen' => 6.5,
                'kekeruhan' => 30.0,
                'nitrate' => 12.0,
                'amonia' => 0.02,
            ],
            [
                'days_ago' => 8,
                'ph' => 7.4,
                'suhu' => 29.0,
                'dissolved_oxygen' => 6.2,
                'kekeruhan' => 32.5,
                'nitrate' => 12.8,
                'amonia' => 0.03,
            ],
            [
                'days_ago' => 7,
                'ph' => 7.5,
                'suhu' => 28.8,
                'dissolved_oxygen' => 5.8,
                'kekeruhan' => 45.0, // Mulai keruh
                'nitrate' => 15.2,
                'amonia' => 0.04,
            ],
            [
                'days_ago' => 6,
                'ph' => 7.1,
                'suhu' => 26.5,
                'dissolved_oxygen' => 4.5, // DO drop (Perlu Perhatian)
                'kekeruhan' => 55.0, // Turbidity tinggi (Perlu Perhatian)
                'nitrate' => 18.0,
                'amonia' => 0.08,
            ],
            [
                'days_ago' => 5,
                'ph' => 5.8, // pH kritis (< 6.0)
                'suhu' => 24.0, // Suhu sub-optimal (warning)
                'dissolved_oxygen' => 1.8, // DO kritis (< 2.0)
                'kekeruhan' => 160.0, // Kekeruhan kritis (> 150.0)
                'nitrate' => 210.0, // Nitrat kritis (> 200.0)
                'amonia' => 3.5, // Amonia kritis (> 3.0)
            ],
            [
                'days_ago' => 4,
                'ph' => 6.8,
                'suhu' => 27.0,
                'dissolved_oxygen' => 5.5,
                'kekeruhan' => 40.0,
                'nitrate' => 16.5,
                'amonia' => 0.05,
            ],
            [
                'days_ago' => 3,
                'ph' => 7.3,
                'suhu' => 28.2,
                'dissolved_oxygen' => 6.1,
                'kekeruhan' => 28.0,
                'nitrate' => 11.2,
                'amonia' => 0.02,
            ],
            [
                'days_ago' => 2,
                'ph' => 7.6,
                'suhu' => 28.9,
                'dissolved_oxygen' => 6.4,
                'kekeruhan' => 22.0,
                'nitrate' => 9.5,
                'amonia' => 0.02,
            ],
            [
                'days_ago' => 1,
                'ph' => 7.4,
                'suhu' => 28.4,
                'dissolved_oxygen' => 6.8,
                'kekeruhan' => 18.0,
                'nitrate' => 8.2,
                'amonia' => 0.01,
            ],
            [
                'days_ago' => 0, // Hari ini
                'ph' => 7.3,
                'suhu' => 28.0,
                'dissolved_oxygen' => 7.0,
                'kekeruhan' => 15.0,
                'nitrate' => 7.5,
                'amonia' => 0.01,
            ],
        ];

        foreach ($historicalData as $data) {
            WaterQuality::create([
                'user_id' => $petambak->id,
                'tanggal_pengukuran' => Carbon::now()->subDays($data['days_ago'])->toDateString(),
                'ph' => $data['ph'],
                'suhu' => $data['suhu'],
                'dissolved_oxygen' => $data['dissolved_oxygen'],
                'kekeruhan' => $data['kekeruhan'],
                'nitrate' => $data['nitrate'],
                'amonia' => $data['amonia'],
            ]);
        }

        // Tambah beberapa data seeder untuk petambak kedua agar admin bisa memonitor banyak data
        WaterQuality::create([
            'user_id' => $petambak2->id,
            'tanggal_pengukuran' => Carbon::now()->subDays(1)->toDateString(),
            'ph' => 7.8,
            'suhu' => 29.5,
            'dissolved_oxygen' => 6.0,
            'kekeruhan' => 25.0,
            'nitrate' => 14.5,
            'amonia' => 0.03,
        ]);
        
        WaterQuality::create([
            'user_id' => $petambak2->id,
            'tanggal_pengukuran' => Carbon::now()->toDateString(),
            'ph' => 8.0,
            'suhu' => 30.1,
            'dissolved_oxygen' => 5.9,
            'kekeruhan' => 20.0,
            'nitrate' => 13.8,
            'amonia' => 0.04,
        ]);
    }
}
