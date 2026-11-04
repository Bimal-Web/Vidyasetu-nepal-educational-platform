import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | VidyaSetu',
  description: 'The terms and conditions governing your use of the VidyaSetu platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-section text-slate-800 dark:text-slate-100 mb-2">Terms of Service</h1>
      <p className="text-caption text-slate-400 mb-8">Last updated: August 2025</p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        {[
          {
            title: '1. Acceptance of Terms',
            content: `By accessing or using VidyaSetu, you agree to be bound by these Terms of Service and our Privacy Policy. 
            If you do not agree with any part of these terms, you should discontinue use of the platform immediately.`,
          },
          {
            title: '2. Description of Service',
            content: `VidyaSetu is a free digital education platform that provides study notes, past papers, and MCQ practice 
            to students in Nepal. The platform allows users to browse content, attempt quizzes, track progress, and — 
            as registered contributors — upload educational materials for review.`,
          },
          {
            title: '3. Account Responsibilities',
            content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity 
            that occurs under your account. You agree to provide accurate information when registering and to notify us 
            promptly of any unauthorized use of your account.`,
          },
          {
            title: '4. User-Generated Content',
            content: `Contributors retain ownership of the content they upload, but grant VidyaSetu a non-exclusive license 
            to store, display, and distribute it to registered users. Uploaded content must not violate copyright law, 
            contain defamatory material, or be inaccurate or intentionally misleading. We reserve the right to remove 
            any content that violates these terms.`,
          },
          {
            title: '5. Acceptable Use',
            content: `You agree not to: (a) misuse, reverse engineer, or attempt to disrupt the platform; (b) upload malicious 
            software or content; (c) impersonate another person or entity; (d) use automated scripts to scrape content 
            without permission; or (e) engage in any activity that interferes with other users' learning experience.`,
          },
          {
            title: '6. Intellectual Property',
            content: `The VidyaSetu name, logo, design, and platform code are the property of the VidyaSetu project team. 
            Study materials are shared for educational purposes and should not be resold or redistributed for commercial gain 
            without attribution to their original authors.`,
          },
          {
            title: '7. Disclaimers & Limitation of Liability',
            content: `Content on VidyaSetu is provided "as is" for educational purposes and may not reflect the latest syllabus. 
            We do not guarantee exam outcomes. To the maximum extent permitted by law, VidyaSetu shall not be liable for 
            any indirect, incidental, or consequential damages arising from use of the platform.`,
          },
          {
            title: '8. Changes to These Terms',
            content: `We may revise these Terms of Service at any time. Changes become effective when posted on this page. 
            Continued use of the platform after changes constitutes acceptance of the revised terms.`,
          },
          {
            title: '9. Contact',
            content: `Questions about these terms can be directed to: support@vidyasetu.edu.np\nVidyaSetu — Mechi Multiple Campus, Tribhuvan University, Nepal.`,
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
