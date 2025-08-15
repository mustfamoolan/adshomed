<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'initial_budget',
        'total_revenue',
        'total_expenses',
        'sales_count',
        'downloads_count',
        'product_price',
        'type',
        'status',
        'manager_id',
        'development_start_date',
        'development_end_date',
        'publication_date',
        'publication_status'
    ];

    protected $casts = [
        'initial_budget' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'total_expenses' => 'decimal:2',
        'product_price' => 'decimal:2',
        'development_start_date' => 'date',
        'development_end_date' => 'date',
        'publication_date' => 'date',
    ];

    /**
     * Get the manager of the project.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get the budget records for the project.
     */
    public function budgets(): HasMany
    {
        return $this->hasMany(ProjectBudget::class);
    }

    /**
     * Get the expenses for the project.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(ProjectExpense::class);
    }

    /**
     * Get the campaigns for the project.
     */
    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    /**
     * Get the platforms for the project.
     */
    public function platforms(): HasMany
    {
        return $this->hasMany(ProjectPlatform::class);
    }

    /**
     * Get the subscription plans for the project.
     */
    public function subscriptionPlans(): HasMany
    {
        return $this->hasMany(ProjectSubscriptionPlan::class);
    }

    /**
     * Get the platform statistics for the project.
     */
    public function platformStats(): HasMany
    {
        return $this->hasMany(ProjectPlatformStat::class);
    }

    /**
     * Get the total budget (initial + additional).
     */
    public function getTotalBudgetAttribute()
    {
        return $this->initial_budget + $this->budgets()->sum('amount');
    }

    /**
     * Get the remaining budget.
     */
    public function getRemainingBudgetAttribute()
    {
        return $this->total_budget - $this->total_expenses;
    }

    /**
     * Get the profit.
     */
    public function getProfitAttribute()
    {
        return $this->getCalculatedRevenueAttribute() - $this->total_expenses;
    }

        /**
     * Get calculated revenue based on project type
     */
    public function getCalculatedRevenueAttribute()
    {
        switch ($this->type) {
            case 'sales':
                return ($this->product_price ?? 0) * ($this->sales_count ?? 0);

            case 'subscription':
                return $this->subscriptionPlans->sum(function ($plan) {
                    $multiplier = match($plan->billing_cycle) {
                        'yearly' => 12,
                        'lifetime' => 1,
                        default => 1 // monthly
                    };
                    return ($plan->price ?? 0) * ($plan->subscriber_count ?? 0) * $multiplier;
                });

            case 'downloads':
                return $this->total_revenue ?? 0;

            case 'free':
            default:
                return 0;
        }
    }

    /**
     * Get total subscribers for subscription projects
     */
    public function getTotalSubscribersAttribute()
    {
        if ($this->type !== 'subscription') {
            return 0;
        }

        return $this->subscriptionPlans->sum('subscriber_count');
    }

    /**
     * Get billing cycle multiplier for annual calculation.
     */
    private function getBillingMultiplier($cycle)
    {
        switch ($cycle) {
            case 'monthly':
                return 12; // Convert to yearly
            case 'yearly':
                return 1;
            case 'lifetime':
                return 1; // One-time payment
            default:
                return 1;
        }
    }

    /**
     * Get expenses by category.
     */
    public function getExpensesByCategory()
    {
        return $this->expenses()
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');
    }
}
