import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import PublicLayout from '@/layouts/PublicLayout';
import { create, track } from '@/routes/tickets';
import { toUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Headset, Search, Sparkles } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <PublicLayout>
            <Head title="Welcome to IT Helpdesk AI" />
            
            <div className="relative isolate pt-14 lg:px-8">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>
                
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all">
                            Powered by Gemini Flash AI.{' '}
                            <span className="font-semibold text-primary">
                                Learn more <span aria-hidden="true">&rarr;</span>
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                            Intelligent IT Support at Your Fingertips
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Submit your technical issues and let our AI-powered helpdesk analyze and resolve them faster than ever. Smart, efficient, and always available.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href={toUrl(create())}>
                                <Button size="lg" className="gap-2 rounded-xl px-8">
                                    <Sparkles className="size-4" />
                                    Submit Ticket
                                </Button>
                            </Link>
                            <Link href={toUrl(track())}>
                                <Button variant="outline" size="lg" className="gap-2 rounded-xl px-8">
                                    <Search className="size-4" />
                                    Track Status
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                            <Headset className="size-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                            <p className="text-muted-foreground">AI analysis works around the clock to provide instant categorizations and initial support.</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                            <Sparkles className="size-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">AI-Powered Solutions</h3>
                            <p className="text-muted-foreground">Our Gemini-integrated system suggests fixes and tracks issue resolution intelligently.</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow lg:col-span-1 sm:col-span-2 lg:col-auto">
                            <Search className="size-10 text-primary mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Easy Tracking</h3>
                            <p className="text-muted-foreground">Track your tickets with unique access codes. No account needed for basic support tracking.</p>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </PublicLayout>
    );
}
