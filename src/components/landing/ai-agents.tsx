export function AiAgents() {
    return (
        <section className="border-t border-border/40 bg-zinc-50 dark:bg-zinc-900/10 px-4 py-20 sm:py-24 relative overflow-hidden">
            <div className="mx-auto max-w-screen-xl">
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Autonomous AI Research Team</h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        A specialized council of deep-learning agents executing parallel reconnaissance on technical architecture.
                    </p>
                </div>

                <div className="flex flex-col items-center max-w-4xl mx-auto relative z-10">
                    {/* Top Node */}
                    <div className="bg-primary text-primary-foreground font-black tracking-widest uppercase px-8 py-4 rounded-xl shadow-lg border border-primary-foreground/20 text-lg">
                        TrustLens-AI
                    </div>

                    {/* Connecting Line */}
                    <div className="w-px h-12 bg-border relative">
                        <div className="absolute inset-0 bg-primary/50 animate-pulse"></div>
                    </div>

                    {/* Branching Lines */}
                    <div className="w-full max-w-3xl h-px bg-border relative mb-6">
                        <div className="absolute top-0 left-0 w-px h-6 bg-border"></div>
                        <div className="absolute top-0 left-1/2 -ml-px w-px h-6 bg-border"></div>
                        <div className="absolute top-0 right-0 w-px h-6 bg-border"></div>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center">
                        <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-1">GitHub Agent</h3>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border/40">Repository Intelligence</p>
                            <ul className="text-sm text-foreground/80 space-y-2 font-medium">
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Code quality</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Commit history</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Developer activity</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Dependency risks</li>
                            </ul>
                        </div>

                        <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Documentation Agent</h3>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border/40">Protocol Understanding</p>
                            <ul className="text-sm text-foreground/80 space-y-2 font-medium">
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Whitepaper claims</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Architecture validation</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Roadmap consistency</li>
                            </ul>
                        </div>

                        <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Security Agent</h3>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border/40">Risk Detection</p>
                            <ul className="text-sm text-foreground/80 space-y-2 font-medium">
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Smart contract patterns</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Admin risks</li>
                                <li className="flex items-center justify-center gap-2"><span className="text-green-500">✓</span> Missing security signals</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
