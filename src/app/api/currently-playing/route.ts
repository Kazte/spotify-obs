import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  const params = new URL(req.url);

  let access_token = cookieStore.get('access_token')?.value;

  if (params.searchParams.get('access_token')) {
    access_token = req.headers.get('access_token') as string;
  }

  try {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    if (response.status === 401) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 200 });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.log('error curr playing:', err);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
