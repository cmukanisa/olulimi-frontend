export interface AdminStats {
  totalUsers: number
  totalTeachers: number
  totalCourses: number
  totalEnrollments: number
}

export interface AdminUpdateUserRequest {
  roles?: string[]
  isActive?: boolean
  fullName?: string
}
