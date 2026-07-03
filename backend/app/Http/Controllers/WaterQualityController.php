<?php

namespace App\Http\Controllers;

use App\Models\WaterQuality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class WaterQualityController extends Controller
{
    /**
     * Display a listing of the resource (with Search and Filter).
     */
    public function index(Request $request)
    {
        $user = $request->user(); // Ambil data user yang sedang login

        // Panggil data beserta nama user yang menginput
        $query = WaterQuality::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        // 1. FILTER PENGINPUT (Ini yang membuat pencarian nama berfungsi)
        if ($request->filled('penginput')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->penginput . '%');
            });
        }

        // 2. FILTER STATUS AIR (Gunakan LIKE untuk mendeteksi kata di dalam teks panjang)
        if ($request->filled('status_air')) {
            $status = $request->status_air;
            
            $query->where(function($q) use ($status) {
                $q->where('status_air', 'LIKE', '%' . $status . '%');
                
                // Perbaikan otomatis: Anggap 'Berisiko' dan 'Beresiko' itu sama
                if (strtolower($status) === 'beresiko' || strtolower($status) === 'berisiko') {
                    $q->orWhere('status_air', 'LIKE', '%Berisiko%')
                      ->orWhere('status_air', 'LIKE', '%Beresiko%');
                }
            });
        }

        // 3. FILTER TANGGAL MULAI
        if ($request->filled('start_date')) {
            $query->whereDate('tanggal_pengukuran', '=', $request->start_date);
        }

        // 4. PENGURUTAN DATA (Diperbarui agar data terbaru di hari yang sama naik ke atas)
        $data = $query->orderBy('tanggal_pengukuran', 'desc')
                      ->orderBy('id', 'desc')
                      ->get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal_pengukuran' => 'required|date',
            'ph' => 'required|numeric|between:0,14',
            'suhu' => 'required|numeric|between:0,50',
            'dissolved_oxygen' => 'required|numeric|between:0,20',
            'kekeruhan' => 'required|numeric|min:0',
            'nitrate' => 'required|numeric|min:0',
            'amonia' => 'required|numeric|min:0',
        ]);

        // Simpan data dengan mengaitkan user_id ke user yang sedang login
        $waterQuality = WaterQuality::create(array_merge(
            $validated,
            ['user_id' => $request->user()->id]
        ));

        return response()->json([
            'message' => 'Data kualitas air berhasil dicatat.',
            'data' => $waterQuality
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $waterQuality = WaterQuality::findOrFail($id);
        $user = $request->user();

        // Cek hak akses
        if ($user->role !== 'admin' && $waterQuality->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke data ini.'], 403);
        }

        if ($user->role === 'admin') {
            $waterQuality->load('user:id,name,email');
        }

        return response()->json($waterQuality);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $waterQuality = WaterQuality::findOrFail($id);
        $user = $request->user();

        // Cek hak akses: Petambak hanya bisa mengedit data miliknya sendiri
        if ($user->role !== 'admin' && $waterQuality->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki hak untuk mengubah data ini.'], 403);
        }

        $validated = $request->validate([
            'tanggal_pengukuran' => 'required|date',
            'ph' => 'required|numeric|between:0,14',
            'suhu' => 'required|numeric|between:0,50',
            'dissolved_oxygen' => 'required|numeric|between:0,20',
            'kekeruhan' => 'required|numeric|min:0',
            'nitrate' => 'required|numeric|min:0',
            'amonia' => 'required|numeric|min:0',
        ]);

        $waterQuality->update($validated);

        return response()->json([
            'message' => 'Data kualitas air berhasil diperbarui.',
            'data' => $waterQuality
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $waterQuality = WaterQuality::findOrFail($id);
        $user = $request->user();

        // Cek hak akses: Admin boleh hapus apa saja, Petambak hanya boleh hapus datanya sendiri
        if ($user->role !== 'admin' && $waterQuality->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki hak untuk menghapus data ini.'], 403);
        }

        $waterQuality->delete();

        return response()->json([
            'message' => 'Data kualitas air berhasil dihapus.'
        ]);
    }
}