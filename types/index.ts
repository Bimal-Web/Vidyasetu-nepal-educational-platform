// ============================================================
// VidyaSetu — Shared TypeScript Types (matching DB schema)
// ============================================================

export type UserRole = 'student' | 'contributor' | 'admin'
export type AuthProvider = 'email' | 'google'
export type ContentType = 'note' | 'past_paper' | 'mcq_set'
export type ContentStatus = 'pending' | 'approved' | 'rejected'
export type SubmissionStatus = 'under_review' | 'approved' | 'rejected'
export type CorrectOption = 'a' | 'b' | 'c' | 'd'

export interface User {
  id: string
  full_name: string
  email: string
  auth_provider: AuthProvider
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Program {
  id: string
  name: string
  level_order: number
}

export interface FacultyOrStream {
  id: string
  program_id: string
  name: string
  programs?: Program
}

export interface Subject {
  id: string
  faculty_id: string
  name: string
  grade_or_semester: string
  description: string
  icon_key: string
  color_key: string
  faculties_or_streams?: FacultyOrStream
  _count?: {
    notes: number
    past_papers: number
  }
}

export interface Content {
  id: string
  subject_id: string
  uploaded_by: string
  title: string
  type: ContentType
  file_url?: string
  drive_url?: string
  file_size?: number
  status: ContentStatus
  views: number
  downloads: number
  created_at: string
  subjects?: Subject
  users?: User
}

export interface Quiz {
  id: string
  subject_id: string
  title: string
  question_count: number
  time_limit_minutes: number
  created_by: string
  subjects?: Subject
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: CorrectOption
  explanation?: string
}

export interface Result {
  id: string
  user_id: string
  quiz_id: string
  score: number
  correct_count: number
  incorrect_count: number
  skipped_count: number
  time_taken_seconds: number
  attempted_at: string
  quizzes?: Quiz
}

export interface Bookmark {
  id: string
  user_id: string
  content_id?: string
  subject_id?: string
  created_at: string
  content?: Content
  subjects?: Subject
}

export interface DownloadLog {
  id: string
  user_id: string
  content_id: string
  downloaded_at: string
  content?: Content
}

export interface Submission {
  id: string
  contributor_id: string
  content_id: string
  status: SubmissionStatus
  reviewed_by?: string
  reviewed_at?: string
  content?: Content
  users?: User
}

// Analytics / aggregation types
export interface StatCounter {
  resources: number
  learners: number
  subjects: number
}

export interface ContributorStats {
  total_contributions: number
  pending_reviews: number
  total_downloads: number
  impact_score: number
}
