<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'project_id',
        'status',
        'customer_type',
        'activation_code',
        'download_id',
        'subscription_type',
        'activation_code_expires_at',
        'is_active',
        'metadata',
        'initial_notes',
        'client_project_id',
        'last_contact_at',
        'source',
        'total_spent',
        'orders_count',
        'subscribed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'activation_code_expires_at' => 'datetime',
        'last_contact_at' => 'datetime',
        'subscribed_at' => 'datetime',
        'total_spent' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Status constants
    const STATUS_POTENTIAL_BUYER = 'potential_buyer';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_BAD = 'bad';
    const STATUS_SERVICE_REQUEST = 'service_request';
    const STATUS_SERVICE_COMPLETED = 'service_completed';
    const STATUS_SUBSCRIBER = 'subscriber';

    // Customer Type constants
    const TYPE_SERVICE_REQUEST = 'service_request';
    const TYPE_OUR_PROJECT_CLIENT = 'our_project_client';
    const TYPE_CLIENT_PROJECT_OWNER = 'client_project_owner';

    // Project Type constants for our projects
    const PROJECT_TYPE_SALE = 'sale';
    const PROJECT_TYPE_SUBSCRIPTION = 'subscription';
    const PROJECT_TYPE_DOWNLOAD = 'download';

    public static function getCustomerTypeOptions()
    {
        return [
            self::TYPE_SERVICE_REQUEST => 'عميل يطلب خدمة',
            self::TYPE_OUR_PROJECT_CLIENT => 'عميل في مشروع من مشاريعنا',
            self::TYPE_CLIENT_PROJECT_OWNER => 'صاحب مشروع من مشاريع العميل',
        ];
    }

    public static function getProjectTypeOptions()
    {
        return [
            self::PROJECT_TYPE_SALE => 'بيع',
            self::PROJECT_TYPE_SUBSCRIPTION => 'اشتراك',
            self::PROJECT_TYPE_DOWNLOAD => 'تحميل',
        ];
    }

    public static function getStatusOptions()
    {
        return [
            self::STATUS_POTENTIAL_BUYER => 'مشتري محتمل',
            self::STATUS_CANCELLED => 'ملغي',
            self::STATUS_BAD => 'سيء',
            self::STATUS_SERVICE_REQUEST => 'عميل يطلب خدمة',
            self::STATUS_SERVICE_COMPLETED => 'مكتمل الخدمة',
            self::STATUS_SUBSCRIBER => 'مشترك',
        ];
    }

    public function getStatusLabelAttribute()
    {
        return self::getStatusOptions()[$this->status] ?? $this->status;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            self::STATUS_POTENTIAL_BUYER => 'yellow',
            self::STATUS_CANCELLED => 'red',
            self::STATUS_BAD => 'red',
            self::STATUS_SERVICE_REQUEST => 'blue',
            self::STATUS_SERVICE_COMPLETED => 'green',
            self::STATUS_SUBSCRIBER => 'green',
            default => 'gray'
        };
    }

    // Generate activation code
    public function generateActivationCode()
    {
        $this->activation_code = strtoupper(Str::random(8));
        $this->activation_code_expires_at = now()->addDays(30);
        $this->save();

        return $this->activation_code;
    }

    // Check if activation code is valid
    public function isActivationCodeValid()
    {
        return $this->activation_code &&
               $this->activation_code_expires_at &&
               $this->activation_code_expires_at->isFuture();
    }

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function clientProject(): BelongsTo
    {
        return $this->belongsTo(ClientProject::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CustomerNote::class)->orderBy('created_at', 'desc');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(CustomerActivity::class)->orderBy('created_at', 'desc');
    }

    public function requests(): HasMany
    {
        return $this->hasMany(CustomerRequest::class)->orderBy('created_at', 'desc');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ProjectSubscription::class)->orderBy('created_at', 'desc');
    }

    public function activeSubscriptions(): HasMany
    {
        return $this->hasMany(ProjectSubscription::class)
                    ->where('status', ProjectSubscription::STATUS_ACTIVE)
                    ->where(function($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', now());
                    });
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeSubscribers($query)
    {
        return $query->where('status', self::STATUS_SUBSCRIBER);
    }

    public function scopeServiceRequests($query)
    {
        return $query->where('status', self::STATUS_SERVICE_REQUEST);
    }
}
