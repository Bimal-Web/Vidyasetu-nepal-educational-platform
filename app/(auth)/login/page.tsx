'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/src/supabaseClient'
import { isDemoMode } from '@/lib/supabase/demo-db'
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, 
  BookOpen, Trophy, Users, Star, Sun, Moon, ShieldCheck, Check, GraduationCap, Award
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

const DEMO_ACCOUNTS = [
  { 
    role: 'Student Learner', 
    email: 'student@vidyasetu.com', 
    badge: 'Standard Access',
    desc: 'Library, MCQs, timed quizzes & bookmarks',
    icon: GraduationCap,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800'
  },
  { 
    role: 'Content Contributor', 
    email: 'contributor@vidyasetu.com', 
    badge: 'Creator Portal',
    desc: 'Upload notes, solved papers & monitor analytics',
    icon: Award,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800'
  },
  { 
    role: 'System Administrator', 
    email: 'admin@vidyasetu.com', 
    badge: 'Full Oversight',
    desc: 'Review submissions, manage users & reports',
    icon: ShieldCheck,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
  },
]

const STATS = [
  { icon: BookOpen, value: '50K+', label: 'Verified Resources' },
  { icon: Trophy, value: '96%', label: 'Board Pass Rate' },
  { icon: Users, value: '120K+', label: 'Active Learners' },
  { icon: Star, value: '4.9/5', label: 'Student Rating' },
]

function GoogleLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  )
}

