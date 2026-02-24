import type { User } from '~/types/auth'
import type { AdminStats, AdminUpdateUserRequest } from '~/types/admin'

export const useAdmin = () => {
  const { apiFetch } = useApi()

  const fetchUsers = async () => {
    return await apiFetch<User[]>('/admin/users')
  }

  const fetchUser = async (id: string) => {
    return await apiFetch<User>(`/admin/users/${id}`)
  }

  const updateUser = async (id: string, data: AdminUpdateUserRequest) => {
    return await apiFetch<User>(`/admin/users/${id}`, { method: 'PUT', body: data })
  }

  const deactivateUser = async (id: string) => {
    await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
  }

  const fetchStats = async () => {
    return await apiFetch<AdminStats>('/admin/stats')
  }

  return { fetchUsers, fetchUser, updateUser, deactivateUser, fetchStats }
}
