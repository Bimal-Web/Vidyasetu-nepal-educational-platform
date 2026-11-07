'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/layout/Logo'
import { 
  GraduationCap, FileText, Award, Laptop, 
  ArrowRight, Sparkles, AtSign, Check, ShieldCheck 
} from 'lucide-react'

const GOALS = [
  {
    id: 'see',
    label: 'SEE Class 10',
    category: 'CDC Official',
    desc: 'Compulsory subjects, BLE, and CDC model question solutions.',
    icon: GraduationCap,
  },
  {
    id: 'plus2',
    label: '+2 NEB',
    category: 'NEB Board',
    desc: 'Class 11 & 12 Science, Management, Humanities, and Entrance tests.',
    icon: FileText,
  },
  {
    id: 'loksewa',
    label: 'Loksewa PSC',
    category: 'Public Service',
    desc: 'Kharidar, Nayab Subba, Section Officer GK & IQ mock examinations.',
    icon: Award,
  },
  {
    id: 'bachelor',
    label: 'TU/KU Degree',
    category: 'University',
    desc: 'TU BCA, BSc CSIT, BBS, Engineering, and semester past questions.',
    icon: Laptop,
  },
]

function OnboardingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/dashboard'
  const supabase = createClient()

  const [username, setUsername] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('plus2')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCurrentProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace('/login')
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('full_name, username, academic_goal')
          .eq('id', user.id)
          .maybeSingle()

        if (profile?.username) {
          setUsername(profile.username)
        } else {
          const emailPrefix = (user.email?.split('@')[0] || 'student').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
          setUsername(`${emailPrefix}_${Math.floor(1000 + Math.random() * 9000)}`)
        }

        if (profile?.academic_goal) {
          setSelectedGoal(profile.academic_goal)
        }

        setFullName(profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Student')
      } catch (err) {
        console.warn('Error loading user profile for onboarding:', err)
      } finally {
        setFetching(false)
      }
    }

    loadCurrentProfile()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }

      const cleanUsername = username.trim().toLowerCase()

      // Update public.users
      const { error: updateErr } = await supabase
        .from('users')
        .update({
          username: cleanUsername,
          academic_goal: selectedGoal,
        })
        .eq('id', user.id)

      if (updateErr) {
        // Fallback: in case academic_goal column isn't created yet in DB
        await supabase
          .from('users')
          .update({
            username: cleanUsername,
          })
          .eq('id', user.id)
      }

      // Also persist to Supabase user_metadata for client-side availability
      try {
        await supabase.auth.updateUser({
          data: {
            username: cleanUsername,
            academic_goal: selectedGoal,
          }
        })
      } catch {}

      setLoading(false)
      router.push(returnUrl)
      router.refresh()
    } catch (err: unknown) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to save preferences. Please try again.')
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Preparing your VidyaSetu experience…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo variant="white" size="lg" badge="Nepal" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles size={13} />
            <span>Step 2 of 2: Personalize Your Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to VidyaSetu{fullName ? `, ${fullName}` : ''}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Choose your primary academic goal so we can curate the right notes, official past papers, and mock test papers for you.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <span className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Username selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="onboard-username" className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Confirm Your Username
              </label>
              <span className="text-[11px] text-slate-400">Used for leaderboards</span>
            </div>
            <div className="relative">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                id="onboard-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                placeholder="e.g. aayush_nepal"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Unique identifier for study rooms, community questions, and score rankings.
            </p>
          </div>

          {/* Academic Goals Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Select Primary Academic Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const Icon = goal.icon
                const active = selectedGoal === goal.id
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer relative ${
                      active
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {goal.category}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-1.5">
                        {goal.label}
                        {active && <Check size={14} className="text-indigo-400 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        {goal.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Configuring your dashboard…</span>
              </div>
            ) : (
              <>
                <span>Complete Setup & Enter VidyaSetu</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" /> Free Forever
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} className="text-indigo-400" /> You can change goals anytime in Profile
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OnboardingForm />
    </Suspense>
  )
}