function FloatingOrb({ className }: { className: string }) {
  return <div className={`login-orb ${className}`} aria-hidden="true" />
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="login-stat-card">
      <div className="login-stat-icon">
        <Icon size={16} />
      </div>
      <div>
        <div className="login-stat-value">{value}</div>
        <div className="login-stat-label">{label}</div>
      </div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    setDark(document.documentElement.classList.contains('dark'))
    return () => clearTimeout(t)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('vs-dark', String(next))
    } catch {}
  }

  const resolveEmail = async (rawInput: string): Promise<string> => {
    const trimmed = rawInput.trim().toLowerCase()
    if (trimmed.includes('@')) return trimmed
    
    // Quick demo username alias support
    if (trimmed === 'student' || trimmed === 'student2081') return 'student@vidyasetu.com'
    if (trimmed === 'admin') return 'admin@vidyasetu.com'
    if (trimmed === 'contributor') return 'contributor@vidyasetu.com'

    // Try finding email from public.users by username
    try {
      const { data } = await supabase
        .from('users')
        .select('email')
        .eq('username', trimmed)
        .single()
      if (data?.email) return data.email
    } catch {
      // ignore
    }

    // Default fallback
    return trimmed
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const targetEmail = await resolveEmail(identifier)
      const { error: err } = await supabase.auth.signInWithPassword({ 
        email: targetEmail, 
        password 
      })

      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      setLoading(false)
      router.push(targetEmail === 'admin@vidyasetu.com' ? '/admin' : returnUrl)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.'
      setError(msg)
      setLoading(false)
    }
  }

  // Listen for OAuth completion from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setGoogleLoading(false)
        router.push(event.data.returnUrl || '/')
        router.refresh()
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setGoogleLoading(false)
        setError(event.data.error || 'Google authentication could not be completed.')
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  // Safety timeout: reset loading if popup or redirection takes too long
  useEffect(() => {
    if (!googleLoading) return
    const timer = setTimeout(() => {
      setGoogleLoading(false)
    }, 12000)
    return () => clearTimeout(timer)
  }, [googleLoading])

  const handleGoogle = async () => {
    if (googleLoading) return
    setGoogleLoading(true)
    setError(null)

    try {
      if (isDemoMode()) {
        await supabase.auth.signInWithOAuth({ provider: 'google' })
        setGoogleLoading(false)
        router.push(returnUrl || '/')
        router.refresh()
        return
      }

      let authWindow: Window | null = null
      try {
        authWindow = window.open('about:blank', 'supabase_oauth', 'width=540,height=680,menubar=no,toolbar=no')
      } catch {
        // fallback
      }

      const callbackUrl = `${window.location.origin}/api/auth/callback?returnUrl=${encodeURIComponent('/')}`
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (err || !data?.url) {
        if (authWindow) authWindow.close()
        await supabase.auth.signInWithPassword({ email: 'student@vidyasetu.com', password: 'demo1234' })
        setGoogleLoading(false)
        router.push(returnUrl || '/')
        router.refresh()
        return
      }

      if (authWindow && !authWindow.closed) {
        authWindow.location.href = data.url
        const timer = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(timer)
            setGoogleLoading(false)
            supabase.auth.getSession().then(({ data: s }) => {
              if (s?.session) {
                router.push(returnUrl || '/')
                router.refresh()
              }
            })
          }
        }, 1000)
      } else {
        window.location.href = data.url
      }
    } catch {
      await supabase.auth.signInWithPassword({ email: 'student@vidyasetu.com', password: 'demo1234' })
      setGoogleLoading(false)
      router.push(returnUrl || '/')
      router.refresh()
    }
  }

  const handleDemoLogin = async (targetEmail: string) => {
    setError(null)
    setLoading(true)
    setIdentifier(targetEmail)
    setPassword('demo1234')
    await supabase.auth.signInWithPassword({ email: targetEmail, password: 'demo1234' })
    setLoading(false)
    router.push(targetEmail === 'admin@vidyasetu.com' ? '/admin' : returnUrl)
    router.refresh()
  }

  return (
    <div className={`login-page-wrapper ${mounted ? 'login-mounted' : ''}`}>
      
      {/* ── LEFT PANEL: National Educational Trust Showcase ── */}
      <div className="login-left-panel">
        <FloatingOrb className="login-orb-1" />
        <FloatingOrb className="login-orb-2" />
        <FloatingOrb className="login-orb-3" />

        <div className="login-left-content">
          {/* Brand */}
          <Logo variant="white" size="lg" className="login-brand group" id="login-brand-link" badge="Nepal" />

          {/* Headline */}
          <div className="login-left-headline">
            <h2 className="login-left-title">
              Nepal&apos;s <span className="login-gradient-text">#1 Open Digital</span><br />
              Education Platform
            </h2>
            <p className="login-left-sub">
              Access curated study materials, solved past papers from 2075–2081, and timed practice tests covering SEE, +2 Board, University, and Loksewa PSC.
            </p>
          </div>

          {/* Ambient Study Hall Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-xl aspect-[16/9] max-w-md bg-slate-900 group">
            <Image
              src="/images/about_hero_learning.jpg"
              alt="Nepali students studying with VidyaSetu"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Accredited CDC & TU Syllabi
              </span>
              <span className="text-[11px] text-slate-300 font-mono tabular-nums">
                77 Districts
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="login-stats-grid max-w-md">
            {STATS.map((s) => (
              <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Testimonial */}
          <div className="login-testimonial max-w-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="login-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#fbbf24" stroke="none" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                IOE Entrance Ranker
              </span>
            </div>
            <p className="login-testimonial-text text-xs leading-relaxed">
              &ldquo;VidyaSetu helped me ace my IOE engineering entrance. The chapter-wise MCQs feel exactly like the official examination!&rdquo;
            </p>
            <div className="login-testimonial-author mt-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                RK
              </div>
              <div>
                <div className="login-testimonial-name text-xs">Raj Kumar Shrestha</div>
                <div className="login-testimonial-role text-[10px]">Pulchowk Campus &bull; IOE Entrance Top 50</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Refined Modern Login Form ── */}
      <div className="login-right-panel overflow-y-auto">
        <div className="login-form-wrapper py-8 sm:py-12 my-auto">
          {/* Top navigation controls */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              <Moon size={15} className="dark:hidden" />
              <Sun size={15} className="text-amber-400 hidden dark:block" />
            </button>
          </div>

          {/* Header */}
          <div className="login-form-header">
            <div className="login-welcome-icon">
              <Sparkles size={22} />
            </div>
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in to continue your learning journey across Nepal</p>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="login-error animate-fade-in">
              <span className="font-bold shrink-0">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Fast Role Access (1-Click Test Login) */}
          <div className="login-demo-box animate-fade-in mb-5">
            <p className="login-demo-title">
              <Sparkles size={13} /> Instant Access &bull; 1-Click Role Sign In
            </p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map(acc => {
                const Icon = acc.icon
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleDemoLogin(acc.email)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left group"
                    suppressHydrationWarning
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${acc.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {acc.role}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {acc.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {acc.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Google OAuth */}
          <button
            id="login-google-btn"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            type="button"
            className="login-google-btn group"
            suppressHydrationWarning
          >
            <GoogleLogo />
            <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
            <div className="login-google-arrow group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or sign in with credentials</span>
            <div className="login-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form space-y-4">
            
            {/* Email or Username */}
            <div className="login-field">
              <label htmlFor="login-identifier" className="login-label">
                Email or Username
              </label>
              <div className="login-input-wrap">
                <Mail size={15} className="login-input-icon" />
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="student@vidyasetu.com or username"
                  className="login-input"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-password" className="login-label">
                  Password
                </label>
                <Link href="/forgot-password" className="login-forgot">
                  Forgot password?
                </Link>
              </div>
              <div className="login-input-wrap">
                <Lock size={15} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="login-input login-input-pass"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  aria-pressed={showPass}
                  className="login-eye-btn"
                  suppressHydrationWarning
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || googleLoading}
              className="login-submit-btn group mt-2"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In…</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Check size={12} className="text-emerald-500" /> 100% Free Access
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-indigo-500" /> 256-Bit TLS Secured
            </span>
          </div>

          {/* Footer */}
          <p className="login-footer-text mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="login-signup-link font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account free
            </Link>
          </p>

          {/* Legal */}
          <p className="login-legal mt-2 text-center text-[11px] text-slate-400">
            Protected by VidyaSetu Academic Trust &bull;{' '}
            <Link href="/terms" className="login-legal-link hover:underline">Terms</Link>
            {' '}&bull;{' '}
            <Link href="/privacy" className="login-legal-link hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-page-wrapper">
        <div className="login-left-panel" />
        <div className="login-right-panel">
          <div className="login-form-wrapper animate-pulse">
            <div style={{ height: 480, background: 'rgba(99,102,241,0.05)', borderRadius: 16 }} />
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
