import type { Course, Session, Chapter, CreateCourseRequest, UpdateCourseRequest, CreateSessionRequest, CreateChapterRequest } from '~/types/course'

export const useCourses = () => {
  const { apiFetch } = useApi()
  const courses = ref<Course[]>([])
  const course = ref<Course | null>(null)
  const sessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCourses = async (params?: { level?: string; search?: string }) => {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params?.level && params.level !== 'all') query.append('level', params.level)
      if (params?.search) query.append('search', params.search)
      const queryStr = query.toString() ? `?${query.toString()}` : ''
      courses.value = await apiFetch<Course[]>(`/courses${queryStr}`)
    } catch (e: any) {
      error.value = e?.data?.message || 'Erreur lors du chargement des cours'
    } finally {
      loading.value = false
    }
  }

  const fetchCourse = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      course.value = await apiFetch<Course>(`/courses/${id}`)
    } catch (e: any) {
      error.value = e?.data?.message || 'Cours introuvable'
    } finally {
      loading.value = false
    }
  }

  const fetchSessions = async (courseId: string) => {
    try {
      sessions.value = await apiFetch<Session[]>(`/courses/${courseId}/sessions`)
    } catch {
      sessions.value = []
    }
  }

  const fetchChapters = async (sessionId: string) => {
    try {
      return await apiFetch<Chapter[]>(`/sessions/${sessionId}/chapters`)
    } catch {
      return []
    }
  }

  const createCourse = async (data: CreateCourseRequest) => {
    return await apiFetch<Course>('/teacher/courses', {
      method: 'POST',
      body: data,
    })
  }

  const updateCourse = async (courseId: string, data: UpdateCourseRequest) => {
    return await apiFetch<Course>(`/teacher/courses/${courseId}`, {
      method: 'PUT',
      body: data,
    })
  }

  const deleteCourse = async (courseId: string) => {
    await apiFetch(`/teacher/courses/${courseId}`, { method: 'DELETE' })
  }

  const createSession = async (courseId: string, data: CreateSessionRequest) => {
    return await apiFetch<Session>(`/courses/${courseId}/sessions`, {
      method: 'POST',
      body: data,
    })
  }

  const createChapter = async (sessionId: string, data: CreateChapterRequest) => {
    return await apiFetch<Chapter>(`/sessions/${sessionId}/chapters`, {
      method: 'POST',
      body: data,
    })
  }

  return {
    courses, course, sessions, loading, error,
    fetchCourses, fetchCourse, fetchSessions, fetchChapters,
    createCourse, updateCourse, deleteCourse,
    createSession, createChapter,
  }
}
