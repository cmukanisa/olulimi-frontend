<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  searchable?: boolean
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  perPage: 10,
})

const searchQuery = ref('')
const currentPage = ref(1)
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const filteredData = computed(() => {
  let result = [...props.data]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((row) =>
      props.columns.some((col) => {
        const value = row[col.key]
        return value != null && String(value).toLowerCase().includes(query)
      })
    )
  }

  // Sort
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = a[sortKey.value] ?? ''
      const bVal = b[sortKey.value] ?? ''
      const comparison = String(aVal).localeCompare(String(bVal), 'fr', { numeric: true })
      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.perPage))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  return filteredData.value.slice(start, start + props.perPage)
})

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Reset page when searching
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    <!-- Search -->
    <div v-if="searchable" class="border-b border-gray-200 px-4 py-3">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher..."
          class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3"
              :class="{ 'cursor-pointer select-none hover:text-gray-700': col.sortable }"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
                <template v-if="col.sortable">
                  <svg
                    v-if="sortKey === col.key"
                    class="h-3 w-3"
                    :class="sortOrder === 'desc' ? 'rotate-180' : ''"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg v-else class="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(row, index) in paginatedData"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-gray-700"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td
              :colspan="columns.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              Aucune donnee trouvee.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-gray-200 px-4 py-3"
    >
      <p class="text-sm text-gray-500">
        {{ (currentPage - 1) * perPage + 1 }} -
        {{ Math.min(currentPage * perPage, filteredData.length) }}
        sur {{ filteredData.length }} resultats
      </p>
      <div class="flex items-center gap-1">
        <button
          class="rounded-lg px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Precedent
        </button>
        <template v-for="page in totalPages" :key="page">
          <button
            class="rounded-lg px-3 py-1 text-sm transition-colors"
            :class="[
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>
        <button
          class="rounded-lg px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>
