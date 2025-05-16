import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { redis } from "@/lib/redis-client";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    // For testing purposes, allow saving even without authentication
    // Remove this conditional in production when auth is working
    if (!user) {
      console.log("No authenticated user, using test FID");
      // Use a test FID for development
      const testFid = "12345";
      
      const gameData = await req.json();
      await redis.set(`game:${testFid}`, JSON.stringify(gameData));
      
      return NextResponse.json({ 
        success: true,
        message: "Saved with test FID, auth not working yet" 
      });
    }
    
    const gameData = await req.json();
    
    // Save game data to Redis
    await redis.set(`game:${user.fid}`, JSON.stringify(gameData));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save game error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}