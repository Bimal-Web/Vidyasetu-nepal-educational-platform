import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuizSession } from './QuizSession'

interface QuizPageProps {
  params: Promise<{ quizId: string }>
}

import { MOCK_QUIZZES, MOCK_QUESTIONS } from '@/lib/data/mock-data'

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: quiz }, { data: questions }] = await Promise.all([
      supabase.from('quizzes').select('*, subjects(name, icon_key, color_key, faculties_or_streams(name))').eq('id', quizId).single(),
      supabase.from('questions').select('*').eq('quiz_id', quizId).order('id'),
    ])

    if (quiz && questions?.length) {
      return (
        <QuizSession
          quiz={quiz}
          questions={questions}
          userId={user?.id ?? null}
        />
      )
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to mock quiz:', err)
  }

  // Fallback to offline mock data
  const mockQuiz = (MOCK_QUIZZES as any[]).find(q => q.id === quizId)
  if (!mockQuiz) notFound()

  const mockQuestions = MOCK_QUESTIONS.filter(q => q.quiz_id === quizId)
  if (!mockQuestions.length) notFound()

  return (
    <QuizSession
      quiz={mockQuiz}
      questions={mockQuestions}
      userId={null}
    />
  )
}
