import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: NextRequest) {
  try {
    const { fid } = await req.json();
    
    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }
    
    // Fetch user data from Neynar API
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': env.NEYNAR_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
    
    const userData = await response.json();
    
    if (!userData.users || userData.users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const user = userData.users[0];
    
    // Generate JWT token
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new jose.SignJWT({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfp: user.pfp_url
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
    
    // Create response with cookie
    const response2 = NextResponse.json({ 
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp_url
      }
    });
    
    // Set cookie
    response2.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response2;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}