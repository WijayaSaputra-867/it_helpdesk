import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { Eye, Search, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as ticketsIndex, show as showTicket } from '@/routes/admin/tickets';
import { toUrl } from '@/lib/utils';

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

interface IndexProps {
    tickets: Ticket[];
}

export default function Index({ tickets }: IndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manage Tickets',
            href: toUrl(ticketsIndex()),
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Tickets" />

            <div className="p-4 sm:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Support Tickets</h1>
                        <p className="text-muted-foreground font-medium">Review and respond to incoming user requests.</p>
                    </div>
                </div>

                <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="w-[120px] font-bold uppercase tracking-widest text-[10px]">Code</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Client & Issue</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Category</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px]">Priority</TableHead>
                                    <TableHead className="w-[80px] font-bold uppercase tracking-widest text-[10px]">AI</TableHead>
                                    <TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8 opacity-20" />
                                                <p className="font-medium italic">No tickets in the system yet.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.id} className="hover:bg-primary/[0.02] border-border/50 transition-colors group">
                                            <TableCell className="font-mono font-black text-primary/80 text-sm tracking-wider">
                                                #{ticket.ticket_code}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.title}</span>
                                                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                                        <User className="size-3" />
                                                        {ticket.client_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-bold text-[10px] uppercase border-border/50 bg-background/50">
                                                    {ticket.category.category_name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-black uppercase h-5 px-2 border-transparent ${statusColors[ticket.status]}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-black uppercase h-5 px-2 border-transparent ${priorityColors[ticket.priority]}`}>
                                                    {ticket.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {ticket.ai_suggestion && (
                                                    <div title="AI Analysis Available" className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                                                        <Sparkles className="w-4 h-4 fill-primary/20" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={toUrl(showTicket(ticket.id))}>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                        <Eye className="w-5 h-5" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
