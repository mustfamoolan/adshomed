<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientProjectDevelopmentCost extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_project_id',
        'development_category_id',
        'amount',
        'description',
        'expense_date',
        'receipt_number',
        'additional_data',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'additional_data' => 'array',
    ];

    /**
     * Get the client project that owns this development cost.
     */
    public function clientProject(): BelongsTo
    {
        return $this->belongsTo(ClientProject::class);
    }

    /**
     * Get the development category that this cost belongs to.
     */
    public function developmentCategory(): BelongsTo
    {
        return $this->belongsTo(DevelopmentCategory::class);
    }
}
