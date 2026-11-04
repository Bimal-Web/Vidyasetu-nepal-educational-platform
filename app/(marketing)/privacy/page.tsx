import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | VidyaSetu',
  description: 'Learn how VidyaSetu collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-section text-slate-800 dark:text-slate-100 mb-2">Privacy Policy</h1>
      <p className="text-caption text-slate-400 mb-8">Last updated: August 2025</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us when you create an account (name, email address), 
            upload content, or interact with features on VidyaSetu. We also automatically collect usage data such as 
            quiz results, download history, and session information to improve your learning experience.`,
          },
          {
            title: '2. How We Use Your Information',
            content: `We use collected information to provide and improve our educational services, personalize your learning 
            dashboard, track your academic progress, enable the contributor review system, and communicate updates 
            about the platform. We do NOT sell your personal data to third parties.`,
          },
          {
            title: '3. Data Security',
            content: `Your data is stored securely using Supabase (PostgreSQL) with industry-standard encryption at rest and 
            in transit. Authentication is handled via Supabase Auth with support for email/password and Google OAuth. 
            We follow responsible data handling practices aligned with international standards.`,
          },
          {
            title: '4. Cookies',
            content: `VidyaSetu uses minimal cookies for authentication (session tokens) and user preferences (dark mode setting). 
            We do not use advertising cookies or third-party tracking cookies.`,
          },
          {
            title: '5. User Rights',
            content: `You have the right to access, correct, or delete your personal data. To request account deletion or 
            data export, please contact us at support@vidyasetu.edu.np. We will process your request within 30 days.`,
          },
          {
            title: '6. Third-Party Services',
            content: `We use Supabase for database and authentication, and Vercel for hosting. These services have their own 
            privacy policies. Content uploaded to VidyaSetu is stored in Supabase Storage. Google OAuth is available 
            as an optional authentication method.`,
          },
          {
            title: '7. Changes to This Policy',
            content: `We may update this Privacy Policy periodically. Significant changes will be communicated via the platform. 
            Continued use of VidyaSetu after changes constitutes acceptance of the updated policy.`,
          },
          {
            title: '8. Contact',
            content: `For privacy-related questions, contact us at: support@vidyasetu.edu.np\nVidyaSetu — Mechi Multiple Campus, Tribhuvan University, Nepal.`,
          },
        ].map(section => (
          <div key={section.title} className="card p-6">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{section.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
