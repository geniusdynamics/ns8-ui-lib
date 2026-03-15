<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  label?: string
  hideLabel?: boolean
  description?: string
  errorMessage?: string
  indeterminate?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'update:checked': [value: boolean]
}>()

const uniqueId = useId()
const checkboxId = props.id || uniqueId

const isChecked = computed({
  get: () => props.checked ?? false,
  set: (value: boolean) => {
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
      :class="cn( 'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        {
          'border-destructive': errorMessage,
          'data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground': errorMessage
        }
      )"
      :data-indeterminate="indeterminate"
    >
      <CheckboxIndicator 
        :class="cn('flex items-center justify-center text-current', {
          'opacity-50': indeterminate
        })"
      >
        <Check v-if="!indeterminate" class="h-4 w-4" />
        <div v-else class="h-1 w-2 bg-current rounded-sm" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <div class="grid gap-1.5">
      <label
        v-if="label || $slots.label"
        :for="checkboxId"
        :class="cn( 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
          {
            'sr-only': hideLabel,
            'cursor-not-allowed': disabled,
            'text-destructive': errorMessage
          }
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