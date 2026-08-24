<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'admin',
    ]);
});

test('newly registered users can access the admin area', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->get(route('admin.tickets.index'))->assertOk();
});

test('registration page is inaccessible once a user exists', function () {
    User::factory()->create();

    $this->get(route('register'))->assertNotFound();
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();

    $this->assertDatabaseMissing('users', [
        'email' => 'test@example.com',
    ]);
});

test('guests are redirected from home to register during first-time setup', function () {
    $this->get(route('home'))->assertRedirect(route('register'));
});
