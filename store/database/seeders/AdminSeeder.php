<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin accounts
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin1@store.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Admin Manager',
            'email' => 'admin2@store.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Assistant Admin',
            'email' => 'admin3@store.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => false,
        ]);
    }
}
