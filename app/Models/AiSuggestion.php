<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiSuggestion extends Model
{
    protected $table = 'ai_suggestions';
    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'ai_summary',
        'ai_suggested_category',
        'ai_suggested_priority',
        'ai_suggested_response',
        'created_at',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
