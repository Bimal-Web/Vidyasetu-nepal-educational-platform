import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'VidyaSetu — The Bridge to Every Exam',
  description:
    'Nepal\'s most comprehensive free digital education platform. Curated notes, past papers, MCQ practice, and timed quizzes for Secondary, Higher Secondary, Bachelor, and Loksewa exams.',
  keywords: ['Nepal education', 'SEE notes', 'NEB notes', 'Loksewa preparation', 'past papers Nepal', 'free study materials'],
  openGraph: {
    title: 'VidyaSetu — The Bridge to Every Exam',
    description: 'Free digital education platform for Nepali students.',
    siteName: 'VidyaSetu',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('vs-dark');var d=t==='true'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}
try{var clean=function(){var els=document.querySelectorAll('[fdprocessedid]');for(var i=0;i<els.length;i++){els[i].removeAttribute('fdprocessedid')}};clean();if(typeof MutationObserver!=='undefined'){new MutationObserver(clean).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['fdprocessedid']})}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.className} overflow-x-clip min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
