/* eslint-disable */
import { Card, CardContent } from '@/components/ui/card';
import { Database, BrainCircuit, Search, BarChart3, ShieldCheck, ArrowDown } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-16">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">How TrustLens Works</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                        A fully deterministic, multi-agent artificial intelligence network built to automate complex Web3 security due diligence.
                    </p>
                </div>

                <div className="relative max-w-2xl mx-auto">

                    {/* The line connecting everything */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent -translate-x-1/2"></div>

                    {/* Data Layer */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center mb-16 group">
                        <div className="w-16 h-16 bg-background border-2 border-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                            <Database className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold bg-background px-4 py-1 rounded shadow-sm border border-border/40 z-10">Data Layer</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-3 max-w-xs bg-background/80 backdrop-blur p-2 rounded">
                            Ingests raw GitHub sources, unstructured GitBook docs, and PDF whitepapers concurrently.
                        </p>
                    </div>

                    {/* Agents */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center mb-16 group">
                        <div className="w-16 h-16 bg-background border-2 border-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold bg-background px-4 py-1 rounded shadow-sm border border-border/40 z-10">Research Agents</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-3 max-w-xs bg-background/80 backdrop-blur p-2 rounded">
                            Specialized AI models independently analyze Code Quality, Protocol Architecture, and Risk Patterns.
                        </p>
                    </div>

                    {/* Evidence */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center mb-16 group">
                        <div className="w-16 h-16 bg-background border-2 border-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold bg-background px-4 py-1 rounded shadow-sm border border-border/40 z-10">Evidence Engine</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-3 max-w-xs bg-background/80 backdrop-blur p-2 rounded">
                            Cross-validates claims between modules, discarding hallucinated data and securing chronological logs.
                        </p>
                    </div>

                    {/* Risk Scoring */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center mb-16 group">
                        <div className="w-16 h-16 bg-background border-2 border-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold bg-background px-4 py-1 rounded shadow-sm border border-border/40 z-10">Risk Scoring</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-3 max-w-xs bg-background/80 backdrop-blur p-2 rounded">
                            Deterministically calculates health confidence interval based strictly on proven evidence trails.
                        </p>
                    </div>

                    {/* Report Output */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center group">
                        <div className="w-16 h-16 bg-primary text-primary-foreground border-4 border-background rounded-2xl flex items-center justify-center ring-2 ring-primary shadow-xl mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold bg-primary text-primary-foreground px-4 py-1 rounded shadow-sm z-10">Audit Report Delivered</h2>
                        <p className="text-sm font-medium text-muted-foreground mt-3 max-w-xs bg-background/80 backdrop-blur p-2 rounded">
                            Actionable final output rendered in an intuitive, transparent enterprise UI format.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
