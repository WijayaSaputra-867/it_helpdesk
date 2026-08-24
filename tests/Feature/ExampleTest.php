<?php

use App\Models\User;

it('redirects to the register page during first-time setup', function () {
    $this->get('/')->assertRedirect(route('register'));
});

it('returns a successful response when the app is set up', function () {
    User::factory()->create();

    $this->get('/')->assertOk();
});
