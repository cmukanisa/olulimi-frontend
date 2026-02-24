import type { Book, BookCategory } from '~/types/library'

export const useLibrary = () => {
  const { apiFetch } = useApi()
  const books = ref<Book[]>([])
  const book = ref<Book | null>(null)
  const categories = ref<BookCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBooks = async (params?: { categoryId?: string }) => {
    loading.value = true
    error.value = null
    try {
      const query = params?.categoryId ? `?categoryId=${params.categoryId}` : ''
      books.value = await apiFetch<Book[]>(`/books${query}`)
    } catch (e: any) {
      error.value = e?.data?.message || 'Erreur lors du chargement de la bibliothèque'
    } finally {
      loading.value = false
    }
  }

  const fetchBook = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      book.value = await apiFetch<Book>(`/books/${id}`)
    } catch (e: any) {
      error.value = e?.data?.message || 'Livre introuvable'
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      categories.value = await apiFetch<BookCategory[]>('/book-categories')
    } catch {
      categories.value = []
    }
  }

  return { books, book, categories, loading, error, fetchBooks, fetchBook, fetchCategories }
}
