import { env } from "@/lib/env";
import * as jose from "jose";
import { NextRequest } from "next/server";

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    return {
      fid: payload.fid as number,
      username: payload.username as string,
      displayName: payload.displayName as string,
      pfp: payload.pfp as string
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}