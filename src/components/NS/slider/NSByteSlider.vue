<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showLabel?: boolean
  label?: string
  showValue?: boolean
  formatBytes?: (bytes: number) => string
  showByteUnits?: boolean
  customUnits?: string[]
  class?: string
  trackClass?: string
  thumbClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 1024, // 1GB default
  step: 1,
  showLabel: false,
  showValue: true,
  showByteUnits: true,
  customUnits: () => ['B', 'KB', 'MB', 'GB', 'TB'],
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const value = computed({
  get: () => props.modelValue ?? props.defaultValue ?? 0,
  set: (value: number) => {
    emit('update:modelValue', value)
  }
})

const formatBytesDefault = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  const units = props.customUnits
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i]
}

const displayValue = computed(() => {
  if (props.showByteUnits && props.formatBytes) {
    return props.formatBytes(value.value)
  } else if (props.showByteUnits) {
    return formatBytesDefault(value.value)
  } else {
    return value.value.toString()
  }
})

const containerClasses = computed(() => {
  return cn('relative', props.class)
})

const rootClasses = computed(() => {
  return cn('relative flex w-full touch-none select-none items-center flex-col')
})

const trackClasses = computed(() => {
  return cn('relative h-2 w-full grow overflow-hidden rounded-full bg-secondary', props.trackClass)
})

const rangeClasses = computed(() => {
  return cn('absolute h-full bg-primary')
})

const thumbClasses = computed(() => {
  return cn('block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', props.thumbClass)
})

const labelClasses = computed(() => {
  return 'text-sm font-medium text-foreground'
})

const valueClasses = computed(() => {
  return 'text-sm font-mono text-muted-foreground'
})

// Calculate optimal decimal places based on range
const decimals = computed(() => {
  const range = props.max - props.min
  if (range >= 1024 * 1024) return 1 // GB+
  if (range >= 1024) return 0 // MB+
  return 0 // KB and below
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Label -->
    <div 
      v-if="showLabel && (label || $slots.label)" 
      class="flex items-center justify-between mb-2"
    >
      <div :class="labelClasses">
        <slot name="label">{{ label }}</slot>
      </div>
      <div v-if="showValue" :class="valueClasses">
        {{ displayValue }}
      </div>
    </div>

    <!-- Slider -->
    <SliderRoot
      :class="rootClasses"
      v-model="value"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    >
      <SliderTrack :class="trackClasses">
        <SliderRange :class="rangeClasses" />
      </SliderTrack>
      <SliderThumb :class="thumbClasses" />
    </SliderRoot>

    <!-- Scale markers for byte units -->
    <div class="relative mt-2 flex justify-between text-xs text-muted-foreground">
      <span v-if="showByteUnits">{{ formatBytes(min) }}</span>
      <span v-if="showByteUnits">{{ formatBytes(max) }}</span>
    </div>

    <!-- Custom value display -->
    <div v-if="$slots.value" class="mt-2">
      <slot name="value" :value="value" :display-value="displayValue" />
    </div>
  </div>
</template>