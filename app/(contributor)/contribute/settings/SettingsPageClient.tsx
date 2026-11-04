'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Save, Bell, Shield, UserRound } from 'lucide-react'

interface Props {
  profile: any
  email: string
}

export function SettingsPageClient({ profile, email }: Props) {
  const supabase = createClient()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [notify, setNotify] = useState({
    reviewUpdates: true,
    newLearners: false,
    weeklyDigest: true,
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const saveProfile = async () => {
    setSaving(true); setMsg(null)
    try {
      const { error } = await supabase.from('users').update({ full_name: fullName }).eq('id', profile.id)
      if (error) throw error
      setMsg('✓ Settings saved successfully.')
    } catch (e: any) {
      setMsg(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const toggle = (key: keyof typeof notify) => setNotify(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/contribute" className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft size={15} /> Contributor Console
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-indigo-700 font-medium">Settings</span>
      </nav>

      <div className="mb-8">
        <p className="text-caption text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold mb-1">Preferences</p>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Contributor Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your public profile and notification preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <UserRound size={17} className="text-indigo-600" /> Public Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Email</label>
              <input value={email} disabled className="input opacity-60 cursor-not-allowed" />
              <p className="text-caption text-slate-400 mt-1.5">Email is used for account recovery and review notifications.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Role</label>
              <input value={profile?.role ?? 'student'} disabled className="input opacity-60 cursor-not-allowed capitalize" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Bell size={17} className="text-amber-600" /> Notifications
          </h2>
          <div className="space-y-3">
            {([
              { key: 'reviewUpdates', label: 'Review updates', desc: 'Email me when my submissions are approved or rejected' },
              { key: 'newLearners', label: 'Learner engagement', desc: 'Notify me when students download or bookmark my resources' },
              { key: 'weeklyDigest', label: 'Weekly digest', desc: 'A weekly summary of my contribution impact' },
            ] as const).map(item => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</p>
                  <p className="text-caption text-slate-400">{item.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={notify[item.key]}
                  onClick={() => toggle(item.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notify[item.key] ? 'bg-indigo-700' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notify[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card p-6">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Shield size={17} className="text-emerald-600" /> Security
          </h2>
          <Link href="/profile" className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:underline">
            Manage password & account settings →
          </Link>
        </div>

        {msg && (
          <p className={`text-sm font-medium ${msg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>{msg}</p>
        )}

        <div className="flex items-center gap-3">
          <button onClick={saveProfile} disabled={saving} className="btn-primary px-6 py-2.5 flex items-center gap-2">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/contribute" className="btn-ghost px-4 py-2.5">Cancel</Link>
        </div>
      </div>
    </div>
  )
}