import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 
    const buttonIndex = body?.untrustedData?.buttonIndex;
    
    //
    if (buttonIndex === 4) {
      // 
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${env.NEXT_PUBLIC_URL}/game-static/images/game-preview.png" />
          <meta property="fc:frame:post_url" content="${env.NEXT_PUBLIC_URL}/api/frame-action" />
          <meta property="fc:frame:button:1" content="Back to Menu" />
          <meta property="og:title" content="Life of Duckie" />
          <meta property="og:image" content="${env.NEXT_PUBLIC_URL}/game-static/images/game-preview.png" />
          <script>
            window.location.href = "${env.NEXT_PUBLIC_URL}/game";
          </script>
        </head>
        <body>
          <h1>Loading game...</h1>
        </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    //
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing frame action:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}