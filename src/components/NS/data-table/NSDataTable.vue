<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronUp, ChevronDown, MoreHorizontal, Search, Filter } from 'lucide-vue-next'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  filterable?: boolean
  render?: (value: any, row: any, index: number) => any
}

interface Action {
  key: string
  label: string
  icon?: any
  onClick: (row: any, index: number) => void
  disabled?: (row: any) => boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

interface Props {
  data?: any[]
  columns?: Column[]
  actions?: Action[]
  loading?: boolean
  selectable?: boolean
  searchable?: boolean
  filterable?: boolean
  pagination?: boolean
  currentPage?: number
  itemsPerPage?: number
  totalItems?: number
  showTotal?: boolean
  emptyMessage?: string
  loadingMessage?: string
  maxHeight?: string
  striped?: boolean
  hover?: boolean
  class?: string
  tableClass?: string
  headerClass?: string
  bodyClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  actions: () => [],
  loading: false,
  selectable: false,
  searchable: false,
  filterable: false,
  pagination: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  showTotal: true,
  emptyMessage: 'No data available',
  loadingMessage: 'Loading...',
  striped: true,
  hover: true,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [size: number]
  'selection-change': [selectedRows: any[]]
  'row-click': [row: any, index: number]
  'sort-change': [column: string, direction: 'asc' | 'desc' | null]
  'filter-change': [filters: Record<string, any>]
  'search': [query: string]
}>()

const selectedRows = ref<any[]>([])
const searchQuery = ref('')
const sortColumn = ref<string>('')
const sortDirection = ref<'asc' | 'desc' | null>(null)
const filters = ref<Record<string, any>>({})

const processedData = computed(() => {
  let result = [...(props.data || [])]

  // Apply search
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(row => {
      return props.columns.some(column => {
        const value = row[column.key]
        return value && value.toString().toLowerCase().includes(query)
      })
    })
  }

  // Apply filters
  if (props.filterable) {
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const rowValue = row[key]
          return rowValue && rowValue.toString().toLowerCase().includes(value.toString().toLowerCase())
        })
      }
    })
  }

  // Apply sorting
  if (sortColumn.value && sortDirection.value) {
    result.sort((a, b) => {
      const aValue = a[sortColumn.value]
      const bValue = b[sortColumn.value]
      
      if (aValue === bValue) return 0
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }

  return result
})

const currentPageData = computed(() => {
  if (!props.pagination) return processedData.value
  
  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return processedData.value.slice(start, end)
})

const toggleSelection = (row: any) => {
  const index = selectedRows.value.findIndex(r => r === row)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  emit('selection-change', selectedRows.value)
}

const toggleAllSelection = () => {
  if (selectedRows.value.length === currentPageData.value.length) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...currentPageData.value]
  }
  emit('selection-change', selectedRows.value)
}

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  if (sortColumn.value === column.key) {
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else {
      sortDirection.value = null
      sortColumn.value = ''
    }
  } else {
    sortColumn.value = column.key
    sortDirection.value = 'asc'
  }
  
  emit('sort-change', sortColumn.value, sortDirection.value)
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  emit('search', query)
}

const handleFilterChange = (key: string, value: any) => {
  filters.value[key] = value
  emit('filter-change', filters.value)
}

const isAllSelected = computed(() => 
  currentPageData.value.length > 0 && selectedRows.value.length === currentPageData.value.length
)

const isIndeterminate = computed(() => 
  selectedRows.value.length > 0 && selectedRows.value.length < currentPageData.value.length
)

const containerClasses = computed(() => {
  return cn('w-full space-y-4', props.class)
})

const tableClasses = computed(() => {
  return cn('w-full', props.tableClass)
})

const headerClasses = computed(() => {
  return cn('[&_tr]:border-b', props.headerClass)
})

const bodyClasses = computed(() => {
  const baseClasses = '[&_tr:last-child]:border-0'
  
  const styleClasses = {
    '[&_tr]:border-b': props.striped,
    '[&_tr:nth-child(even)]:bg-muted/50': props.striped,
    '[&_tr:hover:bg-muted/50]:not(.selected)': props.hover,
  }

  return cn(baseClasses, styleClasses, props.bodyClass)
})

