import { createRealServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnUrl = url.searchParams.get('returnUrl') ?? '/dashboard'
  const errorParam = url.searchParams.get('error')
  const errorDesc = url.searchParams.get('error_description')

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const siteOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin

  // 1. Google or Supabase returned an OAuth error
  if (errorParam) {
    let friendlyMsg = errorDesc || errorParam
    const lowerDesc = (errorDesc || '').toLowerCase()
    const lowerParam = errorParam.toLowerCase()

    if (lowerParam === 'access_denied') {
      friendlyMsg = 'Access denied: Please add your email as a Test User in Google Cloud Console (OAuth consent screen) or publish the app to Production.'
    } else if (
      lowerDesc.includes('already registered') ||
      lowerDesc.includes('user already exists') ||
      lowerDesc.includes('identity') ||
      lowerParam.includes('identity_already_exists')
    ) {
      // Supabase identity linking note:
      // When automatic linking is not enabled or credentials already exist with email/password,
      // Supabase returns an identity conflict. The user can log in with their password or use the matching Google email.
      friendlyMsg = 'This email is already registered. Log in with your password, or use Google with the same email.'
    }

    const errorHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authentication Error — VidyaSetu</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white;">
    <div style="text-align: center; padding: 32px; max-width: 420px; background: #1e293b; border-radius: 16px; border: 1px solid #334155;">
      <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239, 68, 68, 0.2); color: #ef4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 24px; font-weight: bold;">✕</div>
      <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #f8fafc;">Sign-in Could Not Be Completed</h2>
      <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">${friendlyMsg}</p>
      <p style="margin: 0; color: #64748b; font-size: 11px;">Closing this window…</p>
    </div>
    <script>
      (function() {
        const appOrigin = ${JSON.stringify(siteOrigin)} || window.location.origin;
        const targetOrigin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : appOrigin;
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(friendlyMsg)} }, targetOrigin);
            setTimeout(function() { window.close(); }, 500);
            return;
          }
        } catch (e) {}
        setTimeout(function() {
          window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(friendlyMsg)});
        }, 1200);
      })();
    </script>
  </body>
</html>`

    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // 2. Exchange authorization code for authenticated session
  if (code) {
    const supabase = await createRealServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.session) {
      const session = data.session
      const user = session.user
      let needsOnboarding = false

      if (user) {
        try {
          // Check for existing profile in public.users
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, username, academic_goal, role, full_name, avatar_url')
            .eq('id', user.id)
            .maybeSingle()

          const emailPrefix = (user.email?.split('@')[0] || 'student').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
          const randomSuffix = Math.floor(1000 + Math.random() * 9000)
          const defaultUsername = `${emailPrefix || 'student'}_${randomSuffix}`

          if (existingUser) {
            // Safe upsert / update:
            // ON CONFLICT (id) DO UPDATE only for email, full_name, and avatar_url.
            // NEVER overwrite role, username, or academic_goal if they already exist!
            const safeUpdates: Record<string, string | null> = {
              email: user.email!,
            }
            if (user.user_metadata?.avatar_url) {
              safeUpdates.avatar_url = user.user_metadata.avatar_url
            }
            if (user.user_metadata?.full_name || user.user_metadata?.name) {
              safeUpdates.full_name = user.user_metadata?.full_name || user.user_metadata?.name
            }

            await supabase
              .from('users')
              .update(safeUpdates)
              .eq('id', user.id)

            // If academic_goal or username is missing, redirect to onboarding
            if (!existingUser.academic_goal || !existingUser.username) {
              needsOnboarding = true
            }
          } else {
            // New Google user:
            // Insert with default username generated from email prefix plus random digits
            const newRecord: Record<string, any> = {
              id: user.id,
              full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? emailPrefix,
              email: user.email!,
              auth_provider: user.app_metadata?.provider ?? 'google',
              role: 'student',
              avatar_url: user.user_metadata?.avatar_url ?? null,
              username: defaultUsername,
              // academic_goal left null for new users to trigger onboarding
            }

            const { error: upsertErr } = await supabase
              .from('users')
              .upsert(newRecord, { onConflict: 'id' })

            if (upsertErr) {
              // Graceful fallback if custom columns (username/academic_goal) aren't migrated yet
              await supabase.from('users').upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? emailPrefix,
                email: user.email!,
                auth_provider: user.app_metadata?.provider ?? 'google',
                role: 'student',
                avatar_url: user.user_metadata?.avatar_url ?? null,
              }, { onConflict: 'id' })
            }

            needsOnboarding = true
          }
        } catch (profileErr) {
          console.warn('Profile sync warning in OAuth callback:', profileErr)
        }
      }

      const targetDestination = needsOnboarding
        ? `/onboarding?returnUrl=${encodeURIComponent(returnUrl)}`
        : returnUrl

      const successHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Signing in to VidyaSetu...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white;">
    <div style="text-align: center; padding: 32px; max-width: 380px; background: #1e293b; border-radius: 16px; border: 1px solid #334155;">
      <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 24px;">✓</div>
      <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #f8fafc;">Signed in with Google!</h2>
      <p style="margin: 0; color: #94a3b8; font-size: 13px;">Returning to VidyaSetu now…</p>
    </div>
    <script>
      (function() {
        const payload = {
          type: 'OAUTH_AUTH_SUCCESS',
          returnUrl: ${JSON.stringify(targetDestination)},
          session: {
            access_token: ${JSON.stringify(session.access_token)},
            refresh_token: ${JSON.stringify(session.refresh_token)},
            expires_at: ${JSON.stringify(session.expires_at)},
            user: {
              id: ${JSON.stringify(user.id)},
              email: ${JSON.stringify(user.email)},
              full_name: ${JSON.stringify(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '')}
            }
          }
        };

        const appOrigin = ${JSON.stringify(siteOrigin)} || window.location.origin;
        const targetOrigin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : appOrigin;

        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(payload, targetOrigin);
            setTimeout(function() { window.close(); }, 350);
            return;
          }
        } catch (e) {
          // PostMessage failed, redirect current window
        }

        window.location.href = ${JSON.stringify(targetDestination)};
      })();
    </script>
  </body>
</html>`

      return new NextResponse(successHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    // 3. Fallback client-side PKCE code delegation if server-side code exchange encountered verifier mismatch
    const fallbackHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Completing Sign-In — VidyaSetu</title>
  </head>
  <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white;">
    <div style="text-align: center; padding: 24px;">
      <p style="margin: 0; color: #94a3b8; font-size: 14px;">Completing your authentication…</p>
    </div>
    <script>
      (function() {
        const appOrigin = ${JSON.stringify(siteOrigin)} || window.location.origin;
        const targetOrigin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : appOrigin;

        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_CODE',
              code: ${JSON.stringify(code)},
              returnUrl: ${JSON.stringify(returnUrl)}
            }, targetOrigin);
            setTimeout(function() { window.close(); }, 350);
            return;
          }
        } catch (e) {}

        window.location.href = '/login?error=' + encodeURIComponent(${JSON.stringify(error?.message || 'Authentication exchange failed')});
      })();
    </script>
  </body>
</html>`

    return new NextResponse(fallbackHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  return NextResponse.redirect(`${siteOrigin}/login?error=auth_error`)
}
