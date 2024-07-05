import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import querystring from 'querystring';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();

  const params = new URL(req.url);
  const code = params.searchParams.get('code');

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
      code,
      redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  };

  try {
    const response = await fetch(url, authOptions);
    const { access_token, refresh_token } = await response.json();

    // store in cookies
    cookieStore.set('access_token', access_token);
    cookieStore.set('refresh_token', refresh_token);

    // set cookies
    return NextResponse.redirect('http://localhost:3000/overlay');
  } catch (err) {
    console.log('error:', err);
    return NextResponse.redirect('http://localhost:3000/error');
  }

  // console.log('code:', params.code);

  // redirect();

  // return NextResponse.json({ code }, { status: 200, headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookieStore.toHeader() } });
}
