<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        if ($request->user()->role !== 'admin') {
            return redirect()->route('home');
        }

        $stats = [
            'total' => Ticket::count(),
            'open' => Ticket::where('status', 'open')->count(),
            'in_progress' => Ticket::where('status', 'in_progress')->count(),
            'closed' => Ticket::where('status', 'closed')->count(),
            'high_priority' => Ticket::whereIn('status', ['open', 'in_progress'])
                ->where('priority', 'high')
                ->count(),
            'ai_analyzed' => Ticket::has('aiSuggestion')->count(),
        ];

        $recentTickets = Ticket::query()
            ->with(['category', 'aiSuggestion'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentTickets' => $recentTickets,
        ]);
    }
}
