import { redis } from '@/lib/redis-client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const JWT_SECRET = process.env.JWT_SECRET || 'duckie-game-secret-key';
const NEYNAR_API_KEY = '2597B31F-12E5-469C-8D92-85EC2F4B3BBC';

const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json({ error: 'FID is required' }, { status: 400 });
    }

    // Get user info from Neynar API
    const userResponse = await neynarClient.lookupUserByFid(fid);
    
    if (!userResponse || !userResponse.result || !userResponse.result.user) {
      return NextResponse.json({ error: 'User not found on Farcaster' }, { status: 404 });
    }

    const user = userResponse.result.user;
    
    // Create user data object
    const userData = {
      fid: user.fid,
      username: user.username,
      displayName: user.displayName,
      pfp: user.pfp?.url,
      bio: user.profile?.bio?.text,
      followerCount: user.followerCount,
      followingCount: user.followingCount
    };

    // Save user data to Redis
    await redis.set(`user:${fid}`, JSON.stringify(userData));

    // Create JWT token
    const token = jwt.sign({ fid: user.fid }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie with token
    const cookieStore = cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/'
    });

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}