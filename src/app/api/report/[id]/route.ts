import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const p = await params;
        const data = await storage.getCollection(p.id);
        if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Error fetching report' }, { status: 500 });
    }
}
