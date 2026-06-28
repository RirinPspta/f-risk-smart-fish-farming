<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WaterQualityController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth endpoints
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard endpoint
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Water Quality CRUD (accessible by both Admin and Petambak, index/show filter internally by role)
    Route::apiResource('/water-qualities', WaterQualityController::class);

    // Admin-only User Management CRUD
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/users', UserController::class);
    });
});
