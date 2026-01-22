import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { Search } from 'lucide-react';
import { show } from '@/routes/tickets/track';
import { create } from '@/routes/tickets';
import { toUrl } from '@/lib/utils';

export default function Track() {
    const { data, setData, get, processing, errors } = useForm({
        code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Redirect to track show page
        window.location.href = toUrl(show(data.code));
    };

    return (
        <PublicLayout>
            <Head title="Track Ticket" />
            
            <div className="max-w-md mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Track Ticket</h1>
                    <p className="mt-4 text-muted-foreground">Enter your ticket code to view status and replies.</p>
                </div>

                <Card className="border border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-8">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Search className="w-6 h-6 text-primary" />
                            </div>
                            Ticket Tracking
                        </CardTitle>
                        <CardDescription>Enter the 10-character code provided when you submitted your ticket.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={submit} className="space-y-8">
                            <div className="space-y-4">
                                <Label htmlFor="code" className="text-foreground/80 font-medium">Ticket Code</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="ABC123XYZ4"
                                    className="text-center text-3xl font-mono tracking-[0.2em] uppercase py-8 rounded-xl border-muted hover:border-primary/50 transition-all focus:ring-primary"
                                    maxLength={10}
                                    required
                                />
                                <InputError message={errors.code} />
                            </div>

                            <Button type="submit" className="w-full py-8 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02]" disabled={processing}>
                                {processing ? 'Tracking...' : 'Track Now'}
                            </Button>

                            <div className="text-center">
                                <Link href={toUrl(create())} className="text-sm text-primary hover:underline font-medium">
                                    Lost your code? Submit a new ticket
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
