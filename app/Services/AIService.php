<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\AiSuggestion;
use App\Models\Category;
use Illuminate\Support\Facades\Http;

class AIService
{
    public function analyzeTicket(Ticket $ticket)
    {
        $apiKey = config('services.gemini.key');
        
        if (!$apiKey) {
            \Log::warning('Gemini API key not set. Skipping ticket analysis.');
            return;
        }

        $prompt = "Analyze this IT support ticket and provide a response in JSON format with the following keys: 'summary', 'suggested_category_name', 'suggested_priority' (low, medium, high), and 'suggested_response' (a helpful and polite initial response to the user's grievance).\n\n";
        $prompt .= "Title: " . $ticket->title . "\n";
        $prompt .= "Description: " . $ticket->description . "\n";
        
        try {
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                
                // Robust JSON extraction (handles markdown code blocks)
                if (preg_match('/\{.*\}/s', $content, $matches)) {
                    $content = $matches[0];
                }
                
                $aiResult = json_decode($content, true);

                AiSuggestion::updateOrCreate(
                    ['ticket_id' => $ticket->id],
                    [
                        'ai_summary' => $aiResult['summary'] ?? 'Failed to generate summary',
                        'ai_suggested_category' => $aiResult['suggested_category_name'] ?? $ticket->category->category_name,
                        'ai_suggested_priority' => $aiResult['suggested_priority'] ?? 'medium',
                        'ai_suggested_response' => $aiResult['suggested_response'] ?? null,
                        'created_at' => now(),
                    ]
                );
            } else {
                \Log::error('Gemini API error: ' . $response->body());
            }
        } catch (\Exception $e) {
            \Log::error('Gemini API exception: ' . $e->getMessage());
        }
    }
}
