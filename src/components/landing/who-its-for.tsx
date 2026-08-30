const personas = [
    {
        title: 'Web3 Investors',
        description: 'Avoid risky projects before investing.',
        icon: '🛡'
    },
    {
        title: 'Airdrop Hunters',
        description: 'Analyze protocols before farming.',
        icon: '🎯'
    },
    {
        title: 'Developers',
        description: 'Get automated code & architecture reviews.',
        icon: '👨‍💻'
    },
    {
        title: 'Grant Committees',
        description: 'Verify technical claims with evidence.',
        icon: '🏛'
    },
    {
        title: 'Hackathon Judges',
        description: 'Quickly evaluate hundreds of submissions.',
        icon: '⚡'
    }
];

export function WhoItsFor() {
    return (
        <section className="border-t border-border/40 px-4 py-20 sm:py-24 bg-background">
            <div className="mx-auto max-w-screen-xl">
                <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    Who Uses TrustLens-AI?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-center text-lg text-muted-foreground">
                    Built for the core pillars of the decentralized ecosystem.
                </p>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center max-w-5xl mx-auto">
                    {personas.map((persona) => (
                        <div
                            key={persona.title}
                            className="flex flex-col p-6 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors shadow-sm"
                        >
                            <div className="text-3xl mb-3">{persona.icon}</div>
                            <h3 className="text-lg font-bold text-foreground mb-2">{persona.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{persona.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
