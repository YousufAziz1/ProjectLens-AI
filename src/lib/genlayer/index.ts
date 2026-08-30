/**
 * GenLayer integration module for TrustLens.
 * 
 * Provides the contract interaction layer, types, and client
 * configuration for submitting evidence to the GenLayer
 * TrustLensVerifier Intelligent Contract.
 */
export { submitVerification } from './contract';
export { createGenLayerClient, createGenLayerReadClient, isGenLayerConfigured, getContractAddress, getNetwork } from './client';
export { GenLayerVerificationStatus } from './types';
export type { ProjectEvidence, VerificationResult, GenLayerVerificationResponse } from './types';
