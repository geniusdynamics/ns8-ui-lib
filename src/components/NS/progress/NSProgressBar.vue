<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  value?: number
  max?: number
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  size?: 'default' | 'sm' | 'lg'
  showLabel?: boolean
  label?: string
  indeterminate?: boolean
  animated?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  size: 'default',
  showLabel: false,
  indeterminate: false,
  animated: true,
})

const percentage = computed(() => {
  if (props.indeterminate) return 0
  return Math.min(Math.max((props.value || 0) / props.max * 100, 0), 100)
})

const containerClasses = computed(() => {
  const baseClasses = 'relative w-full bg-secondary overflow-hidden rounded-md'
  
  const sizeClasses = {
    default: 'h-4',
    sm: 'h-3',
    lg: 'h-6'
  }

  return cn(baseClasses, sizeClasses[props.size], props.class)
})

const barClasses = computed(() => {
  const baseClasses = 'h-full flex-1 transition-all'
  
  const variantClasses = {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  }

  return cn(baseClasses, variantClasses[props.variant], {
    'transition-all': props.animated && !props.indeterminate,
    'animate-pulse': props.indeterminate,
    'bg-gradient-to-r from-primary/80 to-primary': props.animated && props.variant === 'default',
    'bg-gradient-to-r from-destructive/80 to-destructive': props.animated && props.variant === 'destructive',
    'bg-gradient-to-r from-green-400 to-green-500': props.animated && props.variant === 'success',
    'bg-gradient-to-r from-orange-400 to-orange-500': props.animated && props.variant === 'warning',
    'bg-gradient-to-r from-blue-400 to-blue-500': props.animated && props.variant === 'info',
  })
})

const labelClasses = computed(() => {
  const baseClasses = 'text-sm font-medium'
  
  const variantClasses = {
    default: 'text-foreground',
    destructive: 'text-destructive',
    success: 'text-green-600',
    warning: 'text-orange-600',
    info: 'text-blue-600'
  }

  return cn(baseClasses, variantClasses[props.variant])
})
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <div v-if="showLabel && (label || $slots.label)" class="flex items-center justify-between">
      <div :class="labelClasses">
        <slot name="label">{{ label }}</slot>
      </div>
      <div :class="labelClasses" v-if="!indeterminate">
        {{ Math.round(percentage) }}%
      </div>
    </div>

    <!-- Progress bar container -->
    <div :class="containerClasses" role="progressbar" :aria-valuenow="value" :aria-valuemax="max">
      <div
        :class="barClasses"
        :style="{
          width: indeterminate ? '100%' : `${percentage}%`,
          animation: indeterminate ? 'indeterminate 2s ease-in-out infinite' : undefined
        }"
      >
        <!-- Animated shimmer effect -->
        <div 
          v-if="animated && !indeterminate" 
          class="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"
        />
      </div>
    </div>

    <!-- Value display -->
    <div v-if="$slots.value" class="text-sm text-muted-foreground">
      <slot name="value" :value="value" :percentage="percentage" />
    </div>
  </div>
</template>

<style scoped>
@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>