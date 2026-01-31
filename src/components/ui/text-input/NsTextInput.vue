<script setup lang="ts">
import { computed, ref, useId, nextTick } from 'vue'
import { Eye, EyeOff, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { textInputVariants, labelVariants, helperTextVariants, type TextInputVariants, type LabelVariants, type HelperTextVariants } from '.'

interface Props {
  modelValue?: string
  value?: string
  defaultValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  id?: string
  label?: string
  description?: string
  errorMessage?: string
  warningMessage?: string
  successMessage?: string
  helperText?: string
  placeholder?: string
  prefix?: string
  suffix?: string
  variant?: TextInputVariants['variant']
  size?: TextInputVariants['size']
  labelVariant?: LabelVariants['variant']
  class?: string
  labelClass?: string
  inputClass?: string
  containerClass?: string
  showPasswordToggle?: boolean
  validateOnChange?: boolean
  validator?: (value: string) => string | null
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'default',
  size: 'default',
  labelVariant: 'default',
  showPasswordToggle: false,
  validateOnChange: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:value': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'input': [event: Event]
  'change': [event: Event]
}>()

const uniqueId = useId()
const inputId = props.id || uniqueId

const isPasswordVisible = ref(false)
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement>()

const isPassword = computed(() => props.type === 'password')
const actualType = computed(() => {
  if (isPassword.value) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const inputVariant = computed((): TextInputVariants['variant'] => {
  if (props.errorMessage) return 'destructive'
  if (props.warningMessage) return 'warning'
  if (props.successMessage) return 'success'
  return props.variant
})

const labelVariant = computed((): LabelVariants['variant'] => {
  if (props.errorMessage) return 'destructive'
  if (props.warningMessage) return 'warning'
  if (props.successMessage) return 'success'
  return props.labelVariant
})

const helperTextVariant = computed((): HelperTextVariants['variant'] => {
  if (props.errorMessage) return 'destructive'
  if (props.warningMessage) return 'warning'
  if (props.successMessage) return 'success'
  return 'default'
})

const displayMessage = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (props.warningMessage) return props.warningMessage
  if (props.successMessage) return props.successMessage
  if (props.helperText) return props.helperText
  return ''
})

const StatusIcon = computed(() => {
  if (props.errorMessage) return AlertCircle
  if (props.warningMessage) return AlertTriangle
  if (props.successMessage) return CheckCircle
  return null
})

const PasswordIcon = computed(() => isPasswordVisible.value ? EyeOff : Eye)

const internalValue = computed({
  get: () => props.modelValue ?? props.value ?? '',
  set: (value: string) => {
    emit('update:modelValue', value)
    emit('update:value', value)
  }
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  internalValue.value = target.value
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  if (props.validateOnChange && props.validator) {
    const error = props.validator(internalValue.value)
    // You might want to emit validation errors or handle them differently
  }
  emit('blur', event)
}

const focus = () => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

defineExpose({
  focus,
  inputRef,
})
</script>

<template>
  <div :class="cn('grid w-full max-w-sm gap-1.5', containerClass)">
    <label
      v-if="label || $slots.label"
      :for="inputId"
      :class="cn(
        labelVariants({ variant: labelVariant }),
        'flex items-center gap-1',
        {
          'cursor-not-allowed': disabled
        },
        labelClass
      )"
    >
      <slot name="label">{{ label }}</slot>
      <slot name="label-addon" />
    </label>

    <div class="relative">
      <span
        v-if="prefix"
        :class="cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground',
          {
            'text-destructive': variant === 'destructive',
            'text-orange-600': variant === 'warning',
            'text-green-600': variant === 'success'
          }
        )"
      >
        {{ prefix }}
      </span>

      <input
        :id="inputId"
        ref="inputRef"
        :type="actualType"
        :class="cn(
          textInputVariants({ variant: inputVariant, size }),
          {
            'pl-8': prefix,
            'pr-16': (isPassword && showPasswordToggle) || StatusIcon,
            'pr-12': StatusIcon && !(isPassword && showPasswordToggle),
            'ring-2 ring-ring ring-offset-2': isFocused,
          },
          inputClass
        )"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :value="internalValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />

      <div
        v-if="StatusIcon || (isPassword && showPasswordToggle)"
        :class="cn(
          'absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1 pr-3',
          {
            'pointer-events-none': StatusIcon && !(isPassword && showPasswordToggle)
          }
        )"
      >
        <component
          v-if="StatusIcon"
          :is="StatusIcon"
          :class="cn('h-4 w-4', {
            'text-destructive': variant === 'destructive',
            'text-orange-600': variant === 'warning',
            'text-green-600': variant === 'success'
          })"
        />
        
        <button
          v-if="isPassword && showPasswordToggle"
          type="button"
          :class="cn(
            'text-muted-foreground hover:text-foreground transition-colors',
            {
              'pointer-events-none': disabled
            }
          )"
          :disabled="disabled"
          @click="togglePasswordVisibility"
          :title="isPasswordVisible ? 'Hide password' : 'Show password'"
        >
          <component :is="PasswordIcon" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p
      v-if="displayMessage"
      :class="cn(helperTextVariants({ variant: helperTextVariant }), 'flex items-start gap-1')"
    >
      <component
        v-if="StatusIcon"
        :is="StatusIcon"
        class="h-4 w-4 mt-0.5 flex-shrink-0"
      />
      <span>{{ displayMessage }}</span>
    </p>

    <slot name="extra" />
  </div>
</template>