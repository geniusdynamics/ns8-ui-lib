<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  currentPage?: number
  totalItems?: number
  itemsPerPage?: number
  totalPages?: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  showTotal?: boolean
  disabled?: boolean
  size?: 'sm' | 'default' | 'lg'
  align?: 'start' | 'center' | 'end'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  itemsPerPage: 10,
  showSizeChanger: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showQuickJumper: false,
  showTotal: true,
  disabled: false,
  size: 'default',
  align: 'start',
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [size: number]
  'page-change': [page: number]
  'size-change': [size: number]
}>()

const calculatedTotalPages = computed(() => {
  if (props.totalPages) {
    return props.totalPages
  }
  return Math.ceil((props.totalItems || 0) / props.itemsPerPage)
})

const currentPageInternal = computed({
  get: () => props.currentPage,
  set: (page: number) => {
    emit('update:currentPage', page)
    emit('page-change', page)
  }
})

const itemsPerPageInternal = computed({
  get: () => props.itemsPerPage,
  set: (size: number) => {
    emit('update:itemsPerPage', size)
    emit('size-change', size)
  }
})

const pages = computed(() => {
  const total = calculatedTotalPages.value
  const current = currentPageInternal.value
  const delta = 2 // Number of pages to show on each side
  
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach((i, index) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

const canGoPrev = computed(() => currentPageInternal.value > 1)
const canGoNext = computed(() => currentPageInternal.value < calculatedTotalPages.value)

const containerClasses = computed(() => {
  const baseClasses = 'flex flex-wrap items-center gap-2'
  
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end'
  }

  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  }

  return cn(baseClasses, alignClasses[props.align], sizeClasses[props.size], props.class)
})

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    default: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  }

  return cn(baseClasses, sizeClasses[props.size])
})

const activeButtonClasses = computed(() => {
  return cn(buttonClasses.value, 'border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground')
})

const jumperClasses = computed(() => {
  const baseClasses = 'inline-flex items-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return cn(baseClasses, sizeClasses[props.size])
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= calculatedTotalPages.value && !props.disabled) {
    currentPageInternal.value = page
  }
}

const handlePrev = () => {
  if (canGoPrev.value && !props.disabled) {
    currentPageInternal.value--
  }
}

const handleNext = () => {
  if (canGoNext.value && !props.disabled) {
    currentPageInternal.value++
  }
}

const handleJumperChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const page = parseInt(target.value, 10)
  
  if (!isNaN(page)) {
    goToPage(page)
  }
}
</script>

<template>
  <div :class="containerClasses">
    <!-- Total items display -->
    <div v-if="showTotal && totalItems" class="text-sm text-muted-foreground">
      Total: {{ totalItems }} items
    </div>

    <!-- Page size changer -->
    <div v-if="showSizeChanger" class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">Items per page:</span>
      <select 
        v-model="itemsPerPageInternal"
        :disabled="disabled"
        :class="jumperClasses"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>

    <!-- Pagination buttons -->
    <div class="flex items-center gap-1">
      <!-- Previous button -->
      <button
        :class="buttonClasses"
        :disabled="!canGoPrev || disabled"
        @click="handlePrev"
        aria-label="Previous page"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <!-- Page numbers -->
      <template v-for="(page, index) in pages" :key="`page-${index}`">
        <button
          v-if="typeof page === 'number'"
          :class="page === currentPageInternal ? activeButtonClasses : buttonClasses"
          :disabled="disabled"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="flex items-center justify-center h-8 w-8 text-sm text-muted-foreground"
        >
          <MoreHorizontal class="h-4 w-4" />
        </span>
      </template>

      <!-- Next button -->
      <button
        :class="buttonClasses"
        :disabled="!canGoNext || disabled"
        @click="handleNext"
        aria-label="Next page"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <!-- Quick jumper -->
    <div v-if="showQuickJumper" class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">Go to page:</span>
      <input
        type="number"
        :min="1"
        :max="calculatedTotalPages"
        :value="currentPageInternal"
        :disabled="disabled"
        :class="jumperClasses"
        @change="handleJumperChange"
        @keyup.enter="handleJumperChange"
      />
    </div>
  </div>
</template>