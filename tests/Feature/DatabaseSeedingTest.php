<?php

use App\Models\AiSuggestion;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;

it('seeds the database with dummy data', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Category::count())->toBe(5)
        ->and(User::query()->where('role', 'admin')->count())->toBe(1)
        ->and(Ticket::count())->toBeGreaterThan(0)
        ->and(Ticket::where('status', 'open')->count())->toBeGreaterThan(0)
        ->and(Ticket::where('status', 'in_progress')->count())->toBeGreaterThan(0)
        ->and(Ticket::where('status', 'closed')->count())->toBeGreaterThan(0)
        ->and(AiSuggestion::count())->toBeGreaterThan(0)
        ->and(TicketReply::where('sender_type', 'admin')->count())->toBeGreaterThan(0)
        ->and(TicketReply::where('sender_type', 'client')->count())->toBeGreaterThan(0);
});

it('does not duplicate users and categories when seeded multiple times', function () {
    $this->seed(DatabaseSeeder::class);
    $ticketsAfterFirstRun = Ticket::count();

    $this->seed(DatabaseSeeder::class);

    expect(Category::count())->toBe(5)
        ->and(User::query()->where('role', 'admin')->count())->toBe(1)
        ->and(Ticket::count())->toBeGreaterThan($ticketsAfterFirstRun);
});
