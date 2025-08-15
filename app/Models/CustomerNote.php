<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'user_id',
        'type',
        'title',
        'content',
        'priority',
        'is_important',
        'follow_up_date',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
        'follow_up_date' => 'datetime',
        'is_important' => 'boolean',
    ];

    // Type constants
    const TYPE_GENERAL = 'general';
    const TYPE_CALL = 'call';
    const TYPE_MEETING = 'meeting';
    const TYPE_COMPLAINT = 'complaint';
    const TYPE_FOLLOW_UP = 'follow_up';
    const TYPE_PAYMENT = 'payment';
    const TYPE_SERVICE_UPDATE = 'service_update';
    const TYPE_STATUS_CHANGE = 'status_change';

    public static function getTypeOptions()
    {
        return [
            self::TYPE_GENERAL => 'عام',
            self::TYPE_CALL => 'مكالمة',
            self::TYPE_MEETING => 'اجتماع',
            self::TYPE_COMPLAINT => 'شكوى',
            self::TYPE_FOLLOW_UP => 'متابعة',
            self::TYPE_PAYMENT => 'دفع',
            self::TYPE_SERVICE_UPDATE => 'تحديث خدمة',
            self::TYPE_STATUS_CHANGE => 'تغيير حالة',
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

    public function getTypeLabelAttribute()
    {
        return self::getTypeOptions()[$this->type] ?? $this->type;
    }

    public function getPriorityLabelAttribute()
    {
        return self::getPriorityOptions()[$this->priority] ?? $this->priority;
    }

    public function getPriorityColorAttribute()
    {
        return match($this->priority) {
            'low' => 'gray',
            'medium' => 'blue',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray'
        };
    }

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeNeedFollowUp($query)
    {
        return $query->whereNotNull('follow_up_date')
                    ->where('follow_up_date', '<=', now());
    }
}
