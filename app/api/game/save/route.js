import { redis } from '@/lib/redis-client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'duckie-game-secret-key';

export async function POST(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const fid = decoded.fid;

    // Get game data from request body
    const gameData = await request.json();

    // Save game data to Redis
    await redis.set(`game:${fid}`, JSON.stringify(gameData));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json({ error: 'Failed to save game data' }, { status: 500 });
  }
}