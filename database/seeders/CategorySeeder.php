<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['category_name' => 'Software'],
            ['category_name' => 'Hardware'],
            ['category_name' => 'Network'],
            ['category_name' => 'Security'],
            ['category_name' => 'Other'],
        ];

        foreach ($categories as $category) {
            Category::query()->firstOrCreate($category);
        }
    }
}
