export function ProjectLensLogo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Outer Lens/Aperture */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" strokeDasharray="30 10" className="animate-[spin_20s_linear_infinite]" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" opacity="0.3" />

            {/* Neural Network Core */}
            <circle cx="35" cy="40" r="5" fill="currentColor" />
            <circle cx="65" cy="40" r="5" fill="currentColor" />
            <circle cx="50" cy="65" r="5" fill="currentColor" />
            <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />

            {/* Neural Network Connections */}
            <path d="M35 40L50 50L65 40" stroke="currentColor" strokeWidth="2.5" />
            <path d="M50 50L50 65" stroke="currentColor" strokeWidth="2.5" />

            <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite_reverse]" />
        </svg>
    )
}
