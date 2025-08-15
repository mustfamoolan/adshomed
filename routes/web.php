<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectBudgetController;
use App\Http\Controllers\Admin\ProjectExpenseController;
use App\Http\Controllers\Admin\ClientProjectController;
use App\Http\Controllers\Admin\ClientProjectDevelopmentCostController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CustomerController;
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

        // Client Projects Routes
        Route::resource('client-projects', ClientProjectController::class);

        // Client Project Development Costs Routes
        Route::post('client-projects/{client_project}/development-costs', [ClientProjectDevelopmentCostController::class, 'store'])->name('client-projects.development-costs.store');
        Route::delete('client-projects/{client_project}/development-costs/{development_cost}', [ClientProjectDevelopmentCostController::class, 'destroy'])->name('client-projects.development-costs.destroy');

        // Customer Routes
        Route::resource('customers', CustomerController::class);
        Route::post('customers/{customer}/notes', [CustomerController::class, 'storeNote'])->name('customers.notes.store');
        Route::post('customers/{customer}/requests', [CustomerController::class, 'storeRequest'])->name('customers.requests.store');
        Route::post('customers/{customer}/generate-activation', [CustomerController::class, 'generateActivationCode'])->name('customers.generate-activation');
        Route::patch('customers/{customer}/download-id', [CustomerController::class, 'updateDownloadId'])->name('customers.update-download-id');
        Route::post('customers/{customer}/subscriptions', [CustomerController::class, 'addSubscription'])->name('customers.subscriptions.store');
        Route::patch('customers/{customer}/subscriptions/{subscription}/status', [CustomerController::class, 'updateSubscriptionStatus'])->name('customers.subscriptions.update-status');

        // Campaign Routes
        Route::get('campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
        Route::post('campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
        Route::get('campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
        Route::get('campaigns/{campaign}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
        Route::put('campaigns/{campaign}', [CampaignController::class, 'update'])->name('campaigns.update');
        Route::delete('campaigns/{campaign}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');

        // Campaign details and metrics
        Route::get('campaigns/{campaign}/details', [CampaignController::class, 'details'])->name('campaigns.details');
        Route::put('campaigns/{campaign}/metrics', [CampaignController::class, 'updateMetrics'])->name('campaigns.update-metrics');

        // Daily metrics routes
        Route::post('campaigns/{campaign}/daily-metrics', [CampaignController::class, 'storeDailyMetrics'])->name('campaigns.store-daily-metrics');
        Route::post('campaigns/{campaign}/generate-daily-metrics', [CampaignController::class, 'generateDailyMetrics'])->name('campaigns.generate-daily-metrics');

        // Custom routes for project campaigns
        Route::get('campaigns/project/{project}', [CampaignController::class, 'show'])->name('campaigns.show');
        Route::get('projects/{project}/campaigns', [CampaignController::class, 'projectCampaigns'])->name('campaigns.project');
    });
});

require __DIR__.'/auth.php';
