import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { Calendar, Clock, MessageSquare, Send, Sparkles, Tag, User } from 'lucide-react';
import { store as replyStore } from '@/routes/tickets/reply';
import { updatePriority, updateStatus } from '@/routes/admin/tickets';
import { toUrl } from '@/lib/utils';

interface Category {
    id: number;
    category_name: string;
}

interface Reply {
    id: number;
    message: string;
    sender_type: 'admin' | 'client';
    user?: {
        name: string;
    };
    created_at: string;
}

interface AiSuggestion {
    ai_summary: string;
    ai_suggested_category: string;
    ai_suggested_priority: 'low' | 'medium' | 'high';
    ai_suggested_response?: string;
}

interface Ticket {
    id: number;
    ticket_code: string;
    client_name: string;
    client_email: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    category: Category;
    replies: Reply[];
    ai_suggestion?: AiSuggestion;
    created_at: string;
}

interface ShowProps {
    ticket: Ticket;
}

export default function Show({ ticket }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Manage Tickets', href: '/admin/tickets' },
        { title: `Ticket #${ticket.ticket_code}`, href: `#` },
    ];

    const { data: replyData, setData: setReplyData, post, processing: replyProcessing, reset: resetReply, errors: replyErrors } = useForm({
        message: '',
    });

    const statusForm = useForm({
        status: ticket.status,
    });

    const priorityForm = useForm({
        priority: ticket.priority,
    });

    const aiForm = useForm({});

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        post(toUrl(replyStore(ticket.ticket_code)), {
            onSuccess: () => resetReply(),
        });
    };

    const handleUpdateStatus = (value: string) => {
        statusForm.setData('status', value as any);
        statusForm.patch(toUrl(updateStatus(ticket.id)));
    };

    const handleUpdatePriority = (value: string) => {
        priorityForm.setData('priority', value as any);
        priorityForm.patch(toUrl(updatePriority(ticket.id)));
    };

    const handleAnalyze = () => {
        aiForm.post(`/admin/tickets/${ticket.id}/analyze`);
    };

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
            <Head title={`Ticket #${ticket.ticket_code}`} />

            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Ticket <span className="text-primary">#{ticket.ticket_code}</span></h1>
                            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-transparent ${statusColors[ticket.status]}`}>
                                {ticket.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-lg font-medium">{ticket.title}</p>
                    </div>

                    <div className="flex flex-wrap items-end gap-6">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">Update Status</Label>
                            <Select defaultValue={ticket.status} onValueChange={handleUpdateStatus}>
                                <SelectTrigger className="w-[160px] h-11 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm focus:ring-primary shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                    <SelectItem value="open" className="font-medium">Open</SelectItem>
                                    <SelectItem value="in_progress" className="font-medium">In Progress</SelectItem>
                                    <SelectItem value="closed" className="font-medium">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground ml-1">Set Priority</Label>
                            <Select defaultValue={ticket.priority} onValueChange={handleUpdatePriority}>
                                <SelectTrigger className="w-[160px] h-11 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm focus:ring-primary shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                    <SelectItem value="low" className="font-medium">Low</SelectItem>
                                    <SelectItem value="medium" className="font-medium">Medium</SelectItem>
                                    <SelectItem value="high" className="font-medium">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {!ticket.ai_suggestion && (
                            <Button 
                                className="h-11 rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95 bg-gradient-to-r from-indigo-600 to-indigo-500 border-none"
                                onClick={handleAnalyze}
                                disabled={aiForm.processing}
                            >
                                <Sparkles className="w-4 h-4 mr-2 fill-white/20" />
                                {aiForm.processing ? 'Analyzing...' : 'Run Smart AI Analysis'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-10">
                        {/* AI Analysis Panel */}
                        {ticket.ai_suggestion && (
                            <Card className="border border-indigo-500/20 shadow-2xl shadow-indigo-500/5 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] via-indigo-500/[0.01] to-transparent">
                                <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 py-5">
                                    <CardTitle className="text-xs font-black flex items-center gap-2 text-indigo-600 uppercase tracking-[0.2em]">
                                        <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                                            <Sparkles className="w-4 h-4 fill-indigo-600/30" />
                                        </div>
                                        AI Assistant Intelligence
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                                Situational Summary
                                            </p>
                                            <div className="bg-background/60 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/10 shadow-inner">
                                                <p className="text-sm text-indigo-900 dark:text-indigo-100 italic leading-relaxed font-medium">
                                                    "{ticket.ai_suggestion.ai_summary}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Suggested Category</p>
                                                    <div className="bg-background/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                                                        <Badge variant="outline" className="text-[10px] font-black text-indigo-600 border-indigo-500/20 bg-indigo-500/5 uppercase w-full justify-center">
                                                            {ticket.ai_suggestion.ai_suggested_category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Suggested Priority</p>
                                                    <div className="bg-background/40 p-3 rounded-xl border border-indigo-500/10 text-center">
                                                        <Badge variant="outline" className={`text-[10px] font-black uppercase w-full justify-center ${priorityColors[ticket.ai_suggestion.ai_suggested_priority]}`}>
                                                            {ticket.ai_suggestion.ai_suggested_priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {ticket.ai_suggestion.ai_suggested_response && (
                                        <div className="space-y-3 pt-6 border-t border-indigo-500/10">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                                Automated AI Response (Posted)
                                            </p>
                                            <div className="bg-background/40 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/10 text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed font-mono whitespace-pre-wrap">
                                                {ticket.ai_suggestion.ai_suggested_response}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-1">Issue Description</h3>
                            <Card className="border border-border/50 shadow-xl rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
                                <CardHeader className="border-b border-border/50 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border/50">
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-bold tracking-tight">{ticket.client_name}</CardTitle>
                                            <CardDescription className="text-xs font-medium text-primary hover:underline cursor-pointer">
                                                {ticket.client_email}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm font-medium">{ticket.description}</p>
                                </CardContent>
                            </Card>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-b border-border pb-4 ml-1">
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    Discussion Thread
                                </h3>
                                <Badge variant="secondary" className="rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-wider">
                                    {ticket.replies.length} Messages
                                </Badge>
                            </div>
                            
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                {ticket.replies.map((reply) => (
                                    <div key={reply.id} className="relative flex items-start group">
                                        <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-background ring-4 ring-background border border-border group-hover:border-primary/50 transition-colors">
                                            {reply.sender_type === 'admin' ? (
                                                <Sparkles className="h-5 w-5 text-primary" />
                                            ) : (
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="ml-14 flex-1">
                                            <div className={`rounded-2xl p-6 shadow-sm border transition-all ${
                                                reply.sender_type === 'admin' 
                                                ? 'bg-primary text-primary-foreground border-transparent' 
                                                : 'bg-card border-border/50'
                                            }`}>
                                                <div className={`flex items-center justify-between mb-3 border-b pb-2 ${
                                                    reply.sender_type === 'admin' ? 'border-white/10' : 'border-black/5 dark:border-white/5'
                                                }`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm">
                                                            {reply.sender_type === 'admin' ? (reply.user?.name || 'You') : ticket.client_name}
                                                        </span>
                                                        {reply.sender_type === 'admin' && (
                                                            <Badge variant="outline" className="text-[10px] uppercase h-4 px-1.5 bg-white/20 text-white border-transparent">Team</Badge>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-[10px] font-bold ${
                                                        reply.sender_type === 'admin' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                                                    }`}>
                                                        <Clock className="w-3 h-3" />
                                                        <span>{new Date(reply.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="ml-14 pt-4">
                                    <Card className="border border-border shadow-2xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-xl">
                                        <CardContent className="p-8">
                                            <form onSubmit={submitReply} className="space-y-6">
                                                <div className="space-y-3">
                                                    <Label htmlFor="reply_message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Compose Reply</Label>
                                                    <textarea
                                                        id="reply_message"
                                                        className="flex min-h-[140px] w-full rounded-2xl border border-border bg-background/50 px-5 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all hover:border-primary/30"
                                                        value={replyData.message}
                                                        onChange={(e) => setReplyData('message', e.target.value)}
                                                        placeholder="Write your professional response to the client..."
                                                        required
                                                    />
                                                    <InputError message={replyErrors.message} />
                                                </div>
                                                <div className="flex justify-end gap-4">
                                                    <Button type="submit" size="lg" className="rounded-xl px-10 font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95" disabled={replyProcessing}>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        {replyProcessing ? 'Sending...' : 'Post Reply & Notify'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">General Info</h3>
                            <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-border/50">
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <Tag className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Category</span>
                                            </div>
                                            <span className="text-sm font-bold text-foreground">{ticket.category.category_name}</span>
                                        </div>
                                        <div className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Submitted</span>
                                            </div>
                                            <span className="text-sm font-bold text-foreground">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-3 text-muted-foreground mb-3">
                                                <User className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Client Email</span>
                                            </div>
                                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-center">
                                                <span className="text-xs font-black text-primary break-all">{ticket.client_email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-500/20 shadow-xl shadow-amber-500/5 group">
                            <h4 className="font-black text-amber-600 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                                Staff Reminder
                            </h4>
                            <p className="text-xs text-amber-900/60 dark:text-amber-200/60 font-medium leading-relaxed">
                                Ensure all AI-generated content is reviewed for accuracy before final resolution. Be polite and concise in your replies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
