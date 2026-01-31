<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from '@/lib/utils'
import { toggleVariants, toggleThumbVariants, labelVariants, type ToggleVariants, type LabelVariants } from '.'

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
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
  labelVariant?: LabelVariants['variant']
  class?: string
  labelClass?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  labelVariant: 'default',
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
      :class="cn(toggleVariants({ variant, size }), props.class)"
    >
      <SwitchThumb :class="toggleThumbVariants({ size })" />
    </SwitchRoot>

    <div class="grid gap-1.5">
      <label
        v-if="label || $slots.label"
        :for="toggleId"
        :class="cn(
          labelVariants({ variant: labelVariant }),
          'cursor-pointer',
          {
            'sr-only': hideLabel,
            'cursor-not-allowed': disabled
          },
          labelClass
        )"
      >
        <slot name="label">{{ label }}</slot>
      </label>

      <div
        v-if="!hideLabel && (leftText || rightText || $slots['left-text'] || $slots['right-text'])"
        :class="cn(
          'flex items-center gap-2 text-xs font-medium',
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
        
        <div :class="cn(
          'w-8 h-px bg-current',
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