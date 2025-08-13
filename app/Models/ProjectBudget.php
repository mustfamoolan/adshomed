<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBudget extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'amount',
        'type',
        'notes',
        'description', // إضافة description للـ fillable
        'added_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get the project that owns the budget.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user who added the budget.
     */
    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }
}
