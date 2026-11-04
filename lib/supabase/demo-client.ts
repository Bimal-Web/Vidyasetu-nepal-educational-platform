// ============================================================
// VidyaSetu — Demo (offline) Supabase client
// ------------------------------------------------------------
// A drop-in replacement for @supabase/ssr used when real
// credentials are missing (see isDemoMode). Supports the exact
// API surface used by the app: chainable queries with nested
// relations, filters, ordering, count queries, auth methods,
// and storage uploads.
// ============================================================

import {
  DB,
  DUMMY_FILE_URL,
  DEMO_IDS,
  demoGetSessionId,
  demoSetSession,
  getUserById,
  getUserByEmail,
  createUser,
  toAuthUser,
  uuid,
  type Row,
} from './demo-db'

// ── Relations (local table → remote table → FK column) ───────
const RELATIONS: Record<string, Record<string, { local?: string; reverse?: boolean }>> = {
  faculties_or_streams: { programs: { local: 'program_id' } },
  subjects: { faculties_or_streams: { local: 'faculty_id' } },
  content: { subjects: { local: 'subject_id' }, users: { local: 'uploaded_by' } },
  quizzes: { subjects: { local: 'subject_id' }, users: { local: 'created_by' } },
  results: { quizzes: { local: 'quiz_id' }, users: { local: 'user_id' } },
  bookmarks: { content: { local: 'content_id' }, subjects: { local: 'subject_id' }, users: { local: 'user_id' } },
  downloads_log: { content: { local: 'content_id' }, users: { local: 'user_id' } },
  submissions: { content: { local: 'content_id' }, users: { local: 'contributor_id' } },
  discussion_posts: { subjects: { local: 'subject_id' }, users: { local: 'user_id' }, discussion_replies: { reverse: true } },
  discussion_replies: { users: { local: 'user_id' }, discussion_posts: { local: 'post_id' } },
}

interface Join {
  alias: string
  table: string
  hint: string | null
  inner: boolean
  cols: string[] | '*'
  aggregate: string | null
  reverse?: boolean
  nested: Join[]
}

interface Filter {
  op: 'eq' | 'neq' | 'in' | 'ilike' | 'gte' | 'lt' | 'is'
  col: string
  value: unknown
}

type Mutation =
  | { kind: 'insert'; row: Row }
  | { kind: 'upsert'; row: Row }
  | { kind: 'update'; cols: Row }
  | { kind: 'delete' }

function pick(row: Row, cols: string[] | '*'): Row {
  if (cols === '*') return { ...row }
  const out: Row = {}
  cols.forEach(c => { if (row[c] !== undefined) out[c] = row[c] })
  return out
}

function splitTop(sel: string): string[] {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of sel) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; continue }
    cur += ch
  }
  if (cur.trim()) parts.push(cur)
  return parts
}

function parseJoin(part: string): Join | null {
  const open = part.indexOf('(')
  if (open === -1) return null
  const close = part.lastIndexOf(')')
  if (close === -1) return null
  const head = part.slice(0, open).trim()
  const innerRaw = part.slice(open + 1, close)
  const aliasMatch = head.match(/^(.*?):?([\w]+)(![\w_]+)?$/)
  if (!aliasMatch) return null
  const alias = aliasMatch[1] || aliasMatch[2]
  const table = aliasMatch[2]
  const hint = aliasMatch[3] ? aliasMatch[3].slice(1) : null
  const inner = hint === 'inner'
  const cols: string[] = []
  const nested: Join[] = []
  let agg: string | null = null
  for (const sub of splitTop(innerRaw)) {
    const t = sub.trim()
    if (!t) continue
    if (t === '*') { cols.length = 0; continue }
    const subJoin = parseJoin(t)
    if (subJoin) { nested.push(subJoin); continue }
    if (t === 'count') { agg = 'count'; continue }
    cols.push(t)
  }
  return {
    alias,
    table,
    hint: inner ? null : hint,
    inner,
    cols: cols.length ? cols : '*',
    aggregate: agg,
    nested,
  }
}

function parseSelect(sel: string): { base: string[] | '*'; joins: Join[] } {
  const base: string[] = []
  const joins: Join[] = []
  for (const part of splitTop(sel)) {
    const p = part.trim()
    if (!p || p === '*') continue
    if (p.includes('(')) {
      const j = parseJoin(p)
      if (j) { joins.push(j); continue }
    }
    base.push(p)
  }
  return { base: base.length ? base : '*', joins }
}

