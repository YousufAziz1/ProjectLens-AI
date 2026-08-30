import { extractGitHubOwnerAndRepo } from '../validation';
import { CollectorOutput, CollectorMetadata, GitHubData, GitHubCommit } from '@/types';

// In-memory cache for GitHub API responses to prevent rate limiting issues
// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION_MS = 5 * 60 * 1000;
const responseCache = new Map<string, { timestamp: number; data: CollectorOutput<GitHubData> }>();

export async function collectFromGitHub(url: string): Promise<CollectorOutput<GitHubData>> {
    const startTime = Date.now();
    const metadata: CollectorMetadata = { url, cacheHit: false };

    // Check Cache
    const cacheKey = url.toLowerCase();
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        metadata.cacheHit = true;
        metadata.fetchTimeMs = 0;
        return {
            ...cached.data,
            metadata: { ...cached.data.metadata, ...metadata } // Update metadata with cache hit info
        };
    }

    const repoInfo = extractGitHubOwnerAndRepo(url);

    if (!repoInfo) {
        return {
            source: 'github',
            status: 'failed',
            collectedAt: new Date().toISOString(),
            metadata,
            data: null,
            error: 'Invalid GitHub repository URL',
        };
    }

    const { owner, repo } = repoInfo;
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TrustLens-AI-Collector'
    };

    try {
        // 1. Base Repo Info
        const repoRes = await fetch(baseUrl, { headers, signal: AbortSignal.timeout(10000) });
        if (repoRes.status === 403 || repoRes.status === 429) {
            return {
                source: 'github',
                status: 'failed',
                collectedAt: new Date().toISOString(),
                metadata: { ...metadata, fetchTimeMs: Date.now() - startTime },
                data: null,
                error: {
                    code: 'API_RATE_LIMIT',
                    message: 'GitHub API rate limit reached. Please try again later.',
                    provider: 'GitHub'
                },
            };
        }
        if (!repoRes.ok) throw new Error(`Repository not found (${repoRes.status})`);

        const repoData = await repoRes.json();

        // 2. Fetch concurrent data pieces to be faster
        const [readmeRes, contributorsRes, releasesRes, commitsRes] = await Promise.allSettled([
            fetch(`${baseUrl}/readme`, { headers, signal: AbortSignal.timeout(5000) }),
            fetch(`${baseUrl}/contributors?per_page=1&anon=1`, { headers, signal: AbortSignal.timeout(5000) }), // Hack to get total count from link header if paginated, else count array
            fetch(`${baseUrl}/releases?per_page=1`, { headers, signal: AbortSignal.timeout(5000) }),
            fetch(`${baseUrl}/commits?per_page=30`, { headers, signal: AbortSignal.timeout(5000) }) // Last 30 commits
        ]);

        // Parse README
        let readmeText = '';
        if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
            const readmeJson = await readmeRes.value.json();
            if (readmeJson.content) {
                readmeText = Buffer.from(readmeJson.content, 'base64').toString('utf-8');
            }
        }

        // Parse Contributors Count (basic estimation without heavy pagination)
        let contributorsCount = 0;
        if (contributorsRes.status === 'fulfilled' && contributorsRes.value.ok) {
            const linkHeader = contributorsRes.value.headers.get('link');
            if (linkHeader) {
                // Parse last page number from link header
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (match) contributorsCount = parseInt(match[1]);
            } else {
                const contributorsJson = await contributorsRes.value.json();
                contributorsCount = contributorsJson.length || 0;
            }
        }

        // Parse Releases Count
        let releasesCount = 0;
        if (releasesRes.status === 'fulfilled' && releasesRes.value.ok) {
            const linkHeader = releasesRes.value.headers.get('link');
            if (linkHeader) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (match) releasesCount = parseInt(match[1]);
            } else {
                const releasesJson = await releasesRes.value.json();
                releasesCount = releasesJson.length || 0;
            }
        }

        // Parse Commits
        let lastCommitDate = null;
        const recentCommits: GitHubCommit[] = [];
        if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
            const commitsJson = await commitsRes.value.json();
            if (Array.isArray(commitsJson) && commitsJson.length > 0) {
                lastCommitDate = commitsJson[0].commit?.author?.date || null;

                // Take up to 30 commits
                for (const commitItem of commitsJson) {
                    recentCommits.push({
                        sha: commitItem.sha,
                        message: commitItem.commit?.message || '',
                        date: commitItem.commit?.author?.date || '',
                        author: commitItem.commit?.author?.name || 'Unknown'
                    });
                }
            }
        }

        // Calculate metadata
        metadata.fetchTimeMs = Date.now() - startTime;
        metadata.contentLength = JSON.stringify(repoData).length + readmeText.length;

        const result: CollectorOutput<GitHubData> = {
            source: 'github',
            status: 'success',
            collectedAt: new Date().toISOString(),
            metadata,
            data: {
                owner,
                repo,
                name: repoData.name,
                description: repoData.description || '',
                readme: readmeText,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                openIssues: repoData.open_issues_count,
                license: repoData.license?.name || null,
                contributorsCount,
                releases: releasesCount,
                lastCommitDate,
                recentCommits
            },
            error: null
        };

        // Store in cache
        responseCache.set(cacheKey, { timestamp: Date.now(), data: result });

        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching GitHub data';
        return {
            source: 'github',
            status: 'failed',
            collectedAt: new Date().toISOString(),
            metadata: { ...metadata, fetchTimeMs: Date.now() - startTime },
            data: null,
            error: errorMessage,
        };
    }
}
