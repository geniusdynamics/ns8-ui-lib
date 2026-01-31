<script setup lang="ts">
import { computed } from 'vue'
import { X, AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info'
  showCloseButton?: boolean
  actionLabel?: string
  closeAriaLabel?: string
  loading?: boolean
  timer?: number
  lowContrast?: boolean
  class?: string
  icon?: object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  showCloseButton: false,
  closeAriaLabel: 'Dismiss notification',
  loading: false,
  lowContrast: false,
})

const emit = defineEmits<{
  close: []
  action: []
}>()

const NotificationIcon = computed(() => {
  if (props.icon) {
    return props.icon
  }
  
  switch (props.variant) {
    case 'destructive':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'success':
      return CheckCircle
    case 'info':
    default:
      return Info
  }
})

const containerClasses = computed(() => {
  const baseClasses = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground'
  
  const variantClasses = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    warning: 'border-orange-500/50 text-orange-800 dark:border-orange-500 [&>svg]:text-orange-500 dark:text-orange-400',
    success: 'border-green-500/50 text-green-800 dark:border-green-500 [&>svg]:text-green-500 dark:text-green-400',
    info: 'border-blue-500/50 text-blue-800 dark:border-blue-500 [&>svg]:text-blue-500 dark:text-blue-400'
  }

  return cn(baseClasses, variantClasses[props.variant], {
    'opacity-75': props.lowContrast
  }, props.class)
})

const role = computed(() => {
  if (props.variant === 'destructive' || props.variant === 'warning') {
    return 'alert'
  }
  return 'status'
})

const ariaLive = computed(() => {
  if (props.variant === 'destructive') {
    return 'assertive'
  }
  return 'polite'
})

const hasTitle = computed(() => props.title || $slots.title)
const hasDescription = computed(() => props.description || $slots.description)
const hasAction = computed(() => props.actionLabel)
const hasTimer = computed(() => props.timer)
const hasLoading = computed(() => props.loading)

const showCloseButtonVisible = computed(() => props.showCloseButton && !hasLoading.value)
</script>

<template>
  <div
    :class="containerClasses"
    :role="role"
    :aria-live="ariaLive"
  >
    <!-- Icon -->
    <component
      :is="NotificationIcon"
      class="h-4 w-4"
    />

    <!-- Loading spinner -->
    <Loader2 
      v-if="loading"
      class="h-4 w-4 animate-spin absolute right-12 top-4"
    />

    <!-- Timer circle -->
    <div
      v-if="timer"
      class="h-4 w-4 absolute right-12 top-4"
    >
      <!-- You can integrate NSCircleTimer component here -->
      <div class="h-4 w-4 rounded-full border-2 border-current animate-pulse" />
    </div>

    <!-- Content -->
    <div class="grid gap-1">
      <!-- Title -->
      <h4
        v-if="hasTitle"
        class="text-sm font-medium leading-none"
      >
        <slot name="title">{{ title }}</slot>
      </h4>

      <!-- Description -->
      <p
        v-if="hasDescription"
        :class="cn('text-sm opacity-90', {
          'mr-12': hasAction || showCloseButtonVisible || hasTimer || hasLoading
        })"
      >
        <slot name="description">{{ description }}</slot>
      </p>

      <!-- Action button -->
      <button
        v-if="hasAction"
        type="button"
        class="inline-flex items-center text-sm font-medium underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>

    <!-- Close button -->
    <button
      v-if="showCloseButtonVisible"
      type="button"
      :aria-label="closeAriaLabel"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
      @click="emit('close')"
    >
      <X class="h-4 w-4" />
    </button>

    <!-- Extra content -->
    <slot name="extra" />
  </div>
</template>