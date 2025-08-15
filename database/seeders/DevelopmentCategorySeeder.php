<?php

namespace Database\Seeders;

use App\Models\DevelopmentCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DevelopmentCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'تطوير الواجهة الأمامية (UI)',
                'name_en' => 'Frontend Development (UI)',
                'description' => 'تكاليف تطوير واجهة المستخدم والتصميم',
                'icon' => 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5z',
                'color' => '#3B82F6',
                'sort_order' => 1,
            ],
            [
                'name' => 'تطوير الخلفية (Backend)',
                'name_en' => 'Backend Development',
                'description' => 'تكاليف تطوير الخادم وقواعد البيانات',
                'icon' => 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2',
                'color' => '#10B981',
                'sort_order' => 2,
            ],
            [
                'name' => 'تطوير تطبيقات الموبايل',
                'name_en' => 'Mobile Development',
                'description' => 'تكاليف تطوير تطبيقات الهاتف المحمول',
                'icon' => 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
                'color' => '#8B5CF6',
                'sort_order' => 3,
            ],
            [
                'name' => 'الاستضافة والخوادم',
                'name_en' => 'Hosting & Servers',
                'description' => 'تكاليف الاستضافة والخوادم والنطاقات',
                'icon' => 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
                'color' => '#F59E0B',
                'sort_order' => 4,
            ],
            [
                'name' => 'تصميم الجرافيك والشعارات',
                'name_en' => 'Graphic Design',
                'description' => 'تكاليف التصميم الجرافيكي والشعارات',
                'icon' => 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
                'color' => '#EF4444',
                'sort_order' => 5,
            ],
            [
                'name' => 'اختبار وضمان الجودة',
                'name_en' => 'Testing & QA',
                'description' => 'تكاليف اختبار التطبيق وضمان الجودة',
                'icon' => 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                'color' => '#06B6D4',
                'sort_order' => 6,
            ],
            [
                'name' => 'إدارة المشروع',
                'name_en' => 'Project Management',
                'description' => 'تكاليف إدارة وتنسيق المشروع',
                'icon' => 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v6a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2m-2 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2',
                'color' => '#84CC16',
                'sort_order' => 7,
            ],
            [
                'name' => 'التسويق والإعلان',
                'name_en' => 'Marketing & Advertising',
                'description' => 'تكاليف التسويق والحملات الإعلانية',
                'icon' => 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
                'color' => '#F97316',
                'sort_order' => 8,
            ],
            [
                'name' => 'التراخيص والبرمجيات',
                'name_en' => 'Licenses & Software',
                'description' => 'تكاليف التراخيص والبرمجيات المستخدمة',
                'icon' => 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                'color' => '#6366F1',
                'sort_order' => 9,
            ],
            [
                'name' => 'أخرى',
                'name_en' => 'Other',
                'description' => 'تكاليف أخرى متنوعة',
                'icon' => 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z',
                'color' => '#6B7280',
                'sort_order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            DevelopmentCategory::create($category);
        }
    }
}
