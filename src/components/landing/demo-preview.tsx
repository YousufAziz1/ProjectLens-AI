'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STAGES = [
    "Collecting Project Data",
    "GitHub Agent Analysis",
    "Documentation Intelligence",
    "Security Pattern Detection",
    "Evidence Extraction",
    "Risk Score Generation",
    "Final Audit Report"
];

export function DemoPreview() {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        let isMounted = true;
        let timeout: NodeJS.Timeout;

        const runAnimation = () => {
            setCurrentStage(0);

            const scheduleNext = (step: number) => {
                if (!isMounted) return;

                if (step <= STAGES.length) {
                    setCurrentStage(step);
                    if (step < STAGES.length) {
                        // random delay between 600ms and 1200ms per stage execution
                        const delay = Math.random() * 600 + 600;
                        timeout = setTimeout(() => scheduleNext(step + 1), delay);
                    } else {
                        // restart after 5 seconds
                        timeout = setTimeout(runAnimation, 5000);
                    }
                }
            };

            timeout = setTimeout(() => scheduleNext(1), 1000);
        };

        runAnimation();

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, []);

    return (
        <section className="px-4 py-16 sm:py-24 border-t border-border/40">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">See ProjectLens AI in Action</h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Watch how our autonomous agents securely execute a pipeline and report findings.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-5 items-start">
                    {/* Execution Terminal */}
                    <Card className={`md:col-span-3 border-border/40 bg-muted/20 overflow-hidden transition-all duration-700 ${currentStage > 0 && currentStage < STAGES.length ? 'shadow-[0_0_30px_rgba(34,197,94,0.15)] border-green-500/20' : 'shadow-sm'}`}>
                        <div className="h-10 border-b border-border/40 bg-muted/40 flex items-center px-4 gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                            <span className="ml-2 text-xs font-mono text-muted-foreground">projectlens-pipeline-sh</span>
                        </div>
                        <CardContent className="p-6 font-mono text-sm">
                            <div className="flex flex-col gap-3">
                                <div className="text-muted-foreground">
                                    <span className="text-primary mr-2">$</span>
                                    onchainos invoke pipeline --target https://github.com/okx/example
                                </div>
                                <div className="mt-2 space-y-2">
                                    {STAGES.map((stage, idx) => {
                                        const isCompleted = currentStage > idx;
                                        const isActive = currentStage === idx;
                                        const isWaiting = currentStage < idx;

                                        if (isWaiting) return null;

                                        return (
                                            <div key={stage} className={`flex items-center gap-3 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                                {isCompleted ? (
                                                    <svg className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="h-4 w-4 rounded-full border-2 border-primary/50 text-transparent animate-spin shrink-0 flex items-center justify-center border-t-primary"></span>
                                                )}
                                                <span className={isCompleted ? "text-foreground" : "text-primary animate-pulse"}>
                                                    {stage}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Score Component */}
                    <Card className={`md:col-span-2 border-border/40 shadow-lg transition-all duration-700 transform ${currentStage >= STAGES.length ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-4 opacity-0 blur-sm pointer-events-none'}`}>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Project Health Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-6 gap-4">
                                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-green-500/10">
                                    <div className="absolute inset-0 rounded-full border-[8px] border-green-500/20"></div>
                                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-green-500"
                                            strokeDasharray="351.858"
                                            strokeDashoffset={351.858 * (1 - 94 / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="text-4xl font-bold text-green-500">94</span>
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold text-lg text-foreground">Exceeds OKX Standards</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        No critical vulnerabilities detected.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
