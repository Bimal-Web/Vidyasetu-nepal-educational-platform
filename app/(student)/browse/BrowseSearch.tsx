'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export function BrowseSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)
  const [, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
      params.delete('faculty')
    } else {
      params.delete('q')
    }
    startTransition(() => router.push(`/browse?${params.toString()}`))
  }

  const clearSearch = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    startTransition(() => router.push(`/browse?${params.toString()}`))
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          id="browse-search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search subjects…"
          className="input pl-9 pr-8 py-2 text-sm"
        />
        {query && (
          <button type="button" onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        )}
      </div>
      <button type="submit" className="btn-primary py-2 px-4 text-sm whitespace-nowrap">Search</button>
    </form>
  )
}
