import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  cookies().delete('auth');
  return NextResponse.redirect(new URL('/login', request.url));
}

// Support GET for simplicity if user types it
export async function GET(request: Request) {
  cookies().delete('auth');
  return NextResponse.redirect(new URL('/login', request.url));
}
