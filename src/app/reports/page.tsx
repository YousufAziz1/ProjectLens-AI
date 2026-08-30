import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, BookOpen, Key, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Latest AI Audits</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto font-medium">
                        Public ledger of completely transparent, evidence-backed security reports generated autonomously by the TrustLens network.
                    </p>
                </div>

                <div className="grid gap-4">
                    {/* Mock Report 1 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                        <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Predict Oracle</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                                            <ShieldAlert className="w-3.5 h-3.5" /> High TVL Framework
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto h-full border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Score</p>
                                    <div className="text-3xl font-black text-foreground">91<span className="text-sm text-primary/80">/100</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Mock Report 2 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                        <div className="h-6 w-6 rounded border-2 border-purple-500 mix-blend-screen"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Arbitrum DAO</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                                            <BookOpen className="w-3.5 h-3.5" /> Governance Infrastructure
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto h-full border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Score</p>
                                    <div className="text-3xl font-black text-foreground">96<span className="text-sm text-primary/80">/100</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Mock Report 3 */}
                    <Link href="/report/demo-fallback-id">
                        <Card className="border-border/40 shadow-sm hover:border-primary/50 transition-colors group cursor-pointer bg-background">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                        <div className="h-0 w-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[18px] border-b-emerald-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Uniswap</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1 font-medium">
                                            <Key className="w-3.5 h-3.5" /> Decentralized Exchange
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto h-full border-t sm:border-t-0 sm:border-l border-border/40 pt-4 sm:pt-0 sm:pl-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Overall Score</p>
                                    <div className="text-3xl font-black text-foreground">94<span className="text-sm text-primary/80">/100</span></div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
