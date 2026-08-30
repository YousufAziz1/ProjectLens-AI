import Link from 'next/link';

export function ReportExample() {
    return (
        <section className="border-t border-border/40 px-4 py-20 sm:py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">From Project URL &rarr; Verified Intelligence</h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        See how TrustLens-AI transforms unstructured project data into actionable institutional insights within seconds.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Input Phase */}
                    <div className="flex-1 rounded-2xl bg-muted/40 p-6 border border-border/40 relative">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Input Data Stream</div>
                        <div className="bg-background text-sm font-mono p-3 rounded border border-border shadow-inner text-foreground/80 flex items-center gap-2">
                            <span className="text-emerald-500">GET</span> github.com/project
                        </div>
                        <div className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">AI Verification Layer</div>
                        <div className="space-y-3 font-semibold text-sm">
                            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                                <span className="bg-green-500/10 p-1.5 rounded-full ring-1 ring-green-500/20">✓</span> Repository code deep-scanned
                            </div>
                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                <span className="bg-emerald-500/10 p-1.5 rounded-full ring-1 ring-emerald-500/20">✓</span> Protocol documentation verified
                            </div>
                            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                                <span className="bg-blue-500/10 p-1.5 rounded-full ring-1 ring-blue-500/20">✓</span> Hard evidence extracted
                            </div>
                        </div>
                    </div>

                    {/* Output Phase */}
                    <div className="flex-[1.5] rounded-2xl bg-foreground text-background p-6 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                        <div className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">Generated Output</div>

                        <div className="flex items-center justify-between mb-8 border-b border-background/10 pb-6">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-1 text-background/80">Project Health Score</h3>
                                <div className="text-5xl font-black text-white">94<span className="text-2xl text-white/50">/100</span></div>
                            </div>
                            <Link href="/analyze" className="hidden sm:flex px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full text-sm shadow-lg hover:shadow-primary/20 transition-all">
                                View Live Report
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <div className="text-3xl font-black text-white mb-1">8</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-background/60">Findings</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-emerald-400 mb-1">0</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-background/60">Critical Issues</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-blue-400 mb-1">24</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-background/60">Evidence Sources</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
