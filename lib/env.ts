import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEYNAR_API_KEY: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    REDIS_URL: z.string().optional(),
    REDIS_TOKEN: z.string().optional(),
  },
  client: {
 
    NEXT_PUBLIC_URL: z.string().optional().default("https://bg-minikit.vercel.app"),
    NEXT_PUBLIC_APP_ENV: z.string().optional().default("development"),
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().optional().default(""),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().optional().default(""),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
  },
});
