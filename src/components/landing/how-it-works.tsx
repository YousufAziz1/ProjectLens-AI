const steps = [
    {
        number: '01',
        title: 'Connect Project Sources',
        description: 'Submit GitHub, documentation, website, or whitepaper sources.',
    },
    {
        number: '02',
        title: 'Autonomous AI Analysis',
        description: 'Specialized AI agents analyze different technical layers.',
    },
    {
        number: '03',
        title: 'Evidence-Based Report',
        description: 'Receive scores, risks, findings, and source-backed evidence.',
    },
];

export function HowItWorks() {
    return (
        <section className="border-t border-border/40 px-4 py-20 sm:py-24">
            <div className="mx-auto max-w-screen-xl">
                <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How It Works</h2>
                <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
                    Three steps to a complete project analysis.
                </p>

                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col">
                            <span className="text-sm font-mono font-medium text-muted-foreground">
                                {step.number}
                            </span>
                            <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
