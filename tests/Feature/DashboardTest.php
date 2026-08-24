<?php

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('admin users can visit the dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->get(route('dashboard'))->assertOk();
});

test('client users are redirected to home from dashboard', function () {
    $this->actingAs(User::factory()->create(['role' => 'client']));

    $this->get(route('dashboard'))->assertRedirect(route('home'));
});

test('dashboard shows ticket statistics', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::factory()->create();

    Ticket::factory()->count(3)->create([
        'category_id' => $category->id,
        'status' => 'open',
    ]);
    Ticket::factory()->create([
        'category_id' => $category->id,
        'status' => 'closed',
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertSee('"total":4')
        ->assertSee('"open":3')
        ->assertSee('"closed":1');
});

test('client users cannot access the admin area', function () {
    $this->actingAs(User::factory()->create(['role' => 'client']));

    $this->get(route('admin.tickets.index'))->assertForbidden();
});
