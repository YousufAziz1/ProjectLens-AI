export function Comparison() {
    return (
        <section className="border-t border-border/40 px-4 py-20 sm:py-24 bg-background">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Why TrustLens-AI?</h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        Traditional assessments are slow, expensive, and opaque. Autonomous intelligence changes the paradigm.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                    {/* Traditional Array */}
                    <div className="bg-destructive/5 rounded-3xl p-8 border border-destructive/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                        <h3 className="text-xl font-bold mb-6 text-foreground/80 flex items-center gap-3">
                            <span className="p-2 bg-destructive/10 rounded-lg text-destructive">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            Traditional Audit
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-muted-foreground font-medium text-lg">
                                <span className="text-destructive font-black text-xl">✗</span> Days / weeks delay
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground font-medium text-lg">
                                <span className="text-destructive font-black text-xl">✗</span> Expensive retainers
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground font-medium text-lg">
                                <span className="text-destructive font-black text-xl">✗</span> Manual human review
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground font-medium text-lg">
                                <span className="text-destructive font-black text-xl">✗</span> Opaque findings
                            </li>
                        </ul>
                    </div>

                    {/* TrustLens-AI Array */}
                    <div className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/30 shadow-xl relative overflow-hidden ring-1 ring-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
                        <h3 className="text-2xl font-black mb-6 text-foreground flex items-center gap-3 relative z-10">
                            <span className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </span>
                            TrustLens-AI
                        </h3>
                        <ul className="space-y-4 relative z-10">
                            <li className="flex items-center gap-3 text-foreground font-bold text-lg">
                                <span className="text-green-500 bg-green-500/10 rounded-full p-1 border border-green-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </span>
                                Minutes instead of weeks
                            </li>
                            <li className="flex items-center gap-3 text-foreground font-bold text-lg">
                                <span className="text-green-500 bg-green-500/10 rounded-full p-1 border border-green-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </span>
                                Parallel AI Agents
                            </li>
                            <li className="flex items-center gap-3 text-foreground font-bold text-lg">
                                <span className="text-green-500 bg-green-500/10 rounded-full p-1 border border-green-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </span>
                                Evidence-backed traces
                            </li>
                            <li className="flex items-center gap-3 text-foreground font-bold text-lg">
                                <span className="text-green-500 bg-green-500/10 rounded-full p-1 border border-green-500/20">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </span>
                                Continuous autonomous analysis
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
