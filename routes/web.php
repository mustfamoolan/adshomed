<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectBudgetController;
use App\Http\Controllers\Admin\ProjectExpenseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Employee Routes
        Route::resource('employees', EmployeeController::class);

        // Department Routes
        Route::resource('departments', DepartmentController::class);

        // Project Routes
        Route::resource('projects', ProjectController::class);
        Route::patch('projects/{project}/quick-sale', [ProjectController::class, 'quickSale'])->name('projects.quick-sale');
        Route::patch('projects/{project}/quick-subscriber', [ProjectController::class, 'quickSubscriber'])->name('projects.quick-subscriber');
        Route::post('projects/{project}/platform-stats', [ProjectController::class, 'addPlatformStats'])->name('projects.platform-stats');

        // Project Budget Routes
        Route::post('projects/{project}/budgets', [ProjectBudgetController::class, 'store'])->name('projects.budgets.store');
        Route::delete('projects/{project}/budgets/{budget}', [ProjectBudgetController::class, 'destroy'])->name('projects.budgets.destroy');

        // Project Expense Routes
        Route::post('projects/{project}/expenses', [ProjectExpenseController::class, 'store'])->name('projects.expenses.store');
        Route::delete('projects/{project}/expenses/{expense}', [ProjectExpenseController::class, 'destroy'])->name('projects.expenses.destroy');
    });
});

require __DIR__.'/auth.php';
