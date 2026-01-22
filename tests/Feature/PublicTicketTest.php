<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicTicketTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Category::create(['category_name' => 'Software']);
        Category::create(['category_name' => 'Hardware']);
    }

    public function test_can_view_ticket_creation_page(): void
    {
        $response = $this->get(route('tickets.create'));

        $response->assertStatus(200);
    }

    public function test_can_submit_ticket_without_attachment(): void
    {
        $category = Category::first();

        $response = $this->post(route('tickets.store'), [
            'client_name' => 'John Doe',
            'client_email' => 'john@example.com',
            'category_id' => $category->id,
            'title' => 'Test Ticket',
            'description' => 'This is a test description.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'client_name' => 'John Doe',
            'title' => 'Test Ticket',
        ]);
    }

    public function test_can_submit_ticket_with_attachment(): void
    {
        Storage::fake('public');
        $category = Category::first();
        $file = UploadedFile::fake()->image('issue.jpg');

        $response = $this->post(route('tickets.store'), [
            'client_name' => 'John Doe',
            'client_email' => 'john@example.com',
            'category_id' => $category->id,
            'title' => 'Ticket with file',
            'description' => 'Description with file',
            'attachment' => $file,
        ]);

        $response->assertRedirect();
        
        $ticket = Ticket::where('title', 'Ticket with file')->first();
        $this->assertNotNull($ticket->attachment);
        Storage::disk('public')->assertExists($ticket->attachment);
    }

    public function test_can_view_track_page(): void
    {
        $response = $this->get(route('tickets.track'));

        $response->assertStatus(200);
    }

    public function test_can_track_existing_ticket(): void
    {
        $ticket = Ticket::factory()->create([
            'ticket_code' => 'ABC123XYZ4',
            'category_id' => Category::first()->id,
        ]);

        $response = $this->get(route('tickets.track.show', $ticket->ticket_code));

        $response->assertStatus(200);
        $response->assertSee($ticket->ticket_code);
    }

    public function test_tracking_non_existent_ticket_returns_404(): void
    {
        $response = $this->get(route('tickets.track.show', 'NONEXISTENT'));

        $response->assertStatus(404);
    }

    public function test_client_can_reply_to_ticket(): void
    {
        $ticket = Ticket::factory()->create([
            'category_id' => Category::first()->id,
        ]);

        $response = $this->post(route('tickets.reply.store', $ticket->ticket_code), [
            'message' => 'This is a client reply',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $ticket->id,
            'message' => 'This is a client reply',
            'sender_type' => 'client',
        ]);
    }
}
