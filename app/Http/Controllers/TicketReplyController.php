<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketReplyController extends Controller
{
    public function store(Request $request, $code)
    {
        $ticket = Ticket::where('ticket_code', $code)->firstOrFail();

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = new TicketReply();
        $reply->ticket_id = $ticket->id;
        $reply->message = $validated['message'];
        $reply->created_at = now();

        if (Auth::check() && Auth::user()->role === 'admin') {
            $reply->user_id = Auth::id();
            $reply->sender_type = 'admin';
        } else {
            $reply->sender_type = 'client';
        }

        $reply->save();

        if ($reply->sender_type === 'admin') {
            \Illuminate\Support\Facades\Mail::to($ticket->client_email)->send(new \App\Mail\TicketReplied($ticket, $reply));
            return back()->with('success', 'Reply sent successfully.');
        }

        return redirect()->route('tickets.track.show', $code)->with('success', 'Reply sent successfully.');
    }
}