function fkColumn(localTable: string, join: Join): { fk: string | null; reverse: boolean } {
  if (join.hint && join.hint.endsWith('_fkey')) {
    const hintFk = join.hint.replace('_fkey', '')
    const candidates = [hintFk, hintFk.replace(`${localTable}_`, '')]
    const sample = (DB[localTable as keyof typeof DB] as Row[])[0]
    const found = candidates.find(c => sample && c in sample)
    if (found) return { fk: found, reverse: false }
  }
  const rel = RELATIONS[localTable]?.[join.table]
  if (rel?.reverse) return { fk: 'post_id', reverse: true }
  return { fk: rel?.local ?? null, reverse: false }
}

function applyJoin(row: Row, join: Join, localTable: string): Row | null {
  const { fk, reverse } = fkColumn(localTable, join)
  const decorate = (relatedRows: Row[]): Row[] => {
    const picked = relatedRows.map(r => {
      const full = { ...r }
      join.nested.forEach(n => applyJoin(full, n, join.table))
      const out = pick(full, join.cols)
      join.nested.forEach(n => { if (full[n.alias] !== undefined) out[n.alias] = full[n.alias] })
      return out
    })
    return picked
  }
  if (join.aggregate) {
    const related = DB[join.table as keyof typeof DB].filter(r => r[fk as string] === row.id) as Row[]
    row[join.alias] = [{ count: related.length }]
    return row
  }
  if (reverse) {
    const related = (DB.discussion_replies as Row[]).filter(r => r.post_id === row.id)
    row[join.alias] = decorate(related)
    return row
  }
  if (!fk) return row
  const related = (DB[join.table as keyof typeof DB] as Row[]).find(r => r.id === row[fk])
  if (!related) {
    if (join.inner) return null
    row[join.alias] = null
    return row
  }
  row[join.alias] = decorate([related])[0]
  return row
}

function matches(row: Row, f: Filter): boolean {
  const getVal = (r: Row, col: string): unknown => {
    if (!col.includes('.')) return r[col]
    const [head, ...rest] = col.split('.')
    let cur = r[head] as Row | null | undefined
    for (const key of rest) {
      if (cur == null) return undefined
      cur = cur[key] as Row | undefined
    }
    return cur
  }
  const v = getVal(row, f.col)
  switch (f.op) {
    case 'eq': return v === f.value
    case 'neq': return v !== f.value
    case 'in': return Array.isArray(f.value) && (f.value as unknown[]).includes(v)
    case 'ilike': {
      if (v == null) return false
      const pattern = String(f.value).replace(/%/g, '.*').toLowerCase()
      return new RegExp(`^${pattern}$`).test(String(v).toLowerCase())
    }
    case 'gte': return (v as number) >= (f.value as number)
    case 'lt': return (v as number) < (f.value as number)
    case 'is': return f.value === null ? v !== null && v !== undefined : v === f.value
    default: return true
  }
}

class DemoQueryBuilder implements PromiseLike<{ data: any; error: null; count?: number }> {
  private table: keyof typeof DB
  private filters: Filter[] = []
  private sel: string | null = null
  private countOpts: { count?: string; head?: boolean } | null = null
  private singleFlag = false
  private orderCol: string | null = null
  private orderAsc = true
  private limitN: number | null = null
  private mutation: Mutation | null = null
  private isNew = false

  constructor(table: keyof typeof DB, isNew = false) {
    this.table = table
    this.isNew = isNew
  }

