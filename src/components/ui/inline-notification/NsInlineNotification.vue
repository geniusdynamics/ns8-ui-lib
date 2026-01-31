<script setup lang="ts">
import { computed } from 'vue'
import { X, AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { inlineNotificationVariants, type InlineNotificationVariants } from '.'

interface Props {
  title?: string
  description?: string
  variant?: InlineNotificationVariants['variant']
  showCloseButton?: boolean
  actionLabel?: string
  closeAriaLabel?: string
  loading?: boolean
  timer?: number
  lowContrast?: boolean
  class?: string
  icon?: object // Custom icon component
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

const variantToKind = {
  destructive: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info',
  default: 'info'
}

const kind = computed(() => variantToKind[props.variant])

const hasTitle = computed(() => props.title || $slots.title)
const hasDescription = computed(() => props.description || $slots.description)
const hasAction = computed(() => props.actionLabel)
const hasTimer = computed(() => props.timer)
const hasLoading = computed(() => props.loading)

const showCloseButtonVisible = computed(() => props.showCloseButton && !hasLoading.value)

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
</script>

<template>
  <div
    :class="cn(
      inlineNotificationVariants({ variant }),
      {
        'opacity-75': lowContrast
      },
      props.class
    )"
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
      <!-- You can integrate NsCircleTimer component here -->
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