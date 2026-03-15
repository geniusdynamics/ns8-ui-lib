<script setup lang="ts">
import { computed, ref, nextTick, useId } from 'vue'
import { Eye, EyeOff, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

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
  prefix?: string
  suffix?: string
  showPasswordToggle?: boolean
  class?: string
  labelClass?: string
  inputClass?: string
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  showPasswordToggle: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:value': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: BlurEvent]
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

const inputVariant = computed(() => {
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

const handleBlur = (event: BlurEvent) => {
  isFocused.value = false
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
      :class="cn( 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        {
          'text-destructive': errorMessage,
          'text-orange-600': warningMessage,
          'text-green-600': successMessage
        },
        labelClass
      )"
    >
      <slot name="label">{{ label }}</slot>
    </label>

    <div class="relative">
      <span
        v-if="prefix"
        :class="cn( 'absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground',
          {
            'text-destructive': errorMessage,
            'text-orange-600': warningMessage,
            'text-green-600': successMessage
          }
        )"
      >
        {{ prefix }}
      </span>

      <input
        :id="inputId"
        ref="inputRef"
        :type="actualType"
        :class="cn( 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          {
            'pl-8': prefix,
            'pr-16': (isPassword && showPasswordToggle) || StatusIcon,
            'pr-12': StatusIcon && !(isPassword && showPasswordToggle),
            'border-destructive text-destructive focus:border-destructive': inputVariant === 'destructive',
            'border-orange-500 text-orange-600 focus:border-orange-500': inputVariant === 'warning',
            'border-green-500 text-green-600 focus:border-green-500': inputVariant === 'success',
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
        class="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1 pr-3"
      >
        <component
          v-if="StatusIcon"
          :is="StatusIcon"
          :class="cn('h-4 w-4', {
            'text-destructive': inputVariant === 'destructive',
            'text-orange-600': inputVariant === 'warning',
            'text-green-600': inputVariant === 'success'
          })"
        />
        
        <button
          v-if="isPassword && showPasswordToggle"
          type="button"
          :class="cn( 'text-muted-foreground hover:text-foreground transition-colors',
            {
              'pointer-events-none': disabled
            }
          )"
          :disabled="disabled"
          @click="togglePasswordVisibility"
          :title="isPasswordVisible ? 'Hide password' : 'Show password'"
        >
          <EyeOff v-if="isPasswordVisible" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p
      v-if="displayMessage"
      :class="cn('text-sm flex items-start gap-1', {
        'text-muted-foreground': !errorMessage && !warningMessage && !successMessage,
        'text-destructive': errorMessage,
        'text-orange-600': warningMessage,
        'text-green-600': successMessage
      })"
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