import { createRealServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnUrl = url.searchParams.get('returnUrl') ?? '/'
  const errorParam = url.searchParams.get('error')
  const errorDesc = url.searchParams.get('error_description')

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const siteOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin

  if (errorParam) {
    let friendlyMsg = errorDesc || errorParam
    if (errorParam === 'access_denied') {
      friendlyMsg = 'Access denied: Please add your email as a Test User in Google Cloud Console (OAuth consent screen) or publish the app to Production.'
    }

    return new Response(
      `<!DOCTYPE html>
<html>
  <head><title>Authentication Error</title></head>
  <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white;">
    <div style="text-align: center; padding: 24px;">
      <h2 style="margin: 0 0 8px 0; color: #ef4444;">Sign in Failed</h2>
      <p style="margin: 0; color: #94a3b8; font-size: 14px;">${friendlyMsg}</p>
    </div>
    <script>
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(friendlyMsg)} }, '*');
          setTimeout(function() { window.close(); }, 500);
        } else {
          window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(friendlyMsg)});
        }
      } catch (e) {
        window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(friendlyMsg)});
      }
    </script>
  </body>
</html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  if (code) {
    const supabase = await createRealServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Ensure user profile row exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          await supabase.from('users').upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '',
            email: user.email!,
            auth_provider: user.app_metadata?.provider ?? 'google',
            role: 'student',
            avatar_url: user.user_metadata?.avatar_url ?? null,
          }, { onConflict: 'id', ignoreDuplicates: true })
        } catch {
          // Ignore profile insertion errors
        }
      }

      return new Response(
        `<!DOCTYPE html>
<html>
  <head><title>Sign in Successful</title></head>
  <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white;">
    <div style="text-align: center; padding: 24px;">
      <h2 style="margin: 0 0 8px 0; color: #10b981;">Signed in successfully!</h2>
      <p style="margin: 0; color: #94a3b8; font-size: 14px;">Redirecting you now...</p>
    </div>
    <script>
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', returnUrl: ${JSON.stringify(returnUrl)} }, '*');
          setTimeout(function() { window.close(); }, 300);
        } else {
          window.location.href = ${JSON.stringify(returnUrl)};
        }
      } catch (e) {
        window.location.href = ${JSON.stringify(returnUrl)};
      }
    </script>
  </body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      )
    }
  }

  return NextResponse.redirect(`${siteOrigin}/login?error=auth_error`)
}
