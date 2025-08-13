<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'التسويق الرقمي',
                'description' => 'قسم إدارة الحملات الإعلانية والتسويق الرقمي',
                'is_active' => true,
            ],
            [
                'name' => 'المبيعات',
                'description' => 'قسم المبيعات وإدارة علاقات العملاء',
                'is_active' => true,
            ],
            [
                'name' => 'التصميم الجرافيكي',
                'description' => 'قسم التصميم والمحتوى البصري',
                'is_active' => true,
            ],
            [
                'name' => 'إدارة المشاريع',
                'description' => 'قسم إدارة المشاريع والمتابعة',
                'is_active' => true,
            ],
            [
                'name' => 'تطوير المواقع',
                'description' => 'قسم تطوير وتصميم المواقع الإلكترونية',
                'is_active' => true,
            ],
            [
                'name' => 'المحاسبة',
                'description' => 'قسم المحاسبة والشؤون المالية',
                'is_active' => true,
            ]
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
