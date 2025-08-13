<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPlatform extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'platform',
        'platform_url'
    ];

    /**
     * Get the project that owns the platform.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
