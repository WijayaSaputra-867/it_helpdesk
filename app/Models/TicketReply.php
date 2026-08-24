<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketReply extends Model
{
    /** @use HasFactory<\Database\Factories\TicketReplyFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'sender_type',
        'message',
        'created_at',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
