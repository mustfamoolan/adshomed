<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'client_name',
        'client_phone',
        'client_email',
        'project_value',
        'paid_amount',
        'remaining_amount',
        'status',
        'payment_status',
        'start_date',
        'end_date',
        'delivery_date',
        'manager_id',
        'notes',
        'requirements'
    ];

    protected $casts = [
        'project_value' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'delivery_date' => 'date',
        'requirements' => 'array',
    ];

    /**
     * Get the manager of the project.
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get the development costs for this project.
     */
    public function developmentCosts(): HasMany
    {
        return $this->hasMany(ClientProjectDevelopmentCost::class);
    }

    /**
     * Calculate remaining amount automatically
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->remaining_amount = $model->project_value - $model->paid_amount;
        });
    }

    /**
     * Get status in Arabic
     */
    public function getStatusInArabic(): string
    {
        return match($this->status) {
            'pending' => 'قيد الانتظار',
            'in_progress' => 'قيد التنفيذ',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            default => 'غير محدد'
        };
    }

    /**
     * Get payment status in Arabic
     */
    public function getPaymentStatusInArabic(): string
    {
        return match($this->payment_status) {
            'unpaid' => 'غير مدفوع',
            'partial' => 'مدفوع جزئياً',
            'paid' => 'مدفوع بالكامل',
            default => 'غير محدد'
        };
    }

    /**
     * Get progress percentage
     */
    public function getProgressPercentage(): int
    {
        if ($this->project_value == 0) return 0;
        return round(($this->paid_amount / $this->project_value) * 100);
    }

    /**
     * Get total development costs
     */
    public function getTotalDevelopmentCosts(): float
    {
        return $this->developmentCosts()->sum('amount');
    }

    /**
     * Get net profit (paid amount - development costs)
     */
    public function getNetProfit(): float
    {
        return $this->paid_amount - $this->getTotalDevelopmentCosts();
    }

    /**
     * Get expected profit (project value - development costs)
     */
    public function getExpectedProfit(): float
    {
        return $this->project_value - $this->getTotalDevelopmentCosts();
    }
}
