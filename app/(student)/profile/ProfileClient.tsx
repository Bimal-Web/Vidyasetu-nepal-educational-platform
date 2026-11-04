'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Shield, Calendar, Download, Bookmark, Brain, Edit3, Save, X, CheckCircle2, Upload } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ProfileClientProps {
  user: SupabaseUser
  profile: any
  stats: { downloads: number; bookmarks: number; quizzes: number; contributions: number; approvedContributions: number }
}

const ROLE_BADGES: Record<string, { label: string; cls: string }> = {
  admin:       { label: 'Admin', cls: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  contributor: { label: 'Contributor', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  student:     { label: 'Student', cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
}

function contributorTier(approved: number): { label: string; desc: string; cls: string } {
  if (approved >= 20) return { label: 'Scholar', desc: '20+ approved resources — you are a knowledge leader.', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' }
  if (approved >= 10) return { label: 'Expert', desc: '10+ approved resources — keep sharing your expertise.', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' }
  if (approved >= 3) return { label: 'Contributor', desc: '3+ approved resources — making a real impact.', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' }
  return { label: 'Newcomer', desc: 'Upload your first resource to start earning badges.', cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' }
}

export function ProfileClient({ user, profile, stats }: ProfileClientProps) {
  const supabase = createClient()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMsg, setPwMsg] = useState<string | null>(null)
  const [pwSaving, setPwSaving] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const role = profile?.role || 'student'
  const roleBadge = ROLE_BADGES[role] ?? ROLE_BADGES.student
  const provider = user.app_metadata?.provider || 'email'
  const tier = contributorTier(stats.approvedContributions)

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)
    if (error) {
      setSaveMsg('Failed to save. Please try again.')
    } else {
      setSaveMsg('Profile updated successfully!')
      setEditing(false)
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(null), 3000)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setPwMsg('Passwords do not match.'); return }
    if (newPassword.length < 6) { setPwMsg('Password must be at least 6 characters.'); return }
    setPwSaving(true)
    setPwMsg(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPwMsg(error.message)
    } else {
      setPwMsg('✓ Password updated successfully!')
      setNewPassword(''); setConfirmPassword('')
      setChangingPassword(false)
    }
    setPwSaving(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      // Delete user-owned records (RLS allows own-row deletes, FKs cascade the rest)
      const deletions = [
        supabase.from('results').delete().eq('user_id', user.id),
        supabase.from('bookmarks').delete().eq('user_id', user.id),
        supabase.from('downloads_log').delete().eq('user_id', user.id),
        supabase.from('submissions').delete().eq('contributor_id', user.id),
        supabase.from('content').delete().eq('uploaded_by', user.id),
        supabase.from('discussion_posts').delete().eq('user_id', user.id),
        supabase.from('discussion_replies').delete().eq('user_id', user.id),
      ]
      await Promise.all(deletions)
      // Remove the profile row
      await supabase.from('users').delete().eq('id', user.id)
      // Sign out and go home
      await supabase.auth.signOut()
      router.push('/')
    } catch {
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Avatar & Stats */}
        <div className="space-y-6">
          {/* Avatar card */}
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-100 dark:border-indigo-900"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-3xl font-black mx-auto border-4 border-indigo-100 dark:border-indigo-900">
                  {initials}
                </div>
              )}
              {provider === 'google' && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <span className="text-sm">G</span>
                </div>
              )}
            </div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{displayName}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${roleBadge.cls}`}>
              {roleBadge.label}
            </span>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} className="text-slate-400" />
                Joined {profile?.created_at ? formatDate(profile.created_at) : '—'}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield size={14} className="text-slate-400" />
                <span className="capitalize">{provider} account</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-5">
            <p className="text-caption text-slate-400 uppercase tracking-wide mb-4">Activity Summary</p>
            <div className="space-y-4">
              {[
                { icon: Brain,     label: 'Quizzes Taken',    value: stats.quizzes,   color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900' },
                { icon: Download,  label: 'Downloads',        value: stats.downloads, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900' },
                { icon: Bookmark,  label: 'Bookmarks',        value: stats.bookmarks, color: 'text-emerald-600 bg-green-50 dark:bg-green-900' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color.split(' ').slice(1).join(' ')}`}>
                    <s.icon size={16} className={s.color.split(' ')[0]} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributor badge */}
          <div className="card p-5">
            <p className="text-caption text-slate-400 uppercase tracking-wide mb-4">Contributor Badge</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 flex items-center justify-center flex-shrink-0">
                <Upload size={18} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{tier.label}</p>
                <p className="text-caption text-slate-400">{stats.approvedContributions} approved · {stats.contributions} total</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{tier.desc}</p>
            <div className="progress-bar mb-2">
              <div className="progress-fill amber" style={{ width: `${Math.min((stats.approvedContributions / 20) * 100, 100)}%` }} />
            </div>
            <p className="text-caption text-slate-400">
              {stats.approvedContributions >= 20
                ? 'Maximum tier reached — thank you!'
                : `${Math.max(20 - stats.approvedContributions, 0)} more approved to reach Scholar.`}
            </p>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100">Personal Information</h2>
                <p className="text-sm text-slate-400 mt-0.5">Update your display name and account details.</p>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} id="profile-edit-btn"
                  className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <button onClick={() => { setEditing(false); setFullName(profile?.full_name || '') }}
                  className="btn-ghost text-sm px-3 py-2 flex items-center gap-2">
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                {editing ? (
                  <input
                    id="profile-fullname-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="input"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-100 font-medium py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    {profile?.full_name || <span className="text-slate-400 italic">Not set</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Mail size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200">{user.email}</span>
                  {user.email_confirmed_at && (
                    <CheckCircle2 size={14} className="text-emerald-500 ml-auto flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Role
                </label>
                <div className="py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2">
                  <Shield size={15} className="text-slate-400" />
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full capitalize ${roleBadge.cls}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>

              {editing && (
                <>
                  {saveMsg && (
                    <p className={`text-sm font-medium ${saveMsg.startsWith('✓') || saveMsg.includes('successfully') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {saveMsg}
                    </p>
                  )}
                  <button onClick={handleSave} disabled={saving} id="profile-save-btn"
                    className="btn-primary flex items-center gap-2 px-6 py-2.5">
                    <Save size={15} />
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </>
              )}
              {saveMsg && !editing && (
                <p className="text-sm font-medium text-emerald-600">{saveMsg}</p>
              )}
            </div>
          </div>

          {/* Change Password (only for email provider) */}
          {provider === 'email' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">Password</h2>
                  <p className="text-sm text-slate-400 mt-0.5">Change your account password.</p>
                </div>
                {!changingPassword && (
                  <button onClick={() => setChangingPassword(true)} id="profile-change-pw-btn"
                    className="btn-secondary text-sm px-4 py-2">
                    Change Password
                  </button>
                )}
              </div>

              {changingPassword && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      id="profile-new-password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      id="profile-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="input"
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>
                  {pwMsg && (
                    <p className={`text-sm font-medium ${pwMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pwMsg}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button type="submit" disabled={pwSaving} id="profile-pw-submit-btn" className="btn-primary px-5 py-2.5">
                      {pwSaving ? 'Updating…' : 'Update Password'}
                    </button>
                    <button type="button" onClick={() => { setChangingPassword(false); setNewPassword(''); setConfirmPassword(''); setPwMsg(null) }}
                      className="btn-ghost px-4 py-2.5">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Danger Zone */}
          <div className="card p-6 border-red-200 dark:border-red-900">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Danger Zone</h2>
            <p className="text-sm text-slate-400 mb-4">Permanent and irreversible actions.</p>
            {confirmingDelete ? (
              <div className="rounded-lg border border-red-200 dark:border-red-800 p-4 bg-red-50 dark:bg-red-950">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">Delete your account?</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  This permanently removes your profile, quiz history, bookmarks, downloads, and uploaded content. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    id="profile-delete-confirm-btn"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                    className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Yes, Delete Everything'}
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="profile-delete-btn"
                className="text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete My Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
