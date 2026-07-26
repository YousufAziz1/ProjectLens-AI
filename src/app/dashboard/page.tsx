import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, CheckCircle2, AlertTriangle, Blocks, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            <div className="border-b border-border/40 bg-background/50 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20"></span>
                        <h1 className="text-xl font-bold tracking-tight">Live Defense Matrix</h1>
                    </div>
                    <div className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Network: Arbitrum One
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Diagnostics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card className="border-border/40 shadow-sm overflow-hidden bg-background">
                        <div className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
                            <p className="text-xs font-bold tracking-widest uppercase opacity-70 mb-2">Target Protocol</p>
                            <h2 className="text-lg font-mono font-bold truncate">https://github.com/project</h2>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Health Score</p>
                                    <div className="text-3xl font-black text-foreground flex items-end gap-1">94<span className="text-sm text-muted-foreground mb-1">/100</span></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Risk Level</p>
                                    <Badge className="bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 mt-1 font-black shadow-sm">LOW</Badge>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-border/40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Agents Running</p>
                                    <div className="text-lg font-black text-foreground">3 / 3</div>
                                    <div className="flex gap-1 mt-2">
                                        <div className="h-1.5 w-full bg-primary rounded-full"></div>
                                        <div className="h-1.5 w-full bg-primary rounded-full"></div>
                                        <div className="h-1.5 w-full bg-primary rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 shadow-sm">
                        <CardHeader className="pb-3 border-b border-border/40 mb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Security Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Smart Contract
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded shadow-sm border border-green-500/20">Passed</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Documentation
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded shadow-sm border border-green-500/20">Verified</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    GitHub Activity
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded shadow-sm border border-green-500/20">Healthy</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    Tokenomics
                                </div>
                                <span className="text-xs font-bold text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded shadow-sm border border-yellow-500/20">Review</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="pt-2 text-center">
                        <Link href="/report/demo-fallback-id">
                            <button className="w-full bg-foreground text-background font-bold text-sm h-10 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                                View Final Master Report →
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Right Column: AI Agent Telemetry */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-lg font-black flex items-center gap-2 border-b border-border/40 pb-4">
                        <Terminal className="w-5 h-5 text-primary" /> Active Subnet Orchestration
                    </h2>

                    <div className="grid gap-4">
                        {/* Agent 1 */}
                        <div className="border border-border/40 bg-background rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-base">GitHub Agent</h3>
                                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse ring-2 ring-blue-500/20"></span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">ID: AGT-9422-GH</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-muted/30 text-blue-500 border-blue-500/30">Active</Badge>
                            </div>
                            <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border/40 font-mono text-xs text-foreground/80 flex items-center gap-2">
                                <span className="text-blue-500 font-bold">{'>'}</span> Analyzing commit history and isolated pull requests...
                            </div>
                        </div>

                        {/* Agent 2 */}
                        <div className="border border-border/40 bg-background rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-base">Documentation Agent</h3>
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20"></span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">ID: AGT-9422-DC</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-muted/30 text-emerald-500 border-emerald-500/30">Active</Badge>
                            </div>
                            <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border/40 font-mono text-xs text-foreground/80 flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">{'>'}</span> Validating architectural claims across GitBook structures...
                            </div>
                        </div>

                        {/* Agent 3 */}
                        <div className="border border-border/40 bg-background rounded-xl p-5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-base">Security Agent</h3>
                                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse ring-2 ring-yellow-500/20"></span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">ID: AGT-9422-SC</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-muted/30 text-yellow-500 border-yellow-500/30">Active</Badge>
                            </div>
                            <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border/40 font-mono text-xs text-foreground/80 flex items-center gap-2">
                                <span className="text-yellow-500 font-bold">{'>'}</span> Checking for reentrancy vectors and access control vulnerabilities...
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
