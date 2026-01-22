import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { Calendar, Clock, Headset, MessageSquare, Sparkles, Tag, User } from 'lucide-react';
import { store } from '@/routes/tickets/reply';
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
    created_at: string;
}

interface ShowProps {
    ticket: Ticket;
}

export default function Show({ ticket }: ShowProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        post(toUrl(store(ticket.ticket_code)), {
            onSuccess: () => reset(),
        });
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
        <PublicLayout>
            <Head title={`Ticket #${ticket.ticket_code}`} />
            
            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <Badge variant="outline" className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColors[ticket.status]}`}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Ticket <span className="text-primary">#{ticket.ticket_code}</span>
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium">{ticket.title}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column: Details and Discussion */}
                    <div className="lg:col-span-3 space-y-10">
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Description</h3>
                            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    Discussion
                                </h3>
                                <Badge variant="secondary" className="rounded-full">
                                    {ticket.replies.length} {ticket.replies.length === 1 ? 'Reply' : 'Replies'}
                                </Badge>
                            </div>
                            
                            <div className="space-y-6">
                                {ticket.replies.length === 0 ? (
                                    <div className="bg-muted/30 p-12 rounded-2xl border border-dashed border-border text-center text-muted-foreground">
                                        <MessageSquare className="w-10 h-10 mx-auto mb-4 opacity-20" />
                                        <p>No replies yet. Our team will get back to you soon.</p>
                                    </div>
                                ) : (
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
                                                        ? 'bg-primary/5 border-primary/10' 
                                                        : 'bg-card border-border/50'
                                                    }`}>
                                                        <div className="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/5 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm">
                                                                    {reply.sender_type === 'admin' ? (reply.user?.name || 'Support Agent') : ticket.client_name}
                                                                </span>
                                                                {reply.sender_type === 'admin' && (
                                                                    <Badge variant="outline" className="text-[10px] uppercase h-4 px-1.5 bg-primary/10 text-primary border-primary/20">Staff</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{new Date(reply.created_at).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reply Form */}
                            <div className="mt-8 pt-8 border-t border-border">
                                <h4 className="text-lg font-bold mb-4">Post a Reply</h4>
                                <form onSubmit={submitReply} className="space-y-4">
                                    <textarea
                                        id="message"
                                        className="flex min-h-[120px] w-full rounded-2xl border border-muted bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all hover:border-primary/50 shadow-inner"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Add more information or follow up on your issue..."
                                        required
                                    />
                                    <InputError message={errors.message} />
                                    <div className="flex justify-end">
                                        <Button type="submit" size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95" disabled={processing}>
                                            {processing ? 'Sending...' : 'Send Reply'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden">
                            <CardHeader className="bg-muted/50 border-b border-border/50">
                                <CardTitle className="text-xs uppercase tracking-[0.2em] font-black text-muted-foreground">Properties</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50">
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Tag className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Category</span>
                                        </div>
                                        <span className="text-sm font-semibold">{ticket.category.category_name}</span>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Priority</span>
                                        </div>
                                        <Badge variant="outline" className={`text-[10px] h-5 px-2 font-black ${priorityColors[ticket.priority]}`}>
                                            {ticket.priority}
                                        </Badge>
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold uppercase text-muted-foreground">Created</span>
                                        </div>
                                        <span className="text-sm font-semibold">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Headset className="w-24 h-24 rotate-12" />
                            </div>
                            <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-2">Access Key</h4>
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">Keep this code safe. You'll need it to track and respond to this ticket later.</p>
                            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-primary/20 text-center font-mono text-lg font-black text-primary tracking-wider shadow-inner break-all">
                                {ticket.ticket_code}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