  select(cols: string = '*', opts?: { count?: string; head?: boolean }): this {
    this.sel = cols
    if (opts) this.countOpts = opts
    return this
  }
  eq(col: string, value: unknown): this { this.filters.push({ op: 'eq', col, value }); return this }
  neq(col: string, value: unknown): this { this.filters.push({ op: 'neq', col, value }); return this }
  in(col: string, values: unknown[]): this { this.filters.push({ op: 'in', col, value: values }); return this }
  ilike(col: string, value: string): this { this.filters.push({ op: 'ilike', col, value }); return this }
  gte(col: string, value: number): this { this.filters.push({ op: 'gte', col, value }); return this }
  lt(col: string, value: number): this { this.filters.push({ op: 'lt', col, value }); return this }
  not(col: string, op: string, value: unknown): this { this.filters.push({ op: 'is', col, value }); return this }
  order(col: string, opts?: { ascending?: boolean }): this {
    this.orderCol = col
    this.orderAsc = opts?.ascending ?? true
    return this
  }
  limit(n: number): this { this.limitN = n; return this }
  single(): this { this.singleFlag = true; return this }
  insert(row: Row): this { this.mutation = { kind: 'insert', row }; return this }
  upsert(row: Row): this { this.mutation = { kind: 'upsert', row }; return this }
  update(cols: Row): this { this.mutation = { kind: 'update', cols }; return this }
  delete(): this { this.mutation = { kind: 'delete' }; return this }

  then<TResult1 = { data: any; error: null; count?: number }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: null; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }

  async execute(): Promise<{ data: any; error: null; count?: number }> {
    if (this.mutation) return this.applyMutation()
    return this.applySelect()
  }

  private async applyMutation(): Promise<{ data: unknown; error: null; count?: number }> {
    const table = DB[this.table]
    const mut = this.mutation!
    if (mut.kind === 'insert') {
      const row = { ...mut.row }
      if (!row.id) row.id = uuid(String(this.table).slice(0, 2))
      if (!row.created_at && this.table !== 'newsletter_subscribers') row.created_at = new Date().toISOString()
      table.push(row)
      if (this.sel && !this.singleFlag) {
        return { data: [row], error: null }
      }
      if (this.sel && this.singleFlag) {
        const parsed = this.sel ? parseSelect(this.sel) : { base: '*' as const, joins: [] }
        let out = pick(row, parsed.base)
        parsed.joins.forEach(j => { out = applyJoin(out, j, this.table) ?? out })
        return { data: out, error: null }
      }
      return { data: null, error: null }
    }
    if (mut.kind === 'upsert') {
      const idx = table.findIndex(r => r.id === mut.row.id)
      const row = { ...mut.row }
      if (idx >= 0) table[idx] = { ...table[idx], ...row }
      else {
        if (!row.id) row.id = uuid(String(this.table).slice(0, 2))
        if (!row.created_at && this.table !== 'newsletter_subscribers') row.created_at = new Date().toISOString()
        table.push(row)
      }
      return { data: this.singleFlag ? row : null, error: null }
    }
    if (mut.kind === 'update') {
      for (let i = table.length - 1; i >= 0; i--) {
        if (this.filters.every(f => matches(table[i], f))) table[i] = { ...table[i], ...mut.cols }
      }
      return { data: null, error: null }
    }
    if (mut.kind === 'delete') {
      for (let i = table.length - 1; i >= 0; i--) {
        if (this.filters.every(f => matches(table[i], f))) table.splice(i, 1)
      }
      return { data: null, error: null }
    }
    return { data: null, error: null }
  }

  private async applySelect(): Promise<{ data: unknown; error: null; count?: number }> {
    const table = DB[this.table] as Row[]
    let rows = table.slice()

    const parsed = this.sel ? parseSelect(this.sel) : { base: '*' as const, joins: [] as Join[] }

    // Apply joins (needed before dotted filters)
    if (parsed.joins.length) {
      const joined: Row[] = []
      rows.forEach(row => {
        let out: Row | null = { ...row }
        for (const j of parsed.joins) {
          out = applyJoin(out, j, this.table)
          if (!out) break
        }
        if (out) joined.push(out)
      })
      rows = joined
    }

    rows = rows.filter(r => this.filters.every(f => matches(r, f)))

    const count = rows.length

    if (this.countOpts?.head) {
      return { data: null, error: null, count }
    }

    if (this.orderCol) {
      const col = this.orderCol
      rows.sort((a, b) => {
        const av = a[col] as string | number
        const bv = b[col] as string | number
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv))
        return this.orderAsc ? cmp : -cmp
      })
    }

    if (this.limitN != null) rows = rows.slice(0, this.limitN)

    if (this.singleFlag) {
      return { data: rows[0] ?? null, error: null, count }
    }

    const out = rows.map(r => {
      const picked = pick(r, parsed.base)
      parsed.joins.forEach(j => { if (r[j.alias] !== undefined) picked[j.alias] = r[j.alias] })
      return picked
    })
    const result: { data: unknown; error: null; count?: number } = { data: out, error: null }
    if (this.countOpts?.count) result.count = count
    return result
  }
}

