<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerActivity extends Model
{
    protected $fillable = [
        'customer_id',
        'user_id',
        'type',
        'title',
        'description',
        'meta_data',
    ];

    protected $casts = [
        'meta_data' => 'array',
    ];

    // أنواع النشاط
    const TYPE_SUBSCRIPTION_ADDED = 'subscription_added';
    const TYPE_SUBSCRIPTION_STATUS_CHANGED = 'subscription_status_changed';
    const TYPE_CUSTOMER_TYPE_CHANGED = 'customer_type_changed';
    const TYPE_STATUS_CHANGED = 'status_changed';

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getTypeOptions()
    {
        return [
            self::TYPE_SUBSCRIPTION_ADDED => 'إضافة اشتراك',
            self::TYPE_SUBSCRIPTION_STATUS_CHANGED => 'تغيير حالة اشتراك',
            self::TYPE_CUSTOMER_TYPE_CHANGED => 'تغيير نوع العميل',
            self::TYPE_STATUS_CHANGED => 'تغيير حالة العميل',
        ];
    }
}
