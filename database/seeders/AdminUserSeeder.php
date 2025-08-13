<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء مدير النظام - مصطفى سعدي
        User::create([
            'name' => 'مصطفى سعدي',
            'phone' => '07742209251',
            'email' => 'sibarhomed@gmail.com',
            'password' => Hash::make('12345678'),
            'type' => 'admin',
            'is_active' => true,
        ]);

        // إنشاء الموظف - محمد الباقر
        User::create([
            'name' => 'محمد الباقر',
            'phone' => '07735576087',
            'email' => 'mohammad.jackie80@gmail.com',
            'password' => Hash::make('12345678'),
            'type' => 'employee',
            'is_active' => true,
        ]);
    }
}
