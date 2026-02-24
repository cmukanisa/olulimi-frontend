import type { Course, Session, TeacherCourseStats } from '~/types/course'

export const useTeacher = () => {
  const { apiFetch } = useApi()

  const fetchMyCourses = async () => {
    return await apiFetch<Course[]>('/teacher/courses')
  }

  const fetchMyCourse = async (id: string) => {
    return await apiFetch<Course>(`/teacher/courses/${id}`)
  }

  const fetchMyCourseSessions = async (courseId: string) => {
    return await apiFetch<Session[]>(`/teacher/courses/${courseId}/sessions`)
  }

  const fetchMyCourseStats = async (courseId: string) => {
    return await apiFetch<TeacherCourseStats>(`/teacher/courses/${courseId}/stats`)
  }

  return { fetchMyCourses, fetchMyCourse, fetchMyCourseSessions, fetchMyCourseStats }
}
