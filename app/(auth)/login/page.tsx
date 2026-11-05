'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode } from '@/lib/supabase/demo-db'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, BookOpen, Trophy, Users, Star } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

const DEMO_ACCOUNTS = [
  { label: 'Student', email: 'student@vidyasetu.com', desc: 'Dashboard, quizzes & bookmarks', color: '#6366f1' },
  { label: 'Contributor', email: 'contributor@vidyasetu.com', desc: 'Upload content & analytics', color: '#8b5cf6' },
  { label: 'Admin', email: 'admin@vidyasetu.com', desc: 'Review submissions & users', color: '#3730a3' },
]

const STATS = [
  { icon: BookOpen, value: '10K+', label: 'Study Resources' },
  { icon: Trophy, value: '95%', label: 'Pass Rate' },
  { icon: Users, value: '50K+', label: 'Students' },
  { icon: Star, value: '4.9', label: 'Rating' },
]

function GoogleLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.4 26.7 36 24 36c-5.3 0-9.6-3-11.3-7.4l-6.6 5.1C9.5 39.7 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2c-.4.4 6.3-4.6 6.3-15.2 0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  )
}

function FloatingOrb({ className }: { className: string }) {
  return <div className={`login-orb ${className}`} />
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
  const returnUrl = searchParams.get('returnUrl') || '/dashboard'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push(returnUrl)
    router.refresh()
  }

  const handleGoogle = async () => {
    if (googleLoading) return
    setGoogleLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback?returnUrl=${returnUrl}` },
      })
      if (err) {
        const msg = err.message.toLowerCase().includes('provider')
          ? 'Google sign-in is not yet enabled. Please use email & password.'
          : err.message
        setError(msg)
        setGoogleLoading(false)
        return
      }
      if (isDemoMode()) {
        router.push(returnUrl)
        router.refresh()
      }
    } catch {
      setError('Google sign-in is not yet configured. Please use email & password.')
      setGoogleLoading(false)
    }
  }

  const handleDemoLogin = async (email: string) => {
    setError(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: 'demo1234' })
    if (err) { setError(err.message); setLoading(false); return }
    router.push(email === 'admin@vidyasetu.com' ? '/admin' : returnUrl)
    router.refresh()
  }

  return (
    <div className={`login-page-wrapper ${mounted ? 'login-mounted' : ''}`}>
      {/* ── Left Panel ── */}
      <div className="login-left-panel">
        <FloatingOrb className="login-orb-1" />
        <FloatingOrb className="login-orb-2" />
        <FloatingOrb className="login-orb-3" />

        <div className="login-left-content">
          {/* Brand */}
          <Logo variant="white" size="lg" className="login-brand" id="login-brand-link" />

          {/* Headline */}
          <div className="login-left-headline">
            <h2 className="login-left-title">
              Nepal&apos;s <span className="login-gradient-text">#1 Learning</span><br />
              Platform for Students
            </h2>
            <p className="login-left-sub">
              Join thousands of students preparing for IOE, Loksewa, SEE, and +2 exams with AI-powered quizzes and expert study material.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="login-stats-grid">
            {STATS.map((s) => (
              <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Testimonial */}
          <div className="login-testimonial">
            <div className="login-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#fbbf24" stroke="none" />
              ))}
            </div>
            <p className="login-testimonial-text">
              &ldquo;VidyaSetu helped me ace my IOE entrance. The quizzes feel exactly like the real exam!&rdquo;
            </p>
            <div className="login-testimonial-author">
              <div className="login-testimonial-avatar">RK</div>
              <div>
                <div className="login-testimonial-name">Raj Kumar Shrestha</div>
                <div className="login-testimonial-role">IOE Engineering, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          {/* Header */}
          <div className="login-form-header">
            <div className="login-welcome-icon">
              <Sparkles size={20} />
            </div>
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in to continue your learning journey</p>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="login-error animate-fade-in">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Demo Mode */}
          {isDemoMode() && (
            <div className="login-demo-box animate-fade-in">
              <p className="login-demo-title">
                <Sparkles size={13} /> Demo Mode — try an account
              </p>
              <div className="login-demo-accounts">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleDemoLogin(acc.email)}
                    disabled={loading}
                    title={acc.desc}
                    className="login-demo-btn"
                  >
                    <span className="login-demo-label">{acc.label}</span>
                    <span className="login-demo-email">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Google OAuth */}
          <button
            id="login-google-btn"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="login-google-btn"
          >
            <span className="login-google-logo">
              <GoogleLogo />
            </span>
            <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
            {!googleLoading && <ArrowRight size={15} className="login-google-arrow" />}
          </button>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or sign in with email</span>
            <div className="login-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Email */}
            <div className="login-field">
              <label htmlFor="login-email" className="login-label">Email address</label>
              <div className="login-input-wrap">
                <Mail size={15} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="login-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-password" className="login-label">Password</label>
                <Link href="/forgot-password" className="login-forgot">Forgot password?</Link>
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
                  placeholder="••••••••"
                  className="login-input login-input-pass"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  aria-pressed={showPass}
                  className="login-eye-btn"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="login-submit-arrow" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="login-footer-text">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="login-signup-link">Sign up free</Link>
          </p>

          {/* Legal */}
          <p className="login-legal">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="login-legal-link">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="login-legal-link">Privacy Policy</Link>
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
