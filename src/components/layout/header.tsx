'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ProjectLensLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Analyze', href: '/analyze' },
];

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <ProjectLensLogo className="h-8 w-8 text-foreground group-hover:text-primary transition-colors duration-500" />
                    <span className="text-base font-bold tracking-tight">ProjectLens</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground',
                                pathname === item.href ? 'text-foreground' : 'text-muted-foreground',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button nativeButton={false} render={<Link href="/analyze" />} size="sm" className="hidden md:inline-flex">
                        Analyze Project
                    </Button>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="border-t border-border/40 px-4 py-3 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground',
                                    pathname === item.href ? 'text-foreground' : 'text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Button
                            nativeButton={false}
                            render={<Link href="/analyze" onClick={() => setMobileOpen(false)} />}
                            size="sm"
                            className="mt-2 w-full"
                        >
                            Analyze Project
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
