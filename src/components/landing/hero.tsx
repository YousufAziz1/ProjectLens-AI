import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectLensLogo } from '@/components/ui/logo';

export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 py-20 sm:py-32 text-center lg:text-left">
            {/* Ambient FX */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-40 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-40 mix-blend-screen" />

            <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative z-10">

                {/* Left Content */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-8">
                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur">
                            <span className="relative flex h-2.5 w-2.5 mr-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            Live Agent Network
                        </span>
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/80 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
                            OKX.AI • ASP #9422
                        </span>
                    </div>

                    <div className="hidden lg:flex w-20 h-20 items-center justify-center rounded-3xl bg-gradient-to-br from-foreground/5 to-foreground/10 shadow-2xl ring-1 ring-border/50 mb-8 backdrop-blur-md">
                        <ProjectLensLogo className="h-12 w-12 text-foreground" />
                    </div>

                    <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-balance drop-shadow-sm leading-tight text-foreground">
                        AI Agents That Perform <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Autonomous Web3 Due Diligence</span>
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl text-balance font-medium">
                        Analyze GitHub, documentation, smart contracts, and protocol claims. Generate evidence-backed research reports in minutes.
                    </p>
                    <p className="mt-4 max-w-2xl text-sm font-semibold text-primary/80">
                        Verified against real GitHub and project metadata. Unknown information is reported as unavailable—not fabricated.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row w-full justify-center lg:justify-start">
                        <Button nativeButton={false} render={<Link href="/analyze" />} size="lg" className="px-10 h-14 text-base font-bold shadow-xl rounded-full">
                            Analyze Any Web3 Project &rarr;
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12 mt-16 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-90">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-2xl font-black text-foreground drop-shadow-sm">100+</span>
                            Data Points
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-2xl font-black text-foreground drop-shadow-sm">3</span>
                            Specialized AI
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-2xl font-black text-foreground drop-shadow-sm">✓</span>
                            Evidence-Backed
                        </div>
                    </div>
                </div>

                {/* Right Floating Demo */}
                <div className="flex-[0.8] w-full max-w-md perspective-[1000px] mt-10 lg:mt-0">
                    <div className="transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 bg-background/50 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden text-left relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-30 mix-blend-overlay"></div>
                        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary animate-pulse">
                                LIVE AUDIT RUNNING
                            </span>
                        </div>
                        <div className="p-8 space-y-8 relative z-10">
                            <div>
                                <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-2">Target</div>
                                <div className="font-mono text-sm bg-muted/40 p-3 rounded-lg border border-border/50 text-foreground">github.com/example</div>
                            </div>

                            <div>
                                <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-3">Live Agents</div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="bg-green-500 text-background rounded-full p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                        GitHub Agent
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="bg-green-500 text-background rounded-full p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                        Security Agent
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="bg-green-500 text-background rounded-full p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                        Documentation Agent
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Health Score</div>
                                    <div className="text-3xl font-black text-foreground">94<span className="text-xl text-muted-foreground">/100</span></div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Evidence</div>
                                    <div className="text-3xl font-black text-foreground">24<span className="text-[10px] uppercase ml-2 text-muted-foreground">Sources</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
