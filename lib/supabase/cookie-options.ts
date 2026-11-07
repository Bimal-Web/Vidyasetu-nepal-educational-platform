// ============================================================
// VidyaSetu — Shared Cookie Configuration for Supabase Auth
// ============================================================
// In cross-origin iframe environments (e.g. Google AI Studio preview),
// browsers drop cookies that are not SameSite=None and Secure.
// In standard top-level browser windows (e.g. production domain, local dev),
// SameSite=Lax is used for optimal security and privacy.
// ============================================================

export interface CustomCookieOptions {
  sameSite: 'none' | 'lax'
  secure: boolean
  path?: string
  maxAge?: number
}

/**
 * Returns whether the current runtime context is inside an iframe.
 * Wrapped in try/catch because cross-origin window access can throw.
 */
export function isRunningInIframe(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

/**
 * Computes the appropriate cookie options for Supabase clients & middleware.
 * Uses SameSite=None + Secure=true for iframes and preview environments,
 * and SameSite=Lax for standard top-level browsing.
 */
export function getAuthCookieOptions(forceIframeContext?: boolean): CustomCookieOptions {
  if (forceIframeContext !== undefined) {
    return forceIframeContext
      ? { sameSite: 'none', secure: true, path: '/' }
      : { sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }
  }

  // 1. Client-side browser detection
  if (typeof window !== 'undefined') {
    const inIframe = isRunningInIframe()
    const isPreviewHost =
      window.location.hostname.endsWith('.run.app') ||
      window.location.hostname.includes('aistudio')

    if (inIframe || isPreviewHost) {
      return { sameSite: 'none', secure: true, path: '/' }
    }

    return {
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
      path: '/',
    }
  }

  // 2. Server-side environment detection
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    ''

  const isPreview =
    appUrl.includes('.run.app') ||
    appUrl.includes('aistudio') ||
    Boolean(process.env.DEVELOPMENT_APP_URL)

  if (isPreview) {
    return { sameSite: 'none', secure: true, path: '/' }
  }

  return {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  }
}
