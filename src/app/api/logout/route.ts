import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';

export async function POST() {
  console.log('logout');

  const cookieStore = cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return NextResponse.json({ message: 'logged out' }, { status: 200 });
}
