import type { DictionaryEntry } from '~/types/dictionary'

export const useDictionary = () => {
  const { apiFetch } = useApi()
  const entries = ref<DictionaryEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const searchEntries = (query: string) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    if (!query.trim()) {
      entries.value = []
      loading.value = false
      return
    }

    loading.value = true
    debounceTimer = setTimeout(async () => {
      error.value = null
      try {
        entries.value = await apiFetch<DictionaryEntry[]>(`/dictionary?search=${encodeURIComponent(query)}`)
      } catch (e: any) {
        error.value = e?.data?.message || 'Erreur lors de la recherche'
      } finally {
        loading.value = false
      }
    }, 300)
  }

  const fetchAllEntries = async () => {
    loading.value = true
    error.value = null
    try {
      entries.value = await apiFetch<DictionaryEntry[]>('/dictionary')
    } catch (e: any) {
      error.value = e?.data?.message || 'Erreur lors du chargement du dictionnaire'
    } finally {
      loading.value = false
    }
  }

  return { entries, loading, error, searchEntries, fetchAllEntries }
}
