import { NextResponse } from 'next/server';
import { fetchVerificationStatus } from '@/lib/genlayer/contract';
import { GenLayerVerificationStatus } from '@/lib/genlayer/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const hash = searchParams.get('hash');

        if (!hash) {
            return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 });
        }

        const result = await fetchVerificationStatus(hash);

        return NextResponse.json(result);

    } catch (error) {
        console.error('API Error in /api/genlayer/status:', error);
        return NextResponse.json(
            {
                status: GenLayerVerificationStatus.FAILED,
                error: 'Internal Server Error while fetching verification status',
                transactionHash: null,
                network: 'unknown',
                contractAddress: null,
                executionTimestamp: null,
                result: null
            },
            { status: 500 }
        );
    }
}
