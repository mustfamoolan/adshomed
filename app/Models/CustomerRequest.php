<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'project_id',
        'client_project_id',
        'type',
        'status',
        'title',
        'description',
        'priority',
        'estimated_cost',
        'final_cost',
        'requested_delivery_date',
        'actual_delivery_date',
        'assigned_to',
        'requirements',
        'deliverables',
        'admin_notes',
        'customer_feedback',
        'rating',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
        'final_cost' => 'decimal:2',
        'requested_delivery_date' => 'datetime',
        'actual_delivery_date' => 'datetime',
        'requirements' => 'array',
        'deliverables' => 'array',
        'rating' => 'integer',
    ];

    // Type constants
    const TYPE_SUBSCRIPTION = 'subscription';
    const TYPE_SERVICE = 'service';
    const TYPE_CONSULTATION = 'consultation';
    const TYPE_SUPPORT = 'support';
    const TYPE_CUSTOMIZATION = 'customization';
    const TYPE_MAINTENANCE = 'maintenance';
    const TYPE_UPGRADE = 'upgrade';
    const TYPE_REFUND = 'refund';

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_ON_HOLD = 'on_hold';
    const STATUS_REJECTED = 'rejected';

    public static function getTypeOptions()
    {
        return [
            self::TYPE_SUBSCRIPTION => 'طلب اشتراك',
            self::TYPE_SERVICE => 'طلب خدمة',
            self::TYPE_CONSULTATION => 'استشارة',
            self::TYPE_SUPPORT => 'دعم فني',
            self::TYPE_CUSTOMIZATION => 'تخصيص',
            self::TYPE_MAINTENANCE => 'صيانة',
            self::TYPE_UPGRADE => 'ترقية',
            self::TYPE_REFUND => 'استرداد',
        ];
    }

    public static function getStatusOptions()
    {
        return [
            self::STATUS_PENDING => 'قيد الانتظار',
            self::STATUS_IN_PROGRESS => 'قيد التنفيذ',
            self::STATUS_COMPLETED => 'مكتمل',
            self::STATUS_CANCELLED => 'ملغي',
            self::STATUS_ON_HOLD => 'معلق',
            self::STATUS_REJECTED => 'مرفوض',
        ];
    }

    public static function getPriorityOptions()
    {
        return [
            'low' => 'منخفضة',
            'medium' => 'متوسطة',
            'high' => 'عالية',
            'urgent' => 'عاجلة',
        ];
    }

    // Getters
    public function getTypeLabelAttribute()
    {
        return self::getTypeOptions()[$this->type] ?? $this->type;
    }

    public function getStatusLabelAttribute()
    {
        return self::getStatusOptions()[$this->status] ?? $this->status;
    }

    public function getPriorityLabelAttribute()
    {
        return self::getPriorityOptions()[$this->priority] ?? $this->priority;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            self::STATUS_PENDING => 'yellow',
            self::STATUS_IN_PROGRESS => 'blue',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_CANCELLED => 'red',
            self::STATUS_ON_HOLD => 'orange',
            self::STATUS_REJECTED => 'red',
            default => 'gray'
        };
    }

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function clientProject(): BelongsTo
    {
        return $this->belongsTo(ClientProject::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotNull('requested_delivery_date')
                    ->where('requested_delivery_date', '<', now())
                    ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }
}
