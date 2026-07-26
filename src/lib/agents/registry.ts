import { z } from 'zod';
import { BaseAgent } from './base-agent';

class AgentRegistry {
    private agents: Map<string, BaseAgent<unknown, z.ZodTypeAny>> = new Map();

    register(agent: BaseAgent<unknown, z.ZodTypeAny>) {
        if (this.agents.has(agent.name)) {
            throw new Error(`Agent with name ${agent.name} is already registered.`);
        }
        this.agents.set(agent.name, agent);
    }

    getAgent(name: string): BaseAgent<unknown, z.ZodTypeAny> | undefined {
        return this.agents.get(name);
    }

    getAllAgents(): BaseAgent<unknown, z.ZodTypeAny>[] {
        return Array.from(this.agents.values());
    }
}

import { WhitepaperAgent } from './whitepaper-agent';
import { GitHubAgent } from './github-agent';
import { DocumentationAgent } from './documentation-agent';

// Singleton registry for future central orchestration management.
export const agentRegistry = new AgentRegistry();
agentRegistry.register(new WhitepaperAgent());
agentRegistry.register(new GitHubAgent());
agentRegistry.register(new DocumentationAgent());
