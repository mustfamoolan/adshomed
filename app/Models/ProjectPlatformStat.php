<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPlatformStat extends Model
{
    protected $fillable = [
        'project_id',
        'platform',
        'downloads_count',
        'revenue'
    ];

    protected $casts = [
        'downloads_count' => 'integer',
        'revenue' => 'decimal:2'
    ];

    /**
     * Get the project that owns this platform stat
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
