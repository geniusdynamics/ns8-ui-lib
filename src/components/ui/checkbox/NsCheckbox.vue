<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { checkboxVariants, labelVariants, type CheckboxVariants, type LabelVariants } from '.'

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
  errorMessage?: string
  variant?: CheckboxVariants['variant']
  size?: CheckboxVariants['size']
  labelVariant?: LabelVariants['variant']
  class?: string
  labelClass?: string
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  labelVariant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:checked': [value: boolean]
}>()

const uniqueId = useId()
const checkboxId = props.id || uniqueId

const isChecked = computed({
  get: () => props.modelValue ?? props.checked ?? false,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('update:checked', value)
  }
})
</script>

<template>
  <div :class="cn('flex items-start space-x-2', props.class)">
    <CheckboxRoot
      :id="checkboxId"
      v-model:checked="isChecked"
      :default-checked="defaultChecked"
      :disabled="disabled"
      :required="required"
      :name="name"
      :value="value"
      :class="cn(checkboxVariants({ variant, size }))"
      :data-indeterminate="indeterminate"
    >
      <CheckboxIndicator 
        :class="cn('flex items-center justify-center text-current', {
          'opacity-50': indeterminate
        })"
      >
        <Check 
          v-if="!indeterminate" 
          :class="cn('h-4 w-4', {
            'h-3.5 w-3.5': size === 'sm',
            'h-5 w-5': size === 'lg'
          })" 
        />
        <div 
          v-else 
          :class="cn('h-1 w-2 bg-current rounded-sm', {
            'h-0.5 w-1.5': size === 'sm',
            'h-1.5 w-2.5': size === 'lg'
          })" 
        />
      </CheckboxIndicator>
    </CheckboxRoot>

    <div class="grid gap-1.5">
      <label
        v-if="label || $slots.label"
        :for="checkboxId"
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

      <p
        v-if="description"
        :class="cn('text-sm text-muted-foreground', {
          'text-destructive': errorMessage
        })"
      >
        {{ description }}
      </p>

      <p
        v-if="errorMessage"
        class="text-sm text-destructive"
      >
        {{ errorMessage }}
      </p>

      <slot name="extra" />
    </div>
  </div>
</template>