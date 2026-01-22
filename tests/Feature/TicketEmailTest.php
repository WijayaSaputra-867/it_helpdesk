<?php

use App\Mail\TicketCreated;
use App\Models\Category;
use App\Services\AIService;
use Illuminate\Support\Facades\Mail;

test('email is sent when ticket is created', function () {
    Mail::fake();

    // Mock AIService
    $mockAiService = Mockery::mock(AIService::class);
    $mockAiService->shouldReceive('analyzeTicket')->once();
    $this->app->instance(AIService::class, $mockAiService);

    $category = Category::create(['category_name' => 'General']);

    $response = $this->post(route('tickets.store'), [
        'client_name' => 'John Doe',
        'client_email' => 'john@example.com',
        'category_id' => $category->id,
        'title' => 'My Computer is broken',
        'description' => 'I cannot turn it on.',
    ]);

    $response->assertRedirect();
    
    Mail::assertSent(TicketCreated::class, function ($mail) {
        return $mail->hasTo('john@example.com') &&
               $mail->ticket->client_name === 'John Doe';
    });
});
