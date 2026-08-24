<?php

namespace Database\Seeders;

use App\Models\AiSuggestion;
use App\Models\Category;
use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * @var array<int, array{0: string, 1: string, 2: string, 3: string}>
     */
    private array $scenarios = [
        ['Network', 'Cannot connect to office Wi-Fi', 'My laptop suddenly cannot detect the office Wi-Fi network since this morning. Other devices at the same desk are connected normally. I already tried restarting the laptop twice but the SSID never shows up.', 'high'],
        ['Hardware', 'Printer on 2nd floor not responding', 'The shared printer next to the meeting room does not respond to any print job. The display is stuck on "Processing" and the queue keeps piling up. Turning it off and on did not help.', 'medium'],
        ['Software', 'Outlook keeps crashing on startup', 'Every time I open Outlook it crashes after a few seconds with error code 0xc0000005. I can still access webmail, but I need the desktop client for my daily work.', 'high'],
        ['Security', 'Suspicious phishing email received', 'I received an email claiming to be from our HR department asking me to reset my password through an external link. The sender address looks slightly misspelled. I have not clicked anything.', 'high'],
        ['Network', 'VPN disconnects every few minutes', 'Since yesterday my VPN connection drops roughly every five minutes when working from home. Reconnecting works, but it interrupts all my remote sessions constantly.', 'medium'],
        ['Software', 'Excel file corrupted after crash', 'An important spreadsheet with quarterly numbers became unreadable after Excel crashed. When opened it only shows garbled characters. I need this file for a report tomorrow.', 'high'],
        ['Hardware', 'Laptop battery drains in under an hour', 'My work laptop used to last a full day on one charge, but now it dies within an hour even with light usage. The battery indicator also behaves erratically.', 'low'],
        ['Other', 'Request for additional monitor', 'I would like to request a second monitor for my workstation to improve productivity while handling design reviews. My current setup only supports a single screen.', 'low'],
        ['Network', 'Slow internet on the entire 3rd floor', 'Everyone on the third floor experiences extremely slow internet since the network maintenance last weekend. Pages take almost a minute to load on wired connections.', 'high'],
        ['Software', 'Cannot install approved accounting app', 'The software center shows the new accounting application as approved, but installation always fails at around 40% with a generic error message. I have tried three times.', 'medium'],
        ['Hardware', 'Keyboard keys sticking', 'Several keys on my keyboard require extra force to register, especially the spacebar and enter key. It slows down typing significantly and causes mistakes.', 'low'],
        ['Security', 'Account locked after wrong attempts', 'My account got locked because I mistyped my password several times after returning from leave. I already waited for an hour but the account is still locked.', 'medium'],
        ['Network', 'Meeting room HDMI not working', 'The HDMI port on the wall plate in meeting room B does not send any signal to the display. The cable looks fine and works with other laptops in different rooms.', 'medium'],
        ['Software', 'Slack notifications stopped arriving', 'Desktop Slack notifications suddenly stopped appearing yesterday, although the mobile app still receives them. Notification settings look correct and unchanged.', 'low'],
        ['Hardware', 'Monitor flickering intermittently', 'My external monitor flickers every few minutes for a second or two. Switching cables reduced it slightly but the problem persists. It is very distracting during work.', 'medium'],
        ['Other', 'Onboarding access for new team member', 'Our new analyst starts next Monday and needs accounts for email, VPN, and the reporting dashboard. Please prepare the standard onboarding package for the finance department.', 'low'],
    ];

    /**
     * Seed tickets with replies and AI suggestions.
     */
    public function run(): void
    {
        $admin = User::query()->where('role', 'admin')->first();
        $categories = Category::query()->pluck('id', 'category_name');

        foreach ($this->scenarios as $index => [$categoryName, $title, $description, $priority]) {
            $status = match ($index % 5) {
                1 => 'in_progress',
                3 => 'closed',
                default => 'open',
            };

            $createdAt = now()->subDays(16 - $index)->subHours($index * 3);

            $ticket = Ticket::factory()->create([
                'category_id' => $categories[$categoryName],
                'title' => $title,
                'description' => $description,
                'priority' => $priority,
                'status' => $status,
            ]);
            $ticket->forceFill(['created_at' => $createdAt])->save();

            if ($index % 2 === 0) {
                AiSuggestion::factory()->create([
                    'ticket_id' => $ticket->id,
                    'ai_suggested_priority' => $priority,
                    'created_at' => $createdAt->copy()->addMinutes(10),
                ]);
            }

            if (in_array($status, ['in_progress', 'closed'], true)) {
                TicketReply::factory()
                    ->fromAdmin($admin)
                    ->create([
                        'ticket_id' => $ticket->id,
                        'message' => 'Thanks for the detailed report. Our team has picked up your ticket and is currently investigating the issue. We will keep you updated on the progress.',
                        'created_at' => $createdAt->copy()->addHours(2),
                    ]);

                TicketReply::factory()
                    ->fromClient()
                    ->create([
                        'ticket_id' => $ticket->id,
                        'message' => 'Thank you for the update. Please let me know if you need any additional information from my side.',
                        'created_at' => $createdAt->copy()->addHours(4),
                    ]);
            }

            if ($status === 'closed') {
                TicketReply::factory()
                    ->fromAdmin($admin)
                    ->create([
                        'ticket_id' => $ticket->id,
                        'message' => 'Good news! The issue has been resolved and we verified everything is working again on our side. Feel free to reopen this ticket if you experience anything similar.',
                        'created_at' => $createdAt->copy()->addDays(1),
                    ]);
            }
        }
    }
}
