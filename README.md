# VidyaSetu

**"The Bridge of Knowledge"** — A full-stack, production-grade free digital education platform for Nepali students.

> **Project:** BCA Final Year Project — Tribhuvan University, Mechi Multiple Campus  
> **Students:** Bimal Ghorsai & Dipesh Timsina  
> **Supervisor:** Mr. Bishal Ghimire

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 15 (App Router), TypeScript     |
| Styling    | Tailwind CSS v4, custom design tokens   |
| Auth       | Supabase Auth (email + Google OAuth)    |
| Database   | Supabase (PostgreSQL)                   |
| Storage    | Supabase Storage (`content-uploads`)    |
| Hosting    | Vercel (free tier)                      |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                         | Description                                      |
|----------------------------------|--------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`       | Your Supabase project URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Your Supabase anon/public key                    |
| `NEXT_PUBLIC_SITE_URL`           | App URL (e.g. `https://vidyasetu.vercel.app`)    |

---

## Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migrations in order:

```sql
-- Run first:
\i supabase/migrations/001_initial_schema.sql

-- Run second (after creating your first admin user):
\i supabase/migrations/002_seed_data.sql
```

3. Create a **Supabase Storage bucket** named `content-uploads`:
   - Go to Storage → New Bucket → Name: `content-uploads`
   - Toggle "Public bucket" ON (or configure signed URLs)

4. Enable **Google OAuth** in Supabase:
   - Go to Auth → Providers → Google
   - Add your Google OAuth Client ID and Secret from [console.cloud.google.com](https://console.cloud.google.com)
   - Set redirect URL to: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add the following environment variables in the Vercel dashboard (Settings → Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (set to your `.vercel.app` URL)

Then update the **Google OAuth redirect URL** and **Supabase Site URL** to match your production domain.

---

## Project Structure

```
vidyasetu/
├── app/
│   ├── (marketing)/        # Landing page, About, Terms, Privacy
│   │   └── blog/           # Blog listing + individual post pages
│   ├── (auth)/             # Login, Signup
│   ├── (student)/          # Dashboard, Browse, Subject, MCQ, Quiz
│   ├── (contributor)/      # Contribute / Contributor Console
│   ├── (admin)/            # Admin Panel
│   └── api/                # Auth callback, Download API
├── components/
│   ├── layout/             # Navbar, Footer, Logo
│   └── features/           # SubjectCard, MCQCard, UploadDropzone, StatCard
├── lib/
│   └── supabase/           # client.ts, server.ts, middleware.ts
├── types/                  # Shared TypeScript types
├── supabase/
│   └── migrations/         # SQL schema + seed data
└── .env.example
```

---

## Pages

| Route                       | Description                                  |
|-----------------------------|----------------------------------------------|
| `/`                         | Landing page with live DB stat counters      |
| `/browse`                   | Category explorer with sidebar filter        |
| `/subject/[id]`             | Subject detail with Notes/Papers/MCQ tabs    |
| `/mcq/[subjectId]`          | MCQ practice engine with live scoring        |
| `/quiz/[quizId]`            | Timed quiz session                           |
| `/quiz/[quizId]/result`     | Quiz result with score breakdown             |
| `/dashboard`                | Student dashboard (protected)                |
| `/login` & `/signup`        | Auth pages with Google OAuth                 |
| `/contribute`               | Contributor console (upload + submissions)   |
| `/admin`                    | Admin panel (submissions review + analytics) |
| `/blog`                     | Blog listing — exam guides & study tips      |
| `/blog/[slug]`              | Individual blog post with rich prose layout  |

---

## Blog Section

VidyaSetu includes a fully static, zero-dependency blog built directly in Next.js App Router — no CMS, no external library, no additional database tables needed.

**6 Articles Published:**

| # | Title | Category |
|---|-------|----------|
| 1 | How to Crack the SEE Exam | Exam Strategy |
| 2 | The Ultimate Loksewa Preparation Guide | Loksewa / PSC |
| 3 | 7 Science-Backed Study Techniques | Study Tips |
| 4 | Scoring A+ in NEB Grade 11 & 12 Science | NEB Science |
| 5 | BCA vs CSIT vs BE Computer Engineering | Higher Education |
| 6 | How Digital Learning is Transforming Nepal | EdTech Nepal |

**Technical implementation:**
- Posts stored as typed TypeScript objects in `app/(marketing)/blog/blogData.ts`
- Custom markdown-to-HTML renderer (no `react-markdown` or `remark` needed)
- Statically generated at build time via `generateStaticParams()`
- Per-post SEO `<title>` and `<meta description>` via `generateMetadata()`
- **Blog** link added to Navbar and Footer
- Blog teaser card grid added to the home landing page
- Color-coded category badges (indigo, green, violet, amber)
- Related articles shown at the bottom of every post
- Full dark mode support across all blog UI

---

## License

MIT — Free to use, modify, and distribute for educational purposes.
