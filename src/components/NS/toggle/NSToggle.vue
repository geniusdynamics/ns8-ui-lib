<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  id?: string
  label?: string
  hideLabel?: boolean
  description?: string
  leftText?: string
  rightText?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  size?: 'default' | 'sm' | 'lg'
  class?: string
  labelClass?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  leftText: 'Off',
  rightText: 'On',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:checked': [value: boolean]
}>()

const uniqueId = useId()
const toggleId = props.id || uniqueId

const isChecked = computed({
  get: () => props.modelValue ?? props.checked ?? false,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('update:checked', value)
  }
})

const toggleClasses = computed(() => {
  const baseClasses = 'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
  
  const variantClasses = {
    default: 'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
    destructive: 'data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input',
    success: 'data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input',
    warning: 'data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-input'
  }

  const sizeClasses = {
    default: 'h-6 w-11',
    sm: 'h-5 w-9',
    lg: 'h-7 w-13'
  }

  return cn(baseClasses, variantClasses[props.variant], sizeClasses[props.size])
})

const thumbClasses = computed(() => {
  const baseClasses = 'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
  
  const sizeClasses = {
    default: 'h-5 w-5 data-[state=checked]:translate-x-5',
    sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
    lg: 'h-6 w-6 data-[state=checked]:translate-x-6'
  }

  return cn(baseClasses, sizeClasses[props.size])
})
</script>

<template>
  <div :class="cn('flex items-center gap-3', containerClass)">
    <SwitchRoot
      :id="toggleId"
      v-model:checked="isChecked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :name="name"
      :value="value"
      :class="toggleClasses"
    >
      <SwitchThumb :class="thumbClasses" />
    </SwitchRoot>

    <div class="grid gap-1.5">
      <label
        v-if="label || $slots.label"
        :for="toggleId"
        :class="cn( 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
          {
            'sr-only': hideLabel,
            'cursor-not-allowed': disabled,
            'text-destructive': variant === 'destructive',
            'text-green-600': variant === 'success',
            'text-orange-600': variant === 'warning'
          },
          labelClass
        )"
      >
        <slot name="label">{{ label }}</slot>
      </label>

      <div
        v-if="!hideLabel && (leftText || rightText || $slots['left-text'] || $slots['right-text'])"
        :class="cn( 'flex items-center gap-2 text-xs font-medium',
          {
            'text-muted-foreground': !isChecked,
            'text-primary': isChecked,
            'text-destructive': variant === 'destructive' && isChecked,
            'text-green-600': variant === 'success' && isChecked,
            'text-orange-600': variant === 'warning' && isChecked,
          }
        )"
      >
        <span :class="{ 'opacity-50': isChecked }">
          <slot name="left-text">{{ leftText }}</slot>
        </span>
        
        <div :class="cn( 'w-8 h-px bg-current',
          {
            'opacity-20': !isChecked,
            'opacity-100': isChecked
          }
        )" />
        
        <span :class="{ 'opacity-50': !isChecked }">
          <slot name="right-text">{{ rightText }}</slot>
        </span>
      </div>

      <p
        v-if="description"
        class="text-sm text-muted-foreground"
      >
        {{ description }}
      </p>

      <slot name="extra" />
    </div>
  </div>
</template>