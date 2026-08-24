import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, Clock, Eye, Inbox, Sparkles, Ticket, TriangleAlert, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { show as showTicket } from '@/routes/admin/tickets';
import { type BreadcrumbItem, type SharedData } from '@/types';


interface Category {
    id: number;
    category_name: string;
}

interface AiSuggestion {
    ai_summary: string;
    ai_suggested_category: string;
    ai_suggested_priority: 'low' | 'medium' | 'high';
}

interface Ticket {
    id: number;
    ticket_code: string;
    client_name: string;
    client_email: string;
    title: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    category: Category;
    ai_suggestion?: AiSuggestion;
    created_at: string;
}

interface Stats {
    total: number;
    open: number;
    in_progress: number;
    closed: number;
    high_priority: number;
    ai_analyzed: number;
}

interface DashboardProps {
    stats: Stats;
    recentTickets: Ticket[];
}

export default function Dashboard({ stats, recentTickets }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ];

    const statusColors: Record<Ticket['status'], string> = {
        open: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        in_progress: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        closed: 'bg-muted text-muted-foreground border-border',
    };

    const priorityColors: Record<Ticket['priority'], string> = {
        low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        medium: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    };

    const statCards = [
        {
            label: 'Total Tickets',
            value: stats.total,
            hint: `${stats.ai_analyzed} analyzed by AI`,
            icon: Ticket,
            hoverBorder: 'hover:border-primary/50',
            iconColor: 'text-primary',
        },
        {
            label: 'Open',
            value: stats.open,
            hint: 'Awaiting first response',
            icon: Inbox,
            hoverBorder: 'hover:border-emerald-500/50',
            iconColor: 'text-emerald-500',
        },
        {
            label: 'In Progress',
            value: stats.in_progress,
            hint: 'Currently being worked on',
            icon: Clock,
            hoverBorder: 'hover:border-amber-500/50',
            iconColor: 'text-amber-500',
        },
        {
            label: 'Closed',
            value: stats.closed,
            hint: 'Resolved tickets',
            icon: Activity,
            hoverBorder: 'hover:border-blue-500/50',
            iconColor: 'text-blue-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-8 space-y-8">
                {/* Welcome Hero */}
                <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-primary-foreground shadow-2xl shadow-primary/20">
                    <div className="relative z-10 space-y-4">
                        <div className="bg-white/20 w-fit p-2 rounded-xl backdrop-blur-md">
                            <Sparkles className="size-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">
                            Welcome back, <span className="opacity-80 font-medium">{auth.user.name.split(' ')[0]}!</span>
                        </h1>
                        <p className="max-w-md text-primary-foreground/70 font-medium leading-relaxed">
                            Your IT Helpdesk is running smoothly. AI has been analyzing incoming requests to keep your resolution time low.
                        </p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-64 rounded-full bg-black/10 blur-3xl" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <Card
                            key={card.label}
                            className={`border border-border/50 shadow-xl rounded-2xl overflow-hidden group ${card.hoverBorder} transition-colors`}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    {card.label}
                                </CardTitle>
                                <card.icon className={`size-4 ${card.iconColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{card.value}</div>
                                <p className="text-xs text-muted-foreground font-medium mt-1">{card.hint}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Tickets */}
                    <Card className="lg:col-span-2 border border-border/50 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-border/50 py-5 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Ticket className="size-4 text-primary" />
                                </div>
                                Recent Tickets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recentTickets.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
                                    <div className="bg-muted size-12 rounded-full flex items-center justify-center">
                                        <Inbox className="size-6 text-muted-foreground opacity-40" />
                                    </div>
                                    <p className="text-muted-foreground font-medium italic">No tickets have been submitted yet.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="w-[120px] font-bold uppercase tracking-widest text-[10px]">Code</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px]">Client &amp; Issue</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                                            <TableHead className="font-bold uppercase tracking-widest text-[10px]">Priority</TableHead>
                                            <TableHead className="w-[60px]" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTickets.map((ticket) => (
                                            <TableRow key={ticket.id} className="border-border/50 group">
                                                <TableCell className="font-mono font-black text-primary/80 text-sm tracking-wider">
                                                    #{ticket.ticket_code}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                            {ticket.title}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                                            <User className="size-3" />
                                                            {ticket.client_name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-black uppercase h-5 px-2 border-transparent ${statusColors[ticket.status]}`}
                                                    >
                                                        {ticket.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-black uppercase h-5 px-2 border-transparent ${priorityColors[ticket.priority]}`}
                                                    >
                                                        {ticket.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <Link href={showTicket(ticket.id).url}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Side Stats */}
                    <div className="space-y-6">
                        <div
                            className={`relative overflow-hidden rounded-3xl p-8 shadow-xl transition-colors ${
                                stats.high_priority > 0
                                    ? 'bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/30'
                                    : 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20'
                            }`}
                        >
                            <TriangleAlert
                                className={`absolute -right-8 -bottom-8 size-48 transition-transform duration-500 group-hover:scale-110 ${
                                    stats.high_priority > 0 ? 'text-rose-500/10' : 'text-primary/5'
                                }`}
                            />
                            <h4
                                className={`relative z-10 font-black uppercase tracking-widest text-xs mb-2 flex items-center gap-2 ${
                                    stats.high_priority > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-primary'
                                }`}
                            >
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${stats.high_priority > 0 ? 'bg-rose-500' : 'bg-primary'}`}
                                />
                                High Priority
                            </h4>
                            <p className="relative z-10 text-4xl font-black">{stats.high_priority}</p>
                            <p className="relative z-10 text-sm text-foreground/70 font-medium mt-2 leading-relaxed">
                                {stats.high_priority > 0
                                    ? 'Active tickets need urgent attention.'
                                    : 'No urgent tickets right now. Great job!'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden">
                            <Sparkles className="absolute -right-8 -bottom-8 size-48 text-primary/5" />
                            <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                AI Analysis
                            </h4>
                            <p className="relative z-10 text-4xl font-black">
                                {stats.ai_analyzed}
                                <span className="text-lg font-bold text-muted-foreground"> / {stats.total}</span>
                            </p>
                            <p className="relative z-10 text-sm text-foreground/80 font-medium mt-2 leading-relaxed">
                                Tickets analyzed by AI so far.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
