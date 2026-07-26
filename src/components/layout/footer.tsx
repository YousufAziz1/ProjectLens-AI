import Link from 'next/link';
import { ProjectLensLogo } from '@/components/ui/logo';

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-zinc-50 dark:bg-[#09090b]">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-md bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center text-background shadow-md">
                                <ProjectLensLogo className="w-6 h-6" />
                            </span>
                            <span className="text-lg font-bold tracking-tight">ProjectLens AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-2 max-w-xs">
                            Autonomous agent network delivering verifiable due diligence for the decentralized web.
                        </p>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-3 pt-6 lg:pt-0">
                        <div>
                            <p className="font-bold text-foreground mb-4">Product</p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/analyze" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">Analyze Protocol</Link>
                                </li>
                                <li>
                                    <Link href="/reports" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">Sample Reports</Link>
                                </li>
                                <li>
                                    <Link href="/api-docs" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">Developer API</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold text-foreground mb-4">Resources</p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/architecture" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">Documentation</Link>
                                </li>
                                <li>
                                    <a href="https://github.com/YousufAziz1/bagslaunchkit" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">GitHub Open Source ↗</a>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200">Security Parameters</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold text-foreground mb-4">Community</p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <a href="https://x.com/okx" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200 flex items-center gap-2">X (Twitter) ↗</a>
                                </li>
                                <li>
                                    <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-200 flex items-center gap-2">Discord ↗</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
                        © {new Date().getFullYear()} ProjectLens AI. All rights reserved. ASP #9422.
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest text-center md:text-right">
                        For research purposes only. Not financial advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
