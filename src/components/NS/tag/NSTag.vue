<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  label?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'gray'
  size?: 'default' | 'sm' | 'lg'
  interactive?: boolean
  removable?: boolean
  disabled?: boolean
  icon?: string | object
  clearAriaLabel?: string
  title?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  interactive: false,
  removable: false,
  clearAriaLabel: 'Remove tag',
})

const emit = defineEmits<{
  remove: []
  click: [event: Event]
}>()

const isClickable = computed(() => props.interactive && !props.disabled)
const isFilter = computed(() => props.removable)

const tagClasses = computed(() => {
  const baseClasses = 'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
  
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
    warning: 'border-transparent bg-orange-500 text-white hover:bg-orange-600',
    info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
    gray: 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
  }

  const sizeClasses = {
    default: 'px-2.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  return cn(
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    {
      'cursor-pointer hover:opacity-80': isClickable.value,
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-default': isFilter.value && !interactive,
    },
    props.class
  )
})

const handleClick = (event: Event) => {
  if (isClickable.value) {
    emit('click', event)
  }
}

const handleRemove = (event: Event) => {
  event.stopPropagation()
  if (!props.disabled) {
    emit('remove')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isFilter.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    handleRemove(event)
  }
}
</script>

<template>
  <component
    :is="isClickable ? 'button' : 'div'"
    :class="tagClasses"
    :disabled="disabled"
    :title="title || label"
    @click="handleClick"
    @keydown="handleKeydown"
    :aria-label="label"
    role="button"
    tabindex="0"
  >
    <!-- Icon slot/component -->
    <div v-if="icon && !isFilter" class="flex items-center justify-center">
      <component 
        v-if="typeof icon === 'object'" 
        :is="icon" 
        class="h-3 w-3" 
      />
      <div 
        v-else-if="typeof icon === 'string'" 
        v-html="icon" 
        class="h-3 w-3" 
      />
    </div>

    <!-- Label content -->
    <span class="truncate max-w-[200px]">
      <slot>{{ label }}</slot>
    </span>

    <!-- Remove button for filter tags -->
    <button
      v-if="isFilter"
      type="button"
      :class="cn( 'flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
        'ml-1 -mr-1 h-4 w-4 p-0',
        {
          'opacity-50 cursor-not-allowed': disabled,
        }
      )"
      :disabled="disabled"
      :aria-label="clearAriaLabel"
      :title="clearAriaLabel"
      @click="handleRemove"
    >
      <X class="h-3 w-3" />
    </button>
  </component>
</template>