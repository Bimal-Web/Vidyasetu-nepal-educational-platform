import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuizSession } from './QuizSession'

interface QuizPageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: quiz }, { data: questions }] = await Promise.all([
    supabase.from('quizzes').select('*, subjects(name, icon_key, color_key, faculties_or_streams(name))').eq('id', quizId).single(),
    supabase.from('questions').select('*').eq('quiz_id', quizId).order('id'),
  ])

  if (!quiz || !questions?.length) notFound()

  return (
    <QuizSession
      quiz={quiz}
      questions={questions}
      userId={user?.id ?? null}
    />
  )
}
