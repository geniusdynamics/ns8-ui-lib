<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: number | number[]
  defaultValue?: number | number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  showLabel?: boolean
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  class?: string
  trackClass?: string
  thumbClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  showLabel: false,
  showValue: true,
  formatValue: (value: number) => value.toString(),
})

const emit = defineEmits<{
  'update:modelValue': [value: number | number[]]
}>()

const value = computed({
  get: () => props.modelValue ?? props.defaultValue ?? 0,
  set: (value: number | number[]) => {
    emit('update:modelValue', value)
  }
})

const isRange = computed(() => Array.isArray(value.value))

const displayValue = computed(() => {
  if (isRange.value) {
    return (value.value as number[]).map(v => props.formatValue(v)).join(' - ')
  }
  return props.formatValue(value.value as number)
})

const containerClasses = computed(() => {
  const baseClasses = 'relative'
  
  return cn(baseClasses, props.class)
})

const rootClasses = computed(() => {
  const baseClasses = 'relative flex w-full touch-none select-none items-center'
  
  const orientationClasses = {
    horizontal: 'flex-col',
    vertical: 'w-auto h-full flex-row'
  }

  return cn(baseClasses, orientationClasses[props.orientation])
})

const trackClasses = computed(() => {
  const baseClasses = 'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary'
  
  const orientationClasses = {
    horizontal: 'h-2 w-full',
    vertical: 'w-2 h-full'
  }

  return cn(baseClasses, orientationClasses[props.orientation], props.trackClass)
})

const rangeClasses = computed(() => {
  const baseClasses = 'absolute h-full bg-primary'
  
  return cn(baseClasses)
})

const thumbClasses = computed(() => {
  const baseClasses = 'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  return cn(baseClasses, props.thumbClass)
})

const labelClasses = computed(() => {
  return 'text-sm font-medium text-foreground'
})

const valueClasses = computed(() => {
  return 'text-sm text-muted-foreground'
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
      :orientation="orientation"
    >
      <SliderTrack :class="trackClasses">
        <SliderRange :class="rangeClasses" />
      </SliderTrack>
      <SliderThumb 
        v-for="(_, index) in isRange ? 2 : 1" 
        :key="index"
        :class="thumbClasses" 
      />
    </SliderRoot>

    <!-- Custom value display -->
    <div v-if="$slots.value" class="mt-2">
      <slot name="value" :value="value" :display-value="displayValue" />
    </div>
  </div>
</template>