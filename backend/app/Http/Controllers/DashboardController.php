<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WaterQuality;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $totalUsers = User::count();

        if ($user->role === 'admin') {
            $totalMeasurements = WaterQuality::count();
            $measurementsToday = WaterQuality::whereDate('tanggal_pengukuran', $today)->count();
            $latestMeasurement = WaterQuality::with('user:id,name,email')
                ->orderBy('tanggal_pengukuran', 'desc')
                ->orderBy('id', 'desc')
                ->first();
        } else {
            // Petambak hanya melihat data miliknya sendiri
            $totalMeasurements = WaterQuality::where('user_id', $user->id)->count();
            $measurementsToday = WaterQuality::where('user_id', $user->id)
                ->whereDate('tanggal_pengukuran', $today)
                ->count();
            $latestMeasurement = WaterQuality::where('user_id', $user->id)
                ->orderBy('tanggal_pengukuran', 'desc')
                ->orderBy('id', 'desc')
                ->first();
        }

        return response()->json([
            'total_users' => $totalUsers,
            'total_pengukuran' => $totalMeasurements,
            'pengukuran_hari_ini' => $measurementsToday,
            'status_air_terakhir' => $latestMeasurement,
        ]);
    }
}
