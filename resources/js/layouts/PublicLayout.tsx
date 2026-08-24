import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { create, track } from '@/routes/tickets';
import { toUrl } from '@/lib/utils';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                            <AppLogoIcon className="h-5 w-5 fill-current" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">IT Helpdesk</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 mr-6 border-r border-border pr-6">
                            <Link href={toUrl(create())} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Submit Ticket
                            </Link>
                            <Link href={toUrl(track())} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Track Ticket
                            </Link>
                        </div>
                        <AppearanceToggleDropdown />
                    </nav>
                </div>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-card border-t border-border py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 opacity-60">
                        <AppLogoIcon className="h-4 w-4" />
                        <span className="text-sm font-semibold">IT Helpdesk AI</span>
                    </div>
                    <div className="text-muted-foreground text-sm text-center">
                        &copy; {new Date().getFullYear()} IT Helpdesk AI Assistant. Powered by Gemini.
                    </div>
                </div>
            </footer>
        </div>
    );
}
