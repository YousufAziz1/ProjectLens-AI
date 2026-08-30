import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, BookOpen, Key, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function DemoShowcase() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950 px-4 border-t border-border/40 font-sans">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-foreground">Recently Analyzed</h2>
                        <p className="text-muted-foreground font-medium max-w-xl">
                            Live showcase of verified audits executed by the autonomous TrustLens subnet. Explore real deterministic evidence extraction.
                        </p>
                    </div>
                    <Link href="/reports" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
                        View All Reports <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Mock Report 1 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background overflow-hidden h-full">
                            <CardContent className="p-0">
                                <div className="p-6 pb-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                            <div className="h-5 w-5 rounded-full bg-blue-500"></div>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1 rounded bg-muted/40">2 min ago</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">Predict Oracle</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 font-medium">
                                            <ShieldAlert className="w-3.5 h-3.5" /> High TVL Framework
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</span>
                                        <span className="text-2xl font-black text-foreground">91</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary group-hover:underline">View Report</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Mock Report 2 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background overflow-hidden h-full">
                            <CardContent className="p-0">
                                <div className="p-6 pb-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                            <div className="h-5 w-5 rounded border-2 border-purple-500 mix-blend-screen"></div>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1 rounded bg-muted/40">15 min ago</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">Arbitrum DAO</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 font-medium">
                                            <BookOpen className="w-3.5 h-3.5" /> Governance Infrastructure
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</span>
                                        <span className="text-2xl font-black text-foreground">96</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary group-hover:underline">View Report</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Mock Report 3 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background overflow-hidden h-full">
                            <CardContent className="p-0">
                                <div className="p-6 pb-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                            <div className="h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-emerald-500"></div>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1 rounded bg-muted/40">1 hr ago</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">Uniswap</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 font-medium">
                                            <Key className="w-3.5 h-3.5" /> Decentralized Exchange
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Score</span>
                                        <span className="text-2xl font-black text-foreground">94</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary group-hover:underline">View Report</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    );
}
