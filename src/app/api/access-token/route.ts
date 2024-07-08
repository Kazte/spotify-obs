import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import querystring from 'querystring';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  const params = new URL(req.url);

  const access_token = cookieStore.get('access_token')?.value;
  let refresh_token = cookieStore.get('refresh_token')?.value;

  if (!refresh_token) {
    refresh_token = req.headers.get('refresh_token') as string;
  }

  if (!refresh_token) {
    return NextResponse.json(
      { error: 'Refresh token not found' },
      { status: 400 }
    );
  }

  const basicAuth = Buffer.from(
    `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
  ).toString('base64');

  const url = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  };

  try {
    const response = await fetch(url, authOptions);

    const { access_token } = await response.json();

    cookieStore.set('access_token', access_token);

    return NextResponse.json({ access_token }, { status: 200 });
  } catch (err) {
    console.log('error access token:', err);
  }
}
