<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'project_subscription_plan_id',
        'activation_code',
        'status',
        'started_at',
        'expires_at',
        'notes'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_EXPIRED = 'expired';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_PENDING = 'pending';

    public static function getStatusOptions()
    {
        return [
            self::STATUS_PENDING => 'في الانتظار',
            self::STATUS_ACTIVE => 'نشط',
            self::STATUS_EXPIRED => 'منتهي الصلاحية',
            self::STATUS_CANCELLED => 'ملغي',
        ];
    }

    /**
     * Get the customer that owns the subscription
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the subscription plan
     */
    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(ProjectSubscriptionPlan::class, 'project_subscription_plan_id');
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE &&
               ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /**
     * Check if subscription is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}
