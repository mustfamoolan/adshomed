<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketingType extends Model
{
    protected $fillable = [
        'key',
        'name_ar',
        'name_en',
        'category',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * الحصول على أنواع التسويق حسب الفئة
     */
    public static function getByCategory($category)
    {
        return self::where('category', $category)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * الحصول على منصات التسويق
     */
    public static function getPlatforms()
    {
        return self::getByCategory('platforms');
    }

    /**
     * الحصول على أنواع التسويق الأخرى
     */
    public static function getOtherTypes()
    {
        return self::getByCategory('other');
    }
}
