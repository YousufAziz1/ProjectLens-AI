import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Terminal, Copy, Clock, Play } from 'lucide-react';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-8 h-8 text-primary" />
                            <h1 className="text-4xl font-black tracking-tight text-foreground">Developer API</h1>
                        </div>
                        <Link href="/analyze" className={buttonVariants({ variant: 'outline', className: 'gap-2 font-bold bg-background' })}>
                            <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" /> Live API Playground
                        </Link>
                    </div>
                    <p className="text-muted-foreground max-w-xl font-medium">
                        Programmatically interact with the TrustLens autonomous AI subnet. Submit audits, extract granular evidence chains, and build deterministic UI on top.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-mono text-[10px] text-blue-500 bg-blue-500/10 border-blue-500/20 px-2 py-0.5">OpenAPI 3.1 Compatible</Badge>
                    <Badge variant="secondary" className="font-mono text-[10px] text-orange-500 bg-orange-500/10 border-orange-500/20 px-2 py-0.5">REST API</Badge>
                    <Badge variant="secondary" className="font-mono text-[10px] text-green-500 bg-green-500/10 border-green-500/20 px-2 py-0.5">JSON</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-center flex flex-col items-center justify-center">
                        <p className="font-black text-3xl text-foreground">99.9%</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Uptime</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-center flex flex-col items-center justify-center">
                        <p className="font-black text-3xl text-foreground">3</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">AI Agents</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-center flex flex-col items-center justify-center">
                        <p className="font-black text-3xl text-foreground">24</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Evidence Sources</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-center flex flex-col items-center justify-center">
                        <p className="font-black text-3xl text-foreground">18s</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Avg Runtime</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="border-border/40 shadow-sm bg-background">
                        <CardContent className="p-5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Official SDKs</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold mb-1">JavaScript</p>
                                    <code className="text-xs font-mono bg-zinc-950 p-2.5 rounded block text-zinc-300 border border-border/40 shadow-inner">npm install trustlens-sdk</code>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold mb-1">Python</p>
                                    <code className="text-xs font-mono bg-zinc-950 p-2.5 rounded block text-zinc-300 border border-border/40 shadow-inner">pip install trustlens</code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40 shadow-sm bg-background">
                        <CardContent className="p-5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Global Rate Limits</h3>
                            <ul className="space-y-3 text-sm font-medium">
                                <li className="flex justify-between items-center border-b border-border/40 pb-2"><span>API Quota</span> <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">100 req/min</span></li>
                                <li className="flex justify-between items-center border-b border-border/40 pb-2"><span>File Upload</span> <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">10 MB max</span></li>
                                <li className="flex justify-between items-center border-b border-border/40 pb-2 border-transparent"><span>PDF Processing</span> <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded">20 pages max</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Endpoints</h2>
                    <Card className="border-border/40 shadow-sm overflow-hidden bg-background">
                        <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-green-500/10 text-green-600 border border-green-500/20 shadow-sm font-black tracking-widest">POST</Badge>
                                <span className="font-mono text-sm font-semibold">/api/v1/analyze</span>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs">v1.2.0</Badge>
                        </div>
                        <CardContent className="p-6 space-y-8">

                            {/* Authentication */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                                    Authentication
                                    <Copy className="w-3.5 h-3.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                                </h3>
                                <div className="bg-zinc-950 p-4 rounded-lg border border-border/40 font-mono text-sm text-zinc-300 shadow-inner">
                                    <code>Authorization: Bearer YOUR_API_KEY</code>
                                </div>
                            </div>

                            {/* Payload Table */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payload Parameters</h3>
                                <div className="rounded-lg border border-border/40 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                            <tr><th className="px-4 py-3">Field</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Description</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 bg-background text-foreground">
                                            <tr><td className="px-4 py-3 font-mono text-primary">github_url</td><td className="px-4 py-3 font-mono text-xs">string</td><td className="px-4 py-3 font-medium">Repository URL to clone & scan (Required)</td></tr>
                                            <tr><td className="px-4 py-3 font-mono text-primary">docs_url</td><td className="px-4 py-3 font-mono text-xs">string</td><td className="px-4 py-3 font-medium">Documentation URL (Optional)</td></tr>
                                            <tr><td className="px-4 py-3 font-mono text-primary">whitepaper_pdf</td><td className="px-4 py-3 font-mono text-xs">file</td><td className="px-4 py-3 font-medium">Optional PDF encoded as Base64</td></tr>
                                            <tr><td className="px-4 py-3 font-mono text-primary">deep_scan</td><td className="px-4 py-3 font-mono text-xs">boolean</td><td className="px-4 py-3 font-medium">Enables extended AST tracing</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* cURL Example */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                                    cURL Example
                                    <Copy className="w-3.5 h-3.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                                </h3>
                                <div className="bg-zinc-950 p-4 rounded-lg border border-border/40 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
                                    <pre><code>{`curl -X POST https://api.trustlens.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "github_url": "https://github.com/project/repo",
    "docs_url": "https://docs.project.com",
    "deep_scan": true
  }'`}</code></pre>
                                </div>
                            </div>

                            {/* Async / Webhook Info Box */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-6">
                                <div className="border border-border/40 rounded-lg p-5 bg-muted/20 relative shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Average Response Time</h4>
                                    <p className="text-3xl font-black text-foreground">18<span className="text-muted-foreground text-lg font-medium"> – 35s</span></p>
                                    <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed">Due to deep agent logic overhead, asynchronous webhook pinging is highly recommended.</p>
                                </div>
                                <div className="border border-border/40 rounded-lg p-5 bg-muted/20 relative font-mono text-xs overflow-x-auto shadow-sm">
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans flex items-center gap-2">Webhook / Async Flow</h4>
                                    <div className="text-zinc-500 dark:text-zinc-400 space-y-1.5 font-semibold">
                                        <p>POST /api/v1/analyze</p>
                                        <p className="text-primary pl-4">↳ returns {`{"report_id": "xyz"}`}</p>
                                        <p>GET /api/v1/report/{"{id}"}</p>
                                        <p className="text-emerald-500 pl-4">↳ returns {`{"status": "completed", ...}`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Response Payload */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                                    Successful Response
                                    <Copy className="w-3.5 h-3.5 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                                </h3>
                                <div className="bg-zinc-950 p-4 rounded-lg border border-border/40 font-mono text-sm text-green-400 overflow-x-auto shadow-inner">
                                    <pre><code>{`{
  "status": "success",
  "data": {
    "report_id": "94a3-7bf1-22cd",
    "score": 94,
    "agents_deployed": 3,
    "confidence_interval": "high",
    "risks": [],
    "evidence_chain": [
      {
        "evidence_id": "ev_01H8XDKP",
        "source": "GitHub",
        "validated": true
      }
    ]
  }
}`}</code></pre>
                                </div>
                            </div>

                            {/* Status Codes */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HTTP Status Codes</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm font-mono">
                                    <div className="border border-green-500/30 rounded p-3 flex justify-between bg-green-500/10 text-green-700 dark:text-green-500"><span className="font-bold">200</span><span>OK</span></div>
                                    <div className="border border-border/40 rounded p-3 flex justify-between bg-muted/50 text-foreground/80"><span className="font-bold">400</span><span>Bad Request</span></div>
                                    <div className="border border-border/40 rounded p-3 flex justify-between bg-muted/50 text-foreground/80"><span className="font-bold">404</span><span>Source Not Found</span></div>
                                    <div className="border border-yellow-500/30 rounded p-3 flex justify-between bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"><span className="font-bold">429</span><span>Rate Limited</span></div>
                                    <div className="border border-red-500/30 rounded p-3 flex justify-between bg-red-500/10 text-red-700 dark:text-red-500"><span className="font-bold">500</span><span>Server Error</span></div>
                                </div>
                            </div>

                            {/* Response Schema */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Response Schema</h3>
                                <div className="bg-zinc-950 p-4 rounded-lg border border-border/40 font-mono text-sm text-zinc-400 overflow-x-auto shadow-inner leading-relaxed">
                                    <pre><code>{`Report
├── score (0-100)
├── findings
│   ├── strengths[]
│   └── weaknesses[]
├── evidence_chain
│   ├── source_hash
│   └── validated
├── confidence
└── recommendations`}</code></pre>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
