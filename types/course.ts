export interface Course {
  id: string
  title: string
  description: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  coverImage: string | null
  status: 'draft' | 'published' | 'archived'
  authorId: string
  authorName: string
  sessionsCount: number
  createdAt: string
}

export interface Session {
  id: string
  title: string
  description: string | null
  sortOrder: number
  status: string
  courseId: string
  chaptersCount: number
  createdAt: string
}

export interface Chapter {
  id: string
  title: string
  content: string | null
  sortOrder: number
  estimatedDuration: number | null
  type: 'theory' | 'practice'
  audioUrl: string | null
  videoUrl: string | null
  sessionId: string
  createdAt: string
}

export interface CourseEnrollment {
  id: string
  courseId: string
  courseTitle: string
  userId: string
  userName: string
  enrolledAt: string
  completedAt: string | null
  isCompleted: boolean
}

export interface CreateCourseRequest {
  title: string
  description?: string
  level: string
  coverImage?: string
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  level?: string
  coverImage?: string
  status?: string
}

export interface CreateSessionRequest {
  title: string
  description?: string
  sortOrder: number
}

export interface CreateChapterRequest {
  title: string
  content?: string
  sortOrder: number
  estimatedDuration?: number
  type: string
  audioUrl?: string
  videoUrl?: string
}

export interface TeacherCourseStats {
  courseId: string
  courseTitle: string
  enrollmentCount: number
  sessionsCount: number
  averageCompletionRate: number
  averageScore: number
}
