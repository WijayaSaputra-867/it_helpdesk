<x-mail::message>
# New Reply to Your Ticket

Hello {{ $ticket->client_name }},

There is a new reply to your ticket **#{{ $ticket->ticket_code }}**.

**Message:**
{{ $reply->message }}

<x-mail::button :url="route('tickets.track.show', $ticket->ticket_code)">
View Conversation
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} team
</x-mail::message>
