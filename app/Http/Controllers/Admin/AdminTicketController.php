<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with(['category', 'aiSuggestion'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Ticket/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['category', 'replies.user', 'aiSuggestion']);

        return Inertia::render('Admin/Ticket/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,closed',
        ]);

        $ticket->update($validated);

        return back()->with('success', 'Ticket status updated.');
    }

    public function updatePriority(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'priority' => 'required|in:low,medium,high',
        ]);

        $ticket->update($validated);

        return back()->with('success', 'Ticket priority updated.');
    }

    public function analyze(Ticket $ticket)
    {
        // 1. Trigger AI Analysis
        app(\App\Services\AIService::class)->analyzeTicket($ticket);

        // 2. Refresh Ticket and check for suggestion
        $ticket->refresh();
        $suggestion = $ticket->aiSuggestion;

        if ($suggestion && $suggestion->ai_suggested_response) {
            // 3. Automatically post the AI reply
            $reply = $ticket->replies()->create([
                'message' => $suggestion->ai_suggested_response,
                'sender_type' => 'admin',
                'user_id' => auth()->id(), // Attributed to the admin who triggered it
            ]);

            // 4. Send email notification to client
            \Illuminate\Support\Facades\Mail::to($ticket->client_email)->send(new \App\Mail\TicketReplied($ticket, $reply));

            return back()->with('success', 'AI analyzed the ticket and posted a response automatically.');
        }

        return back()->with('success', 'Ticket analyzed by AI successfully (no response generated).');
    }

    public function storeAiReply(Ticket $ticket)
    {
        $suggestion = $ticket->aiSuggestion;

        if (!$suggestion || !$suggestion->ai_suggested_response) {
            return back()->with('error', 'No AI suggestion available.');
        }

        $reply = $ticket->replies()->create([
            'message' => $suggestion->ai_suggested_response,
            'sender_type' => 'admin',
            'user_id' => auth()->id(),
        ]);

        \Illuminate\Support\Facades\Mail::to($ticket->client_email)->send(new \App\Mail\TicketReplied($ticket, $reply));

        return back()->with('success', 'AI suggestion posted as reply and email sent to client.');
    }
}
