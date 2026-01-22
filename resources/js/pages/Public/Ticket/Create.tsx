import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { store } from '@/routes/tickets';
import { toUrl } from '@/lib/utils';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useEffect } from 'react';

interface Category {
    id: number;
    category_name: string;
}

interface CreateProps {
    categories: Category[];
}

export default function Create({ categories }: CreateProps) {
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        client_name: '',
        client_email: '',
        category_id: '',
        title: '',
        description: '',
        attachment: null as File | null,
        'g-recaptcha-response': '',
    });

    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }

        const token = await executeRecaptcha('submit_ticket');
        setData('g-recaptcha-response', token);
    }, [executeRecaptcha]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.error('reCAPTCHA not ready');
            return;
        }

        try {
            const token = await executeRecaptcha('submit_ticket');
            
            // Use transform to inject the token right before post
            transform((data) => ({
                ...data,
                'g-recaptcha-response': token,
            }));

            post(toUrl(store()), {
                onSuccess: () => reset(),
                onError: (err) => {
                    console.error('Submission error:', err);
                }
            });
        } catch (error) {
            console.error('reCAPTCHA execution failed:', error);
        }
    };

    return (
        <PublicLayout>
            <Head title="Submit Ticket" />
            
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Submit a Ticket</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Tell us what's wrong and our team will get back to you shortly.</p>
                </div>

                <Card className="border border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle>Ticket Information</CardTitle>
                        <CardDescription>Fill out the form below to report an issue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="client_name" className="text-foreground/80">Full Name</Label>
                                    <Input
                                        id="client_name"
                                        value={data.client_name}
                                        onChange={(e) => setData('client_name', e.target.value)}
                                        placeholder="John Doe"
                                        className="rounded-lg border-muted hover:border-primary/50 transition-colors"
                                    />
                                    <InputError message={errors.client_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_email" className="text-foreground/80">Email Address</Label>
                                    <Input
                                        id="client_email"
                                        type="email"
                                        value={data.client_email}
                                        onChange={(e) => setData('client_email', e.target.value)}
                                        placeholder="john@example.com"
                                        className="rounded-lg border-muted hover:border-primary/50 transition-colors"
                                    />
                                    <InputError message={errors.client_email} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id" className="text-foreground/80">Category</Label>
                                <Select onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger className="rounded-lg border-muted">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-foreground/80">Issue Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Cannot connect to VPN"
                                    className="rounded-lg border-muted hover:border-primary/50 transition-colors"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground/80">Detailed Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[120px] w-full rounded-lg border border-muted bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-primary/50"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Please provide details about the problem..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachment" className="text-foreground/80">Attachment (Optional)</Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    onChange={(e) => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                    className="cursor-pointer rounded-xl border-muted h-12 file:h-full file:bg-primary file:text-primary-foreground file:border-0 file:rounded-xl file:px-6 file:mr-4 file:font-bold hover:file:bg-primary/90 transition-all"
                                />
                                <CardDescription>Max size: 2MB. Format: JPG, PNG, PDF, DOCX.</CardDescription>
                                <InputError message={errors.attachment} />
                            </div>

                            <div className="space-y-4">
                                <InputError message={errors['g-recaptcha-response']} />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    This site is protected by reCAPTCHA and the Google 
                                    <a href="https://policies.google.com/privacy" className="text-primary hover:underline ml-1">Privacy Policy</a> and 
                                    <a href="https://policies.google.com/terms" className="text-primary hover:underline ml-1">Terms of Service</a> apply.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full py-7 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Ticket'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
