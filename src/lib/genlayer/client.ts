/**
 * GenLayer JS SDK client configuration.
 * 
 * Creates read/write clients for interacting with GenLayer Intelligent Contracts.
 * Uses the simulator chain for local development; testnetBradbury for production.
 */
import { createClient, createAccount } from 'genlayer-js';
import { studionet, testnetBradbury } from 'genlayer-js/chains';

/** Supported GenLayer network targets */
type GenLayerNetwork = 'studionet' | 'testnet';

/** Get the configured network from environment */
function getNetwork(): GenLayerNetwork {
    const network = process.env.GENLAYER_NETWORK || 'studionet';
    if (network === 'testnet' || network === 'studionet') {
        return network;
    }
    return 'studionet';
}

/** Get the chain configuration for the selected network */
function getChain() {
    const network = getNetwork();
    if (network === 'testnet') {
        return testnetBradbury;
    }
    return studionet;
}

/** Get the contract address from environment */
export function getContractAddress(): string | null {
    return process.env.GENLAYER_CONTRACT_ADDRESS || null;
}

/** Create a GenLayer client with signing capability */
export function createGenLayerClient() {
    const chain = getChain();

    // Create an account from private key if available, otherwise generate one
    const privateKey = process.env.GENLAYER_PRIVATE_KEY;
    const account = privateKey
        ? createAccount(privateKey as `0x${string}`)
        : createAccount();

    const client = createClient({
        chain,
        account,
    });

    return { client, account, network: getNetwork() };
}

/** Create a read-only GenLayer client (no signing required) */
export function createGenLayerReadClient() {
    const chain = getChain();

    const client = createClient({
        chain,
    });

    return { client, network: getNetwork() };
}

/** Check if GenLayer is configured and available */
export function isGenLayerConfigured(): boolean {
    return !!getContractAddress();
}

export { getNetwork };
