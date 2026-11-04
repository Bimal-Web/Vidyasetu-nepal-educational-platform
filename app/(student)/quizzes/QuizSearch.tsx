'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export function QuizSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    router.push(`/quizzes?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-sm">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search quizzes…"
        className="input pl-9 pr-8 py-2 text-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('')
            const params = new URLSearchParams(searchParams.toString())
            params.delete('q')
            router.push(`/quizzes?${params.toString()}`)
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </form>
  )
}