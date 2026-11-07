import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MCQEngine } from './MCQEngine'

interface MCQPageProps {
  params: Promise<{ subjectId: string }>
}

import { MOCK_SUBJECTS, MOCK_QUIZZES, MOCK_QUESTIONS } from '@/lib/data/mock-data'

export default async function MCQPage({ params }: MCQPageProps) {
  const { subjectId } = await params

  try {
    const supabase = await createClient()

    // Auth
    const { data: { user } } = await supabase.auth.getUser()

    // Get subject
    const { data: subject } = await supabase
      .from('subjects')
      .select('*, faculties_or_streams(name, programs(name))')
      .eq('id', subjectId)
      .single()

    if (subject) {
      // Get first available quiz for this subject
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (quiz) {
        // Get questions
        const { data: questions } = await supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id)
          .order('id')

        if (questions && questions.length > 0) {
          return (
            <MCQEngine
              quizId={quiz.id}
              questions={questions}
              subjectName={subject.name}
              subjectCategory={(subject.faculties_or_streams as any)?.name ?? 'General'}
              timeLimit={quiz.time_limit_minutes}
              userId={user?.id ?? null}
            />
          )
        }
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, falling back to mock MCQ:', err)
  }

  // Fallback to offline mock data
  const mockSubject = MOCK_SUBJECTS.find(s => s.id === subjectId)
  if (!mockSubject) notFound()

  const mockQuiz = (MOCK_QUIZZES as any[]).find(q => q.subject_id === subjectId)
  if (!mockQuiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No quizzes yet</p>
        <p className="text-slate-400">No quiz has been created for {mockSubject.name} yet.</p>
      </div>
    )
  }

  const mockQuestions = MOCK_QUESTIONS.filter(q => q.quiz_id === mockQuiz.id)
  if (!mockQuestions.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No questions yet</p>
        <p className="text-slate-400">This quiz doesn&apos;t have any questions yet.</p>
      </div>
    )
  }

  return (
    <MCQEngine
      quizId={mockQuiz.id}
      questions={mockQuestions}
      subjectName={mockSubject.name}
      subjectCategory={(mockSubject.faculties_or_streams as any)?.name ?? 'General'}
      timeLimit={mockQuiz.time_limit_minutes}
      userId={null}
    />
  )
}
