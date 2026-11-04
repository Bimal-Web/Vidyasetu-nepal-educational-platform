import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidyasetu.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = [
    '', '/about', '/privacy', '/terms',
    '/browse', '/programs', '/quizzes', '/leaderboard',
    '/login', '/signup', '/forgot-password',
  ].map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  })) as MetadataRoute.Sitemap

  return staticRoutes
}