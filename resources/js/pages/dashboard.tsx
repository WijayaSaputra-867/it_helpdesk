import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Headset, MessageSquare, Sparkles, Ticket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

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
                    <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Tickets</CardTitle>
                            <Ticket className="size-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">24</div>
                            <p className="text-xs text-muted-foreground font-medium mt-1">+4 since yesterday</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pending AI</CardTitle>
                            <Sparkles className="size-4 text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">7</div>
                            <p className="text-xs text-muted-foreground font-medium mt-1">Requires your review</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Resolved</CardTitle>
                            <Activity className="size-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">128</div>
                            <p className="text-xs text-muted-foreground font-medium mt-1">89% satisfaction rate</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Avg Response</CardTitle>
                            <Clock className="size-4 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">1.2h</div>
                            <p className="text-xs text-muted-foreground font-medium mt-1">-15% vs last week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border border-border/50 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="border-b border-border/50 py-5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <MessageSquare className="size-4 text-primary" />
                                </div>
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 h-64 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="bg-muted size-12 rounded-full flex items-center justify-center">
                                <Activity className="size-6 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-muted-foreground font-medium italic">No recent activity to display.</p>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                         <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 group relative overflow-hidden">
                            <Headset className="absolute -right-8 -bottom-8 size-48 text-primary/5 group-hover:scale-110 transition-transform duration-500" />
                            <h4 className="font-black text-primary uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Pro Tip
                            </h4>
                            <p className="relative z-10 text-sm text-foreground/80 font-medium leading-relaxed">
                                Use the AI Analysis tool on complex tickets to get instant summaries and suggested responses. It can save you up to 40% of resolution time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
