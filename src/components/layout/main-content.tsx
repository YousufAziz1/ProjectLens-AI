import type { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
    return (
        <main className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
    );
}
