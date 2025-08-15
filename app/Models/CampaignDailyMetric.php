<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignDailyMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'date',
        'metrics'
    ];

    protected $casts = [
        'date' => 'date',
        'metrics' => 'array'
    ];

    /**
     * العلاقة مع الحملة
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * الحصول على إحصائية معينة
     */
    public function getMetric($key, $default = 0)
    {
        return $this->metrics[$key] ?? $default;
    }

    /**
     * تحديث إحصائية معينة
     */
    public function updateMetric($key, $value)
    {
        $metrics = $this->metrics ?? [];
        $metrics[$key] = $value;
        $this->update(['metrics' => $metrics]);
    }

    /**
     * Scopes
     */
    public function scopeForCampaign($query, $campaignId)
    {
        return $query->where('campaign_id', $campaignId);
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
