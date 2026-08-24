<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketReply>
 */
class TicketReplyFactory extends Factory
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
            'user_id' => null,
            'sender_type' => 'client',
            'message' => $this->faker->paragraph,
            'created_at' => now(),
        ];
    }

    /**
     * Indicate that the reply was sent by an admin.
     */
    public function fromAdmin(?User $user = null): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user?->id ?? User::query()->where('role', 'admin')->first()?->id ?? User::factory(),
            'sender_type' => 'admin',
        ]);
    }

    /**
     * Indicate that the reply was sent by the client.
     */
    public function fromClient(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'sender_type' => 'client',
        ]);
    }
}
