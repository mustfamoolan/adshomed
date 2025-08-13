<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketingTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marketingTypes = [
            // منصات التسويق
            ['key' => 'instagram', 'name_ar' => 'إنستغرام', 'name_en' => 'Instagram', 'category' => 'platforms', 'sort_order' => 1],
            ['key' => 'facebook', 'name_ar' => 'فيسبوك', 'name_en' => 'Facebook', 'category' => 'platforms', 'sort_order' => 2],
            ['key' => 'whatsapp', 'name_ar' => 'واتساب', 'name_en' => 'WhatsApp', 'category' => 'platforms', 'sort_order' => 3],
            ['key' => 'tiktok', 'name_ar' => 'تيك توك', 'name_en' => 'TikTok', 'category' => 'platforms', 'sort_order' => 4],
            ['key' => 'youtube', 'name_ar' => 'يوتيوب', 'name_en' => 'YouTube', 'category' => 'platforms', 'sort_order' => 5],
            ['key' => 'telegram', 'name_ar' => 'تيليجرام', 'name_en' => 'Telegram', 'category' => 'platforms', 'sort_order' => 6],
            ['key' => 'snapchat', 'name_ar' => 'سناب شات', 'name_en' => 'Snapchat', 'category' => 'platforms', 'sort_order' => 7],
            ['key' => 'twitter', 'name_ar' => 'تويتر (X)', 'name_en' => 'Twitter (X)', 'category' => 'platforms', 'sort_order' => 8],
            ['key' => 'linkedin', 'name_ar' => 'لينكد إن', 'name_en' => 'LinkedIn', 'category' => 'platforms', 'sort_order' => 9],
            ['key' => 'google_ads', 'name_ar' => 'إعلانات جوجل', 'name_en' => 'Google Ads', 'category' => 'platforms', 'sort_order' => 10],

            // أنواع التسويق الأخرى
            ['key' => 'representatives', 'name_ar' => 'مندوبين', 'name_en' => 'Sales Representatives', 'category' => 'other', 'sort_order' => 11],
            ['key' => 'field_marketing', 'name_ar' => 'ميداني', 'name_en' => 'Field Marketing', 'category' => 'other', 'sort_order' => 12],
            ['key' => 'celebrities', 'name_ar' => 'مشاهير', 'name_en' => 'Celebrity Endorsement', 'category' => 'other', 'sort_order' => 13],
            ['key' => 'posts', 'name_ar' => 'بوستات', 'name_en' => 'Social Media Posts', 'category' => 'other', 'sort_order' => 14],
            ['key' => 'festivals', 'name_ar' => 'مهرجانات', 'name_en' => 'Festivals & Events', 'category' => 'other', 'sort_order' => 15],
        ];

        foreach ($marketingTypes as $type) {
            DB::table('marketing_types')->updateOrInsert(
                ['key' => $type['key']],
                array_merge($type, [
                    'created_at' => now(),
                    'updated_at' => now()
                ])
            );
        }
    }
}
