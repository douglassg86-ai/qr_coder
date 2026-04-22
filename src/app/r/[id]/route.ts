import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { UAParser } from 'ua-parser-js';

export const dynamic = 'force-dynamic'; // Ensure it's not cached

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // 1. Find the QR Code
  const { data: qr } = await supabaseAdmin
    .from('qr_codes')
    .select('destino_url')
    .eq('id', id)
    .single();

  if (!qr || !qr.destino_url) {
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // 2. Collect Analytics Data
  const userAgentStr = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || ''; // 'referer' is the standard HTTP header name

  const parser = new UAParser(userAgentStr);
  const result = parser.getResult();

  // Basic classification
  const browser = result.browser.name || 'Unknown';
  let os = result.os.name || 'Unknown';
  if (os === 'Mac OS') os = 'macOS'; // normalize

  let deviceType = result.device.type || 'desktop';
  if (os === 'iOS' || os === 'Android') {
    if (!result.device.type) deviceType = 'mobile';
  }

  // 3. Save Access Record async (fire and forget is faster, but we can await it on serverless)
  await supabaseAdmin.from('acessos').insert({
    qr_id: id,
    device_type: deviceType,
    os,
    browser,
    user_agent: userAgentStr,
    referrer: referrer ? referrer.substring(0, 500) : null,
  });

  // 4. Redirect 302 to destination
  return NextResponse.redirect(qr.destino_url, 302);
}
