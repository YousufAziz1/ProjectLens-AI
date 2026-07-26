import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
    {
        title: 'Smart Contract Analysis',
        description: 'Examine deployment scripts, architecture patterns, and standard compliance.',
    },
    {
        title: 'Tokenomics Review',
        description: 'Extract emission schedules, vesting cliffs, and utility claims.',
    },
    {
        title: 'GitHub Activity',
        description: 'Evaluate true developer retention and commit footprint natively.',
    },
    {
        title: 'Team Transparency',
        description: 'Measure public associations and documented contributor origins.',
    },
    {
        title: 'Documentation Verification',
        description: 'Cross-reference protocol claims with deployable code structures.',
    },
    {
        title: 'Security Signals',
        description: 'Identify un-audited proxy endpoints and admin key exposures.',
    }
];

export function CoreFeatures() {
    return (
        <section className="border-t border-border/40 px-4 py-20 sm:py-24 bg-zinc-50 dark:bg-zinc-900/5">
            <div className="mx-auto max-w-screen-xl">
                <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    Built for Web3 Complexity
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-center text-lg text-muted-foreground">
                    Generic AI models fail at decentralized edge cases. Our specialized agents thrive on structural verification.
                </p>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-border/60 hover:border-primary/30 transition-colors shadow-sm bg-background">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <CardTitle className="text-base">{feature.title}</CardTitle>
                                </div>
                                <CardDescription className="text-sm leading-relaxed text-muted-foreground font-medium pt-1">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
