'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Sparkles } from 'lucide-react'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?type=recovery&returnUrl=/profile`,
      })
      if (err) {
        setError(err.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Failed to send reset link. Please verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#07090e] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>VidyaSetu</span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center mx-auto mb-5 text-emerald-600 dark:text-emerald-400 shadow-xs">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check Your Inbox</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                We sent a password reset link to <strong className="text-slate-900 dark:text-slate-200">{email}</strong>.
                It may take a few moments to arrive.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button 
                  onClick={() => setSent(false)} 
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  try again
                </button>.
              </p>
              <Link 
                href="/login" 
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 shadow-xs">
                  <KeyRound size={22} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Reset Password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter your registered email and we&apos;ll send you a recovery link.
                </p>
              </div>

              {error && (
                <div role="alert" className="login-error animate-fade-in mb-5">
                  <span className="font-bold shrink-0">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="login-field">
                  <label htmlFor="reset-email" className="login-label">
                    Email address
                  </label>
                  <div className="login-input-wrap">
                    <Mail size={16} className="login-input-icon" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="login-input"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  id="reset-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? 'Sending link…' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Remember your password?{' '}
                  <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Sign in
                  </Link>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
