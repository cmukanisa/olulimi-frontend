import type { CourseEnrollment } from '~/types/course'

export const useEnrollments = () => {
  const { apiFetch } = useApi()
  const enrollments = ref<CourseEnrollment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchEnrollments = async () => {
    loading.value = true
    try {
      enrollments.value = await apiFetch<CourseEnrollment[]>('/enrollments')
    } catch {
      enrollments.value = []
    } finally {
      loading.value = false
    }
  }

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.value.some((e) => e.courseId === courseId)
  }

  const enroll = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      await apiFetch('/enrollments', {
        method: 'POST',
        body: { courseId },
      })
      await fetchEnrollments()
      return true
    } catch (e: any) {
      error.value = e?.data?.message || "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  const unenroll = async (courseId: string) => {
    loading.value = true
    error.value = null
    try {
      const enrollment = enrollments.value.find((e) => e.courseId === courseId)
      if (enrollment) {
        await apiFetch(`/enrollments/${enrollment.id}`, { method: 'DELETE' })
        await fetchEnrollments()
      }
      return true
    } catch (e: any) {
      error.value = e?.data?.message || 'Erreur lors de la désinscription'
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchMyEnrollments = async () => {
    await fetchEnrollments()
    return enrollments.value
  }

  return { enrollments, loading, error, fetchEnrollments, fetchMyEnrollments, isEnrolled, enroll, unenroll }
}