// ── Auth / Storage factories ─────────────────────────────────
function makeAuth(getSessionId: () => string | null, setSessionId: (id: string | null) => void) {
  return {
    async getUser() {
      const user = toAuthUser(getUserById(getSessionId()))
      return { data: { user }, error: null } as { data: { user: any }, error: null }
    },
    async getSession() {
      const user = toAuthUser(getUserById(getSessionId()))
      return {
        data: {
          session: user ? { user, access_token: 'demo-token', refresh_token: 'demo-refresh', expires_in: 3600 } : null,
        },
        error: null,
      } as { data: { session: any }, error: null }
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      void password
      let user = getUserByEmail(email)
      if (!user) user = createUser({ email, full_name: email.split('@')[0] || 'Demo User' })
      setSessionId(user.id as string)
      return { data: { user: toAuthUser(user), session: { user: toAuthUser(user), access_token: 'demo-token', refresh_token: 'demo-refresh', expires_in: 3600 } }, error: null } as { data: { user: any; session: any }, error: null }
    },
    async signInWithOAuth(opts?: { provider?: string; options?: unknown }) {
      void opts
      getUserById(DEMO_IDS.student)
      setSessionId(DEMO_IDS.student)
      return { data: { provider: 'google', url: '/api/auth/callback' }, error: null } as { data: any, error: null }
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, string>; emailRedirectTo?: string } }) {
      void password
      const existing = getUserByEmail(email)
      const user = existing ?? createUser({ email, full_name: options?.data?.full_name })
      setSessionId(user.id as string)
      return {
        data: {
          user: toAuthUser(user),
          session: { user: toAuthUser(user), access_token: 'demo-token', refresh_token: 'demo-refresh', expires_in: 3600 },
        },
        error: null,
      } as { data: { user: any; session: any }, error: null }
    },
    async signOut() {
      setSessionId(null)
      return { error: null } as { error: null }
    },
    async updateUser() {
      const user = toAuthUser(getUserById(getSessionId()))
      return { data: { user }, error: null } as { data: { user: any }, error: null }
    },
    async resetPasswordForEmail() {
      return { error: null } as { error: null }
    },
    onAuthStateChange(cb: (event: string, session: any) => void) {
      void cb
      return { data: { subscription: { unsubscribe() {} } } } as { data: { subscription: { unsubscribe(): void } } }
    },
  }
}

function makeStorage() {
  return {
    from() {
      return {
        async upload(path: string, file: unknown, opts: unknown) {
          void file
          void opts
          return { data: { path, id: uuid('f') }, error: null }
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `${DUMMY_FILE_URL}?demo=${encodeURIComponent(path)}` } }
        },
      }
    },
  }
}

export type DemoClient = ReturnType<typeof createDemoClient>

function createDemoClient(getSessionId: () => string | null, setSessionId: (id: string | null) => void) {
  return {
    auth: makeAuth(getSessionId, setSessionId),
    storage: makeStorage(),
    from(table: string) {
      if (!(table in DB)) {
        const noop = {
          then(onfulfilled?: (value: { data: unknown; error: null }) => unknown) {
            return Promise.resolve({ data: [], error: null }).then(onfulfilled)
          },
          select() { return noop },
          eq() { return noop },
          neq() { return noop },
          in() { return noop },
          ilike() { return noop },
          gte() { return noop },
          lt() { return noop },
          not() { return noop },
          order() { return noop },
          limit() { return noop },
          single() { return noop },
          insert() { return noop },
          upsert() { return noop },
          update() { return noop },
          delete() { return noop },
        } as unknown as DemoQueryBuilder
        return noop
      }
      return new DemoQueryBuilder(table as keyof typeof DB)
    },
  }
}

// Browser client — session stored in cookie + localStorage
export function createDemoBrowserClient() {
  return createDemoClient(demoGetSessionId, demoSetSession)
}

// Server client — session read from the request cookie store
export function createDemoServerClient(getCookie: (name: string) => string | undefined) {
  const getSessionId = () => {
    try {
      const v = getCookie ? getCookie('vs-demo-user') : undefined
      return v ? decodeURIComponent(v) : null
    } catch {
      return null
    }
  }
  return createDemoClient(getSessionId, () => {})
}
