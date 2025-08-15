<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MarketingType;

class MarketingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marketingTypes = [
            // Social Media Platforms
            [
                'key' => 'facebook',
                'name_ar' => 'فيسبوك',
                'name_en' => 'Facebook',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'key' => 'instagram',
                'name_ar' => 'إنستغرام',
                'name_en' => 'Instagram',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'key' => 'youtube',
                'name_ar' => 'يوتيوب',
                'name_en' => 'YouTube',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 3
            ],
            [
                'key' => 'tiktok',
                'name_ar' => 'تيك توك',
                'name_en' => 'TikTok',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 4
            ],
            [
                'key' => 'snapchat',
                'name_ar' => 'سناب شات',
                'name_en' => 'Snapchat',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 5
            ],
            [
                'key' => 'twitter',
                'name_ar' => 'تويتر',
                'name_en' => 'Twitter',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 6
            ],
            [
                'key' => 'linkedin',
                'name_ar' => 'لينكد إن',
                'name_en' => 'LinkedIn',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 7
            ],
            [
                'key' => 'telegram',
                'name_ar' => 'تيليغرام',
                'name_en' => 'Telegram',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 8
            ],

            // Search Engines
            [
                'key' => 'google_ads',
                'name_ar' => 'إعلانات جوجل',
                'name_en' => 'Google Ads',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 9
            ],
            [
                'key' => 'bing_ads',
                'name_ar' => 'إعلانات بينغ',
                'name_en' => 'Bing Ads',
                'category' => 'platforms',
                'is_active' => true,
                'sort_order' => 10
            ],

            // Other Marketing Types
            [
                'key' => 'email_marketing',
                'name_ar' => 'التسويق بالبريد الإلكتروني',
                'name_en' => 'Email Marketing',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 11
            ],
            [
                'key' => 'influencer_marketing',
                'name_ar' => 'التسويق بالمؤثرين',
                'name_en' => 'Influencer Marketing',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 12
            ],
            [
                'key' => 'content_marketing',
                'name_ar' => 'تسويق المحتوى',
                'name_en' => 'Content Marketing',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 13
            ],
            [
                'key' => 'sms_marketing',
                'name_ar' => 'التسويق بالرسائل النصية',
                'name_en' => 'SMS Marketing',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 14
            ],
            [
                'key' => 'print_media',
                'name_ar' => 'الإعلام المطبوع',
                'name_en' => 'Print Media',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 15
            ],
            [
                'key' => 'radio_ads',
                'name_ar' => 'إعلانات الراديو',
                'name_en' => 'Radio Ads',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 16
            ],
            [
                'key' => 'tv_ads',
                'name_ar' => 'إعلانات التلفزيون',
                'name_en' => 'TV Ads',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 17
            ],
            [
                'key' => 'outdoor_advertising',
                'name_ar' => 'الإعلانات الخارجية',
                'name_en' => 'Outdoor Advertising',
                'category' => 'other',
                'is_active' => true,
                'sort_order' => 18
            ]
        ];

        foreach ($marketingTypes as $type) {
            MarketingType::updateOrCreate(
                ['key' => $type['key']],
                $type
            );
        }
    }
}