// Watch for selection changes
watch(() => props.currentPage, () => {
  selectedRows.value = []
  emit('selection-change', selectedRows.value)
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Header with search and filters -->
    <div class="flex items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div v-if="searchable" class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            :model-value="searchQuery"
            @update:model-value="handleSearch"
            placeholder="Search..."
            class="pl-9 w-64"
          />
        </div>

        <!-- Filters -->
        <div v-if="filterable" class="flex items-center gap-2">
          <Filter class="h-4 w-4 text-muted-foreground" />
          <div v-for="column in columns.filter(c => c.filterable)" :key="column.key">
            <Input
              :model-value="filters[column.key]"
              @update:model-value="(value) => handleFilterChange(column.key, value)"
              :placeholder="`Filter ${column.label}...`"
              class="w-32"
            />
          </div>
        </div>
      </div>

      <!-- Total count -->
      <div v-if="showTotal" class="text-sm text-muted-foreground">
        {{ processedData.length }} items total
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table :class="tableClasses">
        <TableHeader :class="headerClasses">
          <TableRow>
            <!-- Select all checkbox -->
            <TableHead v-if="selectable" class="w-12">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleAllSelection"
                class="rounded border-gray-300"
              />
            </TableHead>

            <!-- Column headers -->
            <TableHead
              v-for="column in columns"
              :key="column.key"
              :class="cn(
                'relative',
                {
                  'text-left': column.align === 'left' || !column.align,
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right',
                  'cursor-pointer hover:bg-muted/50': column.sortable
                }
              )"
              :style="{ width: column.width }"
              @click="handleSort(column)"
            >
              <div class="flex items-center gap-1">
                {{ column.label }}
                <div v-if="column.sortable" class="flex flex-col">
                  <ChevronUp 
                    :class="cn(
                      'h-3 w-3',
                      sortColumn === column.key && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground'
                    )" 
                  />
                  <ChevronDown 
                    :class="cn(
                      'h-3 w-3 -mt-1',
                      sortColumn === column.key && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground'
                    )" 
                  />
                </div>
              </div>
            </TableHead>

            <!-- Actions column -->
            <TableHead v-if="actions.length > 0" class="w-16">
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody :class="bodyClasses">
          <!-- Loading state -->
          <TableRow v-if="loading">
            <TableCell :colspan="columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)" class="text-center py-8">
              <div class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>{{ loadingMessage }}</span>
              </div>
            </TableCell>
          </TableRow>

          <!-- Empty state -->
          <TableRow v-else-if="currentPageData.length === 0">
            <TableCell :colspan="columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)" class="text-center py-8">
              {{ emptyMessage }}
            </TableCell>
          </TableRow>

          <!-- Data rows -->
          <TableRow 
            v-else
            v-for="(row, index) in currentPageData"
            :key="`row-${index}`"
            :class="{
              'selected': selectedRows.includes(row)
            }"
            @click="handleRowClick(row, index)"
            class="cursor-pointer"
          >
            <!-- Selection checkbox -->
            <TableCell v-if="selectable" class="w-12">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row)"
                @change="toggleSelection(row)"
                class="rounded border-gray-300"
              />
            </TableCell>

            <!-- Data cells -->
            <TableCell
              v-for="column in columns"
              :key="column.key"
              :class="cn(
                {
                  'text-left': column.align === 'left' || !column.align,
                  'text-center': column.align === 'center',
                  'text-right': column.align === 'right'
                }
              )"
            >
              <slot 
                :name="`cell-${column.key}`" 
                :row="row" 
                :value="row[column.key]" 
                :column="column" 
                :index="index"
              >
                <span v-if="column.render">
                  {{ column.render(row[column.key], row, index) }}
                </span>
                <span v-else>
                  {{ row[column.key] }}
                </span>
              </slot>
            </TableCell>

            <!-- Actions -->
            <TableCell v-if="actions.length > 0">
              <div class="flex items-center justify-end space-x-1">
                <Button
                  v-for="action in actions"
                  :key="action.key"
                  :variant="action.variant || 'ghost'"
                  :size="sm"
                  :disabled="action.disabled ? action.disabled(row) : false"
                  @click.stop="action.onClick(row, index)"
                >
                  <component v-if="action.icon" :is="action.icon" class="h-4 w-4" />
                  {{ action.label }}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="mt-4">
      <slot name="pagination" :current-page="currentPage" :total-items="processedData.length">
        <!-- Built-in pagination placeholder -->
        <div class="flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, processedData.length) }} of {{ processedData.length }} items
          </div>
          <div class="text-sm text-muted-foreground">
            Page {{ currentPage }} of {{ Math.ceil(processedData.length / itemsPerPage) }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>