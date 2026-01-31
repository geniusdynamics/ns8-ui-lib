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
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  size: 'default',
  showLabel: false,
  indeterminate: false,
})

const percentage = computed(() => {
  if (props.indeterminate) return 0
  return Math.min(Math.max((props.value || 0) / props.max * 100, 0), 100)
})

const containerClasses = computed(() => {
  const baseClasses = 'relative w-full overflow-hidden rounded-full bg-secondary'
  
  const sizeClasses = {
    default: 'h-2',
    sm: 'h-1',
    lg: 'h-3'
  }

  return cn(baseClasses, sizeClasses[props.size], props.class)
})

const progressClasses = computed(() => {
  const baseClasses = 'h-full w-full flex-1 bg-primary transition-all'
  
  const variantClasses = {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  }

  return cn(baseClasses, variantClasses[props.variant], {
    'animate-pulse': props.indeterminate,
    'transition-all': !props.indeterminate
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

    <!-- Progress container -->
    <div :class="containerClasses" role="progressbar" :aria-valuenow="value" :aria-valuemax="max">
      <div
        :class="progressClasses"
        :style="{
          width: indeterminate ? '100%' : `${percentage}%`,
          animation: indeterminate ? 'indeterminate 2s ease-in-out infinite' : undefined
        }"
      />
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
</style>