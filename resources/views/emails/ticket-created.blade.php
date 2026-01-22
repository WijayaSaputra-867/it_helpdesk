# New Ticket Created

Hello {{ $ticket->client_name }},

A new ticket has been created successfully. Your ticket code is: **{{ $ticket->ticket_code }}**.

**Ticket Details:**
- **Title:** {{ $ticket->title }}
- **Category:** {{ $ticket->category->name }}

You can track your ticket status by clicking the button below:

<x-mail::button :url="route('tickets.track.show', $ticket->ticket_code)">
Track Ticket
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
