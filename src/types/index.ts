export interface GitHubCommit {
    sha: string;
    message: string;
    date: string;
    author: string;
}

export interface GitHubData {
    owner: string;
    repo: string;
    name: string;
    description: string;
    readme: string;
    stars: number;
    forks: number;
    openIssues: number;
    license: string | null;
    contributorsCount: number;
    releases: number;
    lastCommitDate: string | null;
    recentCommits: GitHubCommit[];
}

export interface CollectorMetadata {
    url?: string;
    fetchTimeMs?: number;
    contentLength?: number;
    cacheHit?: boolean;
    [key: string]: string | number | boolean | undefined;
}

export interface CollectorOutput<T = unknown> {
    source: 'github' | 'website' | 'documentation' | 'whitepaper';
    status: 'success' | 'failed';
    collectedAt: string; // ISO 8601 timestamp
    metadata: CollectorMetadata;
    data: T | null;
    error: string | null;
}

export interface UnifiedCollectorInput {
    websiteUrl?: string;
    docsUrl?: string;
    githubUrl?: string;
    whitepaperBuffer?: Buffer;
}

export interface UnifiedCollectorOutput {
    id: string; // Unique ID for the collection
    website: CollectorOutput<string> | null;
    documentation: CollectorOutput<string> | null;
    github: CollectorOutput<GitHubData> | null;
    whitepaper: CollectorOutput<string> | null;
}

// Storage abstraction interface
export interface StorageProvider {
    saveCollection(id: string, data: UnifiedCollectorOutput): Promise<void>;
    getCollection(id: string): Promise<UnifiedCollectorOutput | null>;
}
