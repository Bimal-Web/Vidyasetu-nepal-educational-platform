import type { Metadata } from 'next'
import { AboutClient } from './AboutClient'

export const metadata: Metadata = {
  title: 'About VidyaSetu — The Bridge of Knowledge across Nepal',
  description:
    'VidyaSetu (विद्यासेतु) is Nepal\'s open digital education platform. Democratizing access to CDC, NEB, Tribhuvan University, and Loksewa study notes, model papers, and examination preparation for 120,000+ students across all 77 districts.',
  keywords: [
    'About VidyaSetu',
    'Nepal digital education',
    'Tribhuvan University notes',
    'CDC model question papers',
    'NEB SEE notes',
    'Loksewa preparation Nepal',
    'Free education Nepal',
  ],
  openGraph: {
    title: 'About VidyaSetu — The Bridge of Knowledge across Nepal',
    description:
      'Democratizing verified academic resources, model question papers, and interactive quizzes for students across all 77 districts of Nepal. 100% free forever.',
    type: 'website',
  },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'VidyaSetu',
    alternateName: 'विद्यासेतु',
    description:
      "Nepal's open digital education repository bridging the academic resource divide for students across all 77 districts.",
    url: 'https://vidyasetu.edu.np/about',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NP',
      addressLocality: 'Bhadrapur',
      addressRegion: 'Koshi Province',
    },
    educationalCredentialAwarded: 'Secondary, Higher Secondary, and Undergraduate academic study resources',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <AboutClient />
      </div>
    </>
  )
}
