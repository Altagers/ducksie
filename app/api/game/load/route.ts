import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { redis } from "@/lib/redis-client";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    // For testing purposes, allow loading even without authentication
    // Remove this conditional in production when auth is working
    if (!user) {
      console.log("No authenticated user, using test FID");
      // Use a test FID for development
      const testFid = "12345";
      
      const gameData = await redis.get(`game:${testFid}`);
      
      return NextResponse.json({ 
        gameData: typeof gameData === 'string' ? JSON.parse(gameData) : null,
        message: "Loaded with test FID, auth not working yet"
      });
    }
    
    // Load game data from Redis
    const gameData = await redis.get(`game:${user.fid}`);
    
    // Fix: Check if gameData is a string before parsing
    return NextResponse.json({ 
      gameData: typeof gameData === 'string' ? JSON.parse(gameData) : null 
    });
  } catch (error) {
    console.error("Load game error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}