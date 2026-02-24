export interface Book {
  id: string
  title: string
  author: string
  description: string | null
  coverImage: string | null
  fileUrl: string | null
  language: string | null
  publicationYear: number | null
  categoryId: string | null
  categoryName: string | null
  createdAt: string
}

export interface BookCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  booksCount: number
}
