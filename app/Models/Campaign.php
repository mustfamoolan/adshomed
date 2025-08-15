<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'budget',
        'actual_cost',
        'marketing_type_key',
        'status',
        'metrics',
        'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'metrics' => 'array'
    ];

    protected $attributes = [
        'status' => 'draft',
        'actual_cost' => 0,
        'description' => '',
        'notes' => ''
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($campaign) {
            if (empty($campaign->name)) {
                $campaign->name = 'حملة ' . now()->format('Y-m-d H:i');
            }
        });
    }

    /**
     * العلاقة مع المشروع
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * الحصول على نوع التسويق
     */
    public function marketingType(): BelongsTo
    {
        return $this->belongsTo(MarketingType::class, 'marketing_type_key', 'key');
    }

    /**
     * العلاقة مع البيانات اليومية
     */
    public function dailyMetrics()
    {
        return $this->hasMany(CampaignDailyMetric::class);
    }

    /**
     * حساب مدة الحملة بالأيام
     */
    public function getDurationAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /**
     * حساب الميزانية المتبقية
     */
    public function getRemainingBudgetAttribute(): float
    {
        return $this->budget - $this->actual_cost;
    }

    /**
     * حساب نسبة الإنفاق
     */
    public function getSpendPercentageAttribute(): float
    {
        if ($this->budget == 0) return 0;
        return ($this->actual_cost / $this->budget) * 100;
    }

    /**
     * التحقق من انتهاء الحملة
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date->isPast();
    }

    /**
     * التحقق من كون الحملة نشطة
     */
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' &&
               $this->start_date->isPast() &&
               !$this->is_expired;
    }

    /**
     * الحصول على حالة الحملة مع النص
     */
    public function getStatusTextAttribute(): string
    {
        return match($this->status) {
            'draft' => 'مسودة',
            'active' => 'نشطة',
            'paused' => 'متوقفة',
            'completed' => 'مكتملة',
            'cancelled' => 'ملغية',
            default => 'غير محدد'
        };
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeRunning($query)
    {
        return $query->where('status', 'active')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }
}

