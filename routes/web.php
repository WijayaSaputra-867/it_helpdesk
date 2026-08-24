<?php

use App\Http\Controllers\Admin\AdminTicketController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketReplyController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (! User::exists()) {
        return redirect()->route('register');
    }

    return Inertia::render('welcome');
})->name('home');

Route::prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/create', [TicketController::class, 'create'])->name('create');
    Route::post('/', [TicketController::class, 'store'])->name('store');
    Route::get('/track', [TicketController::class, 'track'])->name('track');
    Route::get('/track/{code}', [TicketController::class, 'show'])->name('track.show');
    Route::post('/track/{code}/reply', [TicketReplyController::class, 'store'])->name('reply.store');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
        Route::get('/tickets/{ticket}', [AdminTicketController::class, 'show'])->name('tickets.show');
        Route::patch('/tickets/{ticket}/status', [AdminTicketController::class, 'updateStatus'])->name('tickets.updateStatus');
        Route::patch('/tickets/{ticket}/priority', [AdminTicketController::class, 'updatePriority'])->name('tickets.updatePriority');
        Route::post('/tickets/{ticket}/analyze', [AdminTicketController::class, 'analyze'])->name('tickets.analyze');
        Route::post('/tickets/{ticket}/ai-reply', [AdminTicketController::class, 'storeAiReply'])->name('tickets.aiReply');
    });
});

require __DIR__.'/settings.php';
