'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode } from '@/lib/supabase/demo-db'
import { 
  Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, 
  ArrowLeft, CheckCircle2, ShieldCheck, BookOpen, Trophy, 
  Users, Star, Sun, Moon, GraduationCap, Award, Laptop, FileText, Check
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'

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

const ACADEMIC_STREAMS = [
  { id: 'secondary', label: 'SEE Class 10', icon: GraduationCap },
  { id: 'plus2', label: '+2 NEB Board', icon: FileText },
  { id: 'loksewa', label: 'Loksewa PSC', icon: Award },
  { id: 'bachelor', label: 'TU / KU Degree', icon: Laptop },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedStream, setSelectedStream] = useState('secondary')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700' }
    if (password.length < 8) return { score: 1, label: 'Too short (min. 8 chars)', color: 'bg-red-500' }
    let score = 1
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    if (score === 2) return { score: 2, label: 'Fair password', color: 'bg-amber-500' }
    if (score === 3) return { score: 3, label: 'Good password', color: 'bg-indigo-500' }
    return { score: 4, label: 'Strong password', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            target_stream: selectedStream,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      // Insert profile row
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          full_name: fullName,
          email,
          auth_provider: 'email',
          role: 'student',
        })
      }

      // Demo mode: go straight to dashboard
      if (isDemoMode()) {
        router.push('/dashboard')
        router.refresh()
        return
      }

      setSuccess(true)
    } catch {
      setError('An unexpected error occurred during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Safety timeout: reset loading if redirection takes more than 7 seconds
  useEffect(() => {
    if (!googleLoading) return
    const timer = setTimeout(() => {
      setGoogleLoading(false)
    }, 7000)
    return () => clearTimeout(timer)
  }, [googleLoading])

  const handleGoogle = async () => {
    if (googleLoading) return
    setGoogleLoading(true)
    setError(null)
    try {
      if (isDemoMode()) {
        const { error: err } = await supabase.auth.signInWithOAuth({ provider: 'google' })
        if (err) throw err
        window.location.href = '/dashboard'
        return
      }

      const callbackUrl = `${window.location.origin}/api/auth/callback`
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl },
      })

      if (err) {
        const isProviderDisabled = err.message.toLowerCase().includes('provider')
        const msg = isProviderDisabled
          ? 'Google sign-in is not yet enabled in your Supabase project. Enable it in Supabase Dashboard → Authentication → Providers → Google, or create an account with email below.'
          : err.message
        setError(msg)
        setGoogleLoading(false)
        return
      }

      if (data?.url) {
        window.location.href = data.url
        return
      }

      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in could not be completed. Please try again or use email.'
      setError(msg)
      setGoogleLoading(false)
    }
  }

  // Success view (Verification Email Sent)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#07090e]">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 text-center shadow-xl shadow-indigo-950/5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400 shadow-xs">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check your email</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            We&apos;ve sent a confirmation link to <strong className="text-slate-900 dark:text-slate-200">{email}</strong>.
            Click the link to activate your free VidyaSetu account.
          </p>
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="btn-nested-pill w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 justify-center shadow-md shadow-indigo-600/30"
            >
              <span>Back to Login</span>
              <div className="btn-nested-icon bg-indigo-700/80 text-white">
                <ArrowRight size={15} />
              </div>
            </Link>
            <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
              Didn&apos;t receive the email? Check your spam folder or try signing up with another email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`login-page-wrapper ${mounted ? 'login-mounted' : ''}`}>
      
      {/* ── LEFT PANEL (Agency Brand & Academic Value Showcase) ── */}
      <div className="login-left-panel">
        <FloatingOrb className="login-orb-1" />
        <FloatingOrb className="login-orb-2" />
        <FloatingOrb className="login-orb-3" />

        <div className="login-left-content">
          {/* Brand header */}
          <Logo variant="white" size="lg" className="login-brand group" id="signup-brand-link" badge="Nepal" />

          {/* Headline */}
          <div className="login-left-headline">
            <h2 className="login-left-title">
              Start Your <span className="login-gradient-text">Academic Journey</span><br />
              100% Free Forever.
            </h2>
            <p className="login-left-sub">
              Join over 120,000+ Nepali students mastering SEE, +2 Board, University, and Loksewa PSC exams with verified notes and solved past papers.
            </p>
          </div>

          {/* Core Value Pillars */}
          <div className="space-y-3 max-w-md">
            {[
              { title: '24,000+ Verified Study Materials', desc: 'Chapter notes, model solutions & formula handbooks.' },
              { title: 'Official CDC & TU Syllabus Aligned', desc: 'Accurate to the latest 2081/82 examination guidelines.' },
              { title: 'Offline-Ready Study Cache', desc: 'Download modules to your device and revise with zero data.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Success Showcase */}
          <div className="login-testimonial">
            <div className="flex items-center justify-between mb-2">
              <div className="login-testimonial-stars">
                {[0, 1, 2, 3, 4].map(i => (
                  <Star key={i} size={13} fill="#fbbf24" stroke="none" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Verified Topper
              </span>
            </div>
            <p className="login-testimonial-text">
              &ldquo;VidyaSetu provided everything I needed for Loksewa preparation. The solved past papers and timed MCQ mock tests doubled my confidence!&rdquo;
            </p>
            <div className="login-testimonial-author">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                BS
              </div>
              <div>
                <div className="login-testimonial-name">Bikram Shrestha</div>
                <div className="login-testimonial-role">Loksewa PSC Mock Exam &bull; Rank 1 (98/100)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Focused Form Experience) ── */}
      <div className="login-right-panel overflow-y-auto">
        <div className="login-form-wrapper py-8 sm:py-12 my-auto">
          {/* Top bar controls */}
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
            <h1 className="login-form-title">Create your account</h1>
            <p className="login-form-sub">
              Free forever &bull; No credit card or payment required
            </p>
          </div>

          {/* Error notification */}
          {error && (
            <div role="alert" className="login-error animate-fade-in">
              <span className="font-bold shrink-0">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Google One-Click OAuth */}
          <button 
            id="signup-google-btn" 
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

          {/* Elegant Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or register with email</span>
            <div className="login-divider-line" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="login-form">
            
            {/* Full Name */}
            <div className="login-field">
              <label htmlFor="signup-name" className="login-label">
                Full Name
              </label>
              <div className="login-input-wrap">
                <User size={16} className="login-input-icon" />
                <input 
                  id="signup-name" 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  required 
                  autoComplete="name" 
                  placeholder="e.g. Bimal Ghorsai" 
                  className="login-input" 
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="login-field">
              <label htmlFor="signup-email" className="login-label">
                Email Address
              </label>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input 
                  id="signup-email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required 
                  autoComplete="email" 
                  placeholder="you@example.com" 
                  className="login-input" 
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Target Academic Stream Selector */}
            <div className="login-field">
              <label className="login-label">
                Primary Exam Target
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACADEMIC_STREAMS.map(stream => {
                  const Icon = stream.icon
                  const active = selectedStream === stream.id
                  return (
                    <button
                      key={stream.id}
                      type="button"
                      onClick={() => setSelectedStream(stream.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                        active
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                      suppressHydrationWarning
                    >
                      <Icon size={14} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                      <span className="truncate">{stream.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="signup-password" className="login-label">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min. 8 characters</span>
              </div>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input 
                  id="signup-password" 
                  type={showPass ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required 
                  autoComplete="new-password" 
                  placeholder="Create a secure password" 
                  className="login-input login-input-pass" 
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="login-eye-btn"
                  title={showPass ? 'Hide password' : 'Show password'}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  suppressHydrationWarning
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength progress indicator */}
              {password.length > 0 && (
                <div className="mt-1 space-y-1 animate-fade-in">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map(idx => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-colors ${
                          idx <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading || googleLoading}
              className="login-submit-btn group mt-2"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account…</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Terms & Privacy */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Privacy Policy
            </Link>.
          </p>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link 
                href="/login" 
                id="signup-to-login"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
              >
                Sign in <ArrowRight size={13} />
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
