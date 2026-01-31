<script setup lang="ts">
import { computed } from 'vue'
import { X, AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info'
  duration?: number
  showCloseButton?: boolean
  actionLabel?: string
  closeAriaLabel?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  loading?: boolean
  class?: string
  icon?: object
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  duration: 5000,
  showCloseButton: true,
  closeAriaLabel: 'Close notification',
  position: 'top-right',
  loading: false,
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
  const baseClasses = 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full md:data-[state=open]:slide-in-from-right-full'
  
  const variantClasses = {
    default: 'border-border bg-background text-foreground',
    destructive: 'border-destructive/50 bg-destructive text-destructive-foreground',
    warning: 'border-orange-500/50 bg-orange-500 text-white',
    success: 'border-green-500/50 bg-green-500 text-white',
    info: 'border-blue-500/50 bg-blue-500 text-white'
  }

  return cn(baseClasses, variantClasses[props.variant], props.class)
})

const positionClasses = computed(() => {
  const baseClasses = 'fixed z-50 flex flex-col-reverse p-4'
  
  const positionMap = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
  }

  return cn(baseClasses, positionMap[props.position])
})
</script>

<template>
  <div :class="positionClasses">
    <div :class="containerClasses">
      <!-- Icon -->
      <component
        :is="NotificationIcon"
        class="h-5 w-5 shrink-0"
      />

      <!-- Loading spinner -->
      <Loader2 
        v-if="loading"
        class="h-5 w-5 shrink-0 animate-spin"
      />

      <!-- Content -->
      <div class="grid gap-1">
        <!-- Title -->
        <div v-if="title || $slots.title" class="text-sm font-semibold">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- Description -->
        <div v-if="description || $slots.description" class="text-sm opacity-90">
          <slot name="description">{{ description }}</slot>
        </div>

        <!-- Action button -->
        <button
          v-if="actionLabel"
          type="button"
          :class="cn(
            'inline-flex items-center text-sm font-medium underline underline-offset-2 hover:no-underline',
            {
              'text-destructive-foreground': variant === 'destructive',
              'text-white': ['warning', 'success', 'info'].includes(variant),
              'text-foreground': variant === 'default'
            }
          )"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </button>
      </div>

      <!-- Close button -->
      <button
        v-if="showCloseButton"
        type="button"
        :aria-label="closeAriaLabel"
        :class="cn(
          'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
          {
            'text-destructive-foreground/50 hover:text-destructive-foreground': variant === 'destructive',
            'text-white/50 hover:text-white': ['warning', 'success', 'info'].includes(variant)
          }
        )"
        @click="emit('close')"
      >
        <X class="h-4 w-4" />
      </button>

      <!-- Progress bar for auto-dismiss -->
      <div 
        v-if="duration > 0"
        class="absolute bottom-0 left-0 h-1 bg-black/20 dark:bg-white/20 animate-[shrink_x_var(--duration)_linear_forwards]"
        :style="{ '--duration': `${duration}ms` }"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes shrink-x {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>