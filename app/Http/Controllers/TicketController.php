<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function create()
    {
        return Inertia::render('Public/Ticket/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
            'g-recaptcha-response' => 'required|string',
        ]);

        // Verify reCAPTCHA v3
        $response = \Illuminate\Support\Facades\Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret'),
            'response' => $validated['g-recaptcha-response'],
            'remoteip' => $request->ip(),
        ]);

        /** @var \Illuminate\Http\Client\Response $response */
        $recaptchaData = $response->json();

        if (!$recaptchaData['success'] || ($recaptchaData['score'] ?? 0) < 0.5) {
            \Log::warning('reCAPTCHA v3 failed', ['data' => $recaptchaData]);
            return back()->withErrors(['g-recaptcha-response' => 'reCAPTCHA verification failed. Please try again.']);
        }

        $validated['ticket_code'] = strtoupper(Str::random(10));
        
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments', 'public');
            $validated['attachment'] = $path;
        }

        $ticket = Ticket::create($validated);

        \Illuminate\Support\Facades\Mail::to($ticket->client_email)->send(new \App\Mail\TicketCreated($ticket));

        return redirect()->route('tickets.track.show', $ticket->ticket_code)
            ->with('success', 'Ticket created successfully. Save your code: ' . $ticket->ticket_code);
    }

    public function track()
    {
        return Inertia::render('Public/Ticket/Track');
    }

    public function show($code)
    {
        $ticket = Ticket::where('ticket_code', $code)->with(['category', 'replies.user'])->firstOrFail();

        return Inertia::render('Public/Ticket/Show', [
            'ticket' => $ticket,
        ]);
    }
}
