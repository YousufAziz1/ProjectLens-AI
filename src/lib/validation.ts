export function validateUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

export function validateGitHubUrl(url: string | undefined): boolean {
    if (!url) return false;
    if (!validateUrl(url)) return false;

    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname !== 'github.com') return false;

        const parts = parsedUrl.pathname.split('/').filter(Boolean);
        return parts.length >= 2; // Needs at least owner and repo
    } catch {
        return false;
    }
}

export function extractGitHubOwnerAndRepo(url: string): { owner: string; repo: string } | null {
    if (!validateGitHubUrl(url)) return null;

    try {
        const parsedUrl = new URL(url);
        const parts = parsedUrl.pathname.split('/').filter(Boolean);
        return { owner: parts[0], repo: parts[1] };
    } catch {
        return null;
    }
}

export function validatePdf(file: File | undefined): boolean {
    if (!file) return false;
    if (file.type !== 'application/pdf') return false;

    // Max size 20MB
    const MAX_SIZE = 20 * 1024 * 1024;
    return file.size <= MAX_SIZE;
}
