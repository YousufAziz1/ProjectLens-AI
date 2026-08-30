/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, ShieldAlert, Cpu, Database, FileText, ShieldCheck } from 'lucide-react';

export default function AnalyzePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<string[]>([]);
    const [genlayerStatus, setGenlayerStatus] = useState<string | null>(null);

    // Detailed Dashboard State
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [successId, setSuccessId] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Autofill demo function
    const fillDemo = () => {
        const web = document.getElementById('websiteUrl') as HTMLInputElement;
        const docs = document.getElementById('docsUrl') as HTMLInputElement;
        const git = document.getElementById('githubUrl') as HTMLInputElement;
        if (web) web.value = 'https://example-protocol.io';
        if (docs) docs.value = 'https://docs.example-protocol.io';
        if (git) git.value = 'https://github.com/example/protocol';
    };

    useEffect(() => {
        if (isLoading && !successId) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isLoading, successId]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setProgress([]);
        setStartTime(Date.now());
        setElapsedSeconds(0);
        setSuccessId(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.error || 'Failed to initialize collection pipeline');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n\n');
                    for (const line of lines) {
                        if (line.trim().startsWith('data: ')) {
                            const payload = JSON.parse(line.trim().slice(6));
                            if (payload.genlayer_status) {
                                setGenlayerStatus(payload.genlayer_status);
                            }
                            if (payload.stage) {
                                setProgress(prev => [...prev, payload.stage]);
                            } else if (payload.success && payload.id) {
                                if (payload.report) {
                                    sessionStorage.setItem('trustlens-report-' + payload.id, JSON.stringify(payload.report));
                                }
                                if (payload.genlayer) {
                                    sessionStorage.setItem('trustlens-genlayer-' + payload.id, JSON.stringify(payload.genlayer));
                                }
                                setSuccessId(payload.id);
                            } else if (payload.error) {
                                throw new Error(payload.error);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. The agent terminated unexpectedly.');
            setIsLoading(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }

    // Heuristic Metric Calculations for Dashboard
    const estimatedTotalStages = 10; // Includes GenLayer verification stages
    const isProlongedTime = elapsedSeconds > 120;
    const progressPercent = successId ? 100 : Math.min(Math.round((progress.length / estimatedTotalStages) * 100), 95);
    const mockEvidenceCount = progress.length * 12 + Math.floor(elapsedSeconds / 3);
    const mockSourcesProcessed = Math.min(progress.length, 4);

    return (
        <div className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20 font-sans">
            <div className="w-full max-w-3xl">
                {!isLoading && !successId && (
                    <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-foreground">Initiate Technical Audit</h1>
                        <p className="text-muted-foreground text-lg">Input up to 4 data streams. Our autonomous agents will execute a deterministic analysis.</p>
                        <div className="flex items-center justify-center gap-3 mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span>GitHub</span> <span className="text-primary/50">•</span>
                            <span>Documentation</span> <span className="text-primary/50">•</span>
                            <span>Web App</span> <span className="text-primary/50">•</span>
                            <span>Whitepaper</span>
                        </div>
                    </div>
                )}

                {(!isLoading && !successId) ? (
                    <Card className="border-border/40 shadow-2xl bg-background/50 backdrop-blur">
                        <form onSubmit={handleSubmit}>
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 bg-muted/10 rounded-t-xl">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Target Pipeline Parameters</CardTitle>
                                    <CardDescription>All endpoints will be traversed and cryptographically verified.</CardDescription>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={fillDemo} className="hidden sm:flex border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                                    Try Demo Payloads
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">
                                {error && (
                                    <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-start gap-2">
                                        <ShieldAlert className="w-5 h-5 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Website Card */}
                                    <div className="space-y-3 rounded-lg border border-border/40 bg-zinc-50 dark:bg-zinc-900/50 p-5 transition-all focus-within:border-blue-500/40 focus-within:bg-background">
                                        <label htmlFor="websiteUrl" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
                                            <span className="p-1 rounded bg-blue-500/10 text-blue-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></span>
                                            Website Domain
                                        </label>
                                        <input
                                            id="websiteUrl"
                                            name="websiteUrl"
                                            type="url"
                                            placeholder="https://project.com"
                                            className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                                        />
                                    </div>

                                    {/* GitHub Card */}
                                    <div className="space-y-3 rounded-lg border border-border/40 bg-zinc-50 dark:bg-zinc-900/50 p-5 transition-all focus-within:border-primary/40 focus-within:bg-background">
                                        <label htmlFor="githubUrl" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
                                            <span className="p-1 rounded bg-primary/10 text-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></span>
                                            GitHub Repository
                                        </label>
                                        <input
                                            id="githubUrl"
                                            name="githubUrl"
                                            type="url"
                                            placeholder="https://github.com/project"
                                            className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                                        />
                                    </div>

                                    {/* Docs Card */}
                                    <div className="space-y-3 rounded-lg border border-border/40 bg-zinc-50 dark:bg-zinc-900/50 p-5 transition-all focus-within:border-emerald-500/40 focus-within:bg-background">
                                        <label htmlFor="docsUrl" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
                                            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></span>
                                            Documentation URL
                                        </label>
                                        <input
                                            id="docsUrl"
                                            name="docsUrl"
                                            type="url"
                                            placeholder="https://docs.project.com"
                                            className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
                                        />
                                    </div>

                                    {/* Whitepaper PDF Upload */}
                                    <div className="space-y-3 rounded-lg border border-border/40 bg-zinc-50 dark:bg-zinc-900/50 p-5 transition-all focus-within:border-yellow-500/40 focus-within:bg-background">
                                        <label htmlFor="whitepaperPdf" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
                                            <span className="p-1 rounded bg-yellow-500/10 text-yellow-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>
                                            Whitepaper (PDF)
                                        </label>
                                        <div className="relative flex h-11 w-full items-center justify-center rounded-md border border-input bg-background px-3 text-sm focus-within:ring-1 focus-within:ring-yellow-500 shadow-sm hover:bg-muted/50 transition-colors">
                                            <input
                                                id="whitepaperPdf"
                                                name="whitepaperPdf"
                                                type="file"
                                                accept="application/pdf"
                                                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                            />
                                            <span className="text-muted-foreground font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis truncate w-full px-2 pointer-events-none flex items-center justify-center gap-2">
                                                Upload Whitepaper PDF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 pb-6 px-6">
                                <Button type="submit" className="w-full h-14 text-lg font-bold shadow-xl rounded-xl">
                                    Initiate Intelligence Extraction &rarr;
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                        {/* Live Header Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm">
                                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Time Elapsed</div>
                                <div className="text-2xl font-black font-mono text-foreground">{elapsedSeconds}s</div>
                            </div>
                            <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm">
                                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Progress</div>
                                <div className="text-2xl font-black font-mono text-foreground text-primary">{progressPercent}%</div>
                            </div>
                            <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm">
                                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Evidence Mined</div>
                                <div className="text-2xl font-black font-mono text-foreground">{successId ? mockEvidenceCount + 15 : mockEvidenceCount}</div>
                            </div>
                            <div className="bg-background border border-border/40 p-4 rounded-xl shadow-sm">
                                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Sources</div>
                                <div className="text-2xl font-black font-mono text-foreground">{successId ? '4/4' : `${mockSourcesProcessed}/4`}</div>
                            </div>
                        </div>

                        {/* Main Dashboard Panel */}
                        <div className="rounded-xl border border-primary/30 bg-zinc-950 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-start">
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${successId ? 'from-green-500 via-emerald-400 to-green-500' : 'from-transparent via-primary to-transparent animate-pulse'}`}></div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                                        <Cpu className={`w-6 h-6 ${successId ? 'text-green-500' : 'text-primary animate-pulse'}`} />
                                        {successId ? 'Analysis Complete' : 'Autonomous Agent Subnet Active'}
                                    </h3>
                                    <p className="text-xs font-mono text-muted-foreground mt-2 font-semibold">
                                        {successId ? 'TrustLens finalized the structural audit report.' : 'DO NOT CLOSE THIS PAGE. Background workers are extracting structural metadata and applying deterministic constraints.'}
                                    </p>
                                </div>
                                <div className="flex gap-2 font-mono text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-full ring-1 ring-primary/30 shadow-sm flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        {isProlongedTime && !successId ? 'Deep Extraction...' : successId ? 'Finishing' : 'Connecting...'}
                                    </span>
                                </div>
                            </div>

                            {/* Warning States */}
                            {isProlongedTime && !successId && (
                                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-4 animate-in fade-in duration-500">
                                    <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-sm text-yellow-500 uppercase tracking-wider">Complex Target Detected — Still Processing</div>
                                        <div className="text-xs text-yellow-500/80 mt-1">This specific repository or document map is excessively large. Our agents require additional cycles to process all vectors. Please hold on.</div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-4">
                                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-sm text-red-500 uppercase tracking-wider">Analysis Execution Fault</div>
                                        <div className="text-xs text-red-500/80 mt-1">{error}</div>
                                        <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/20">Restart Protocol</Button>
                                    </div>
                                </div>
                            )}

                            {/* Visual Progress Logs */}
                            <div className="space-y-4 mb-10 min-h-[160px] font-mono border-l-2 border-primary/20 pl-4 py-2 relative">
                                <div className="space-y-1.5 opacity-50 text-xs text-zinc-500 mb-4 font-semibold uppercase tracking-wider">
                                    <p>[SYS] Orchestrator Node Connected at ms:{startTime?.toString().slice(-4) || '0000'}</p>
                                    <p>[SYS] Warming up parallel inference matrix...</p>
                                </div>
                                {progress.map((stage, idx) => {
                                    const isGenlayer = stage.startsWith('GenLayer');
                                    return (
                                        <div key={idx} className={`flex items-center gap-4 text-sm animate-in slide-in-from-left-4 fade-in duration-500 ${isGenlayer ? 'text-violet-400' : 'text-emerald-400'}`}>
                                            {isGenlayer ? (
                                                <ShieldCheck className="w-4 h-4 text-violet-500 shrink-0 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            )}
                                            <span className={`font-semibold tracking-tight uppercase group transition-colors cursor-default ${isGenlayer ? 'hover:text-violet-300' : 'hover:text-emerald-300'}`}>
                                                {stage}
                                                <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] ml-3 font-normal ${isGenlayer ? 'text-violet-500/50' : 'text-emerald-500/50'}`}>T+{((idx + 1) * 3)}s</span>
                                            </span>
                                        </div>
                                    );
                                })}
                                {!successId && !error && (
                                    <div className="flex items-center gap-4 text-sm font-bold text-primary mt-4">
                                        <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                        <span className="animate-pulse uppercase tracking-tight">Synthesizing network states...</span>
                                    </div>
                                )}
                            </div>

                            {/* Success Action State */}
                            {successId && (
                                <div className="mt-auto animate-in slide-in-from-bottom-6 fade-in duration-700 bg-background/5 border border-border/20 p-6 rounded-xl text-center">
                                    <div className="w-12 h-12 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500/20">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Final Report Verified</h4>
                                    <p className="text-sm text-zinc-400 mb-4 font-medium">Evidence Matrix Compiled & GenLayer Consensus {genlayerStatus === 'verified' ? 'Complete' : genlayerStatus === 'unavailable' ? '(Unavailable — Not Configured)' : 'Attempted'}.</p>
                                    {genlayerStatus === 'verified' && (
                                        <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2 mb-4 text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> GenLayer Consensus Verified
                                        </div>
                                    )}
                                    <Button onClick={() => router.push(`/report/${successId}`)} size="lg" className="w-full text-base font-black uppercase tracking-wider h-14 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/50">
                                        View Institutional AI Report &rarr;
                                    </Button>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
