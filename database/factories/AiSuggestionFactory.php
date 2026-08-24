<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AiSuggestion>
 */
class AiSuggestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'ai_summary' => $this->faker->sentence,
            'ai_suggested_category' => $this->faker->randomElement(['Software', 'Hardware', 'Network', 'Security', 'Other']),
            'ai_suggested_priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'ai_suggested_response' => $this->faker->paragraph,
            'created_at' => now(),
        ];
    }
}
