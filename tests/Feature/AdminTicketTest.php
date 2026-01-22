<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTicketTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        Category::factory()->create(['category_name' => 'Software']);
    }

    public function test_admin_can_view_ticket_index(): void
    {
        Ticket::factory()->count(3)->create(['category_id' => Category::first()->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.tickets.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_view_ticket_detail(): void
    {
        $ticket = Ticket::factory()->create(['category_id' => Category::first()->id]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.tickets.show', $ticket->id));

        $response->assertStatus(200);
        $response->assertSee($ticket->ticket_code);
    }

    public function test_admin_can_update_ticket_status(): void
    {
        $ticket = Ticket::factory()->create(['category_id' => Category::first()->id, 'status' => 'open']);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.tickets.updateStatus', $ticket->id), [
                'status' => 'in_progress',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_admin_can_update_ticket_priority(): void
    {
        $ticket = Ticket::factory()->create(['category_id' => Category::first()->id, 'priority' => 'medium']);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.tickets.updatePriority', $ticket->id), [
                'priority' => 'high',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'priority' => 'high',
        ]);
    }

    public function test_admin_can_reply_to_ticket(): void
    {
        $ticket = Ticket::factory()->create(['category_id' => Category::first()->id]);

        $response = $this->actingAs($this->admin)
            ->post(route('tickets.reply.store', $ticket->ticket_code), [
                'message' => 'This is an admin reply',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $ticket->id,
            'user_id' => $this->admin->id,
            'message' => 'This is an admin reply',
            'sender_type' => 'admin',
        ]);
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create(['role' => 'client']);

        $response = $this->actingAs($user)
            ->get(route('admin.tickets.index'));

        $response->assertStatus(403);
    }
}
