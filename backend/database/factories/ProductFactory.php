<?php

namespace Database\Factories;
use App\Models\Category;


use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // public function definition(): array
    // {
    //     return [
    //         //
    //     ];
    // }

    public function definition()
{
    return [
        'name' => $this->faker->word,
        'slug' => $this->faker->unique()->slug,
        'description' => $this->faker->sentence,
        'price' => $this->faker->randomFloat(2, 10, 500),
        'stock' => $this->faker->numberBetween(1, 50),
        'category_id' => Category::factory(),
        // لإضافة صورة افتراضية
        'image' => $this->faker->image('storage/app/public/products', 400, 300, null, false),
    ];
}

}
