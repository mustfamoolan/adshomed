<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectSubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'plan_name',
        'price',
        'billing_cycle',
        'subscribers_count',
        'description',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subscribers_count' => 'integer',
        'is_active' => 'boolean'
    ];

    /**
     * Get the project that owns the subscription plan.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the total revenue for this plan.
     */
    public function getTotalRevenueAttribute()
    {
        return $this->price * $this->subscribers_count;
    }

    /**
     * Get billing cycle label in Arabic.
     */
    public function getBillingCycleLabelAttribute()
    {
        return match($this->billing_cycle) {
            'monthly' => 'شهري',
            'yearly' => 'سنوي',
            'lifetime' => 'مدى الحياة',
            default => $this->billing_cycle
        };
    }
}


