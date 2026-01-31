<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { tagVariants, type TagVariants } from '.'

interface Props {
  label?: string
  variant?: TagVariants['variant']
  size?: TagVariants['size']
  interactive?: boolean
  removable?: boolean
  disabled?: boolean
  icon?: string // SVG icon string or component
  clearAriaLabel?: string
  title?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  interactive: false,
  removable: false,
  clearAriaLabel: 'Remove tag',
})

const emit = defineEmits<{
  remove: []
  click: [event: Event]
}>()

const isClickable = computed(() => props.interactive && !props.disabled)
const isFilter = computed(() => props.removable)

const handleClick = (event: Event) => {
  if (isClickable.value) {
    emit('click', event)
  }
}

const handleRemove = (event: Event) => {
  event.stopPropagation()
  if (!props.disabled) {
    emit('remove')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isFilter.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    handleRemove(event)
  }
}
</script>

<template>
  <component
    :is="isClickable ? 'button' : 'div'"
    :class="cn(
      tagVariants({ variant, size, interactive }),
      {
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-default': isFilter && !interactive,
      },
      props.class
    )"
    :disabled="disabled"
    :title="title || label"
    @click="handleClick"
    @keydown="handleKeydown"
    :aria-label="label"
    role="button"
    tabindex="0"
  >
    <!-- Icon slot/component -->
    <div v-if="icon && !isFilter" class="flex items-center justify-center">
      <component 
        v-if="typeof icon === 'object'" 
        :is="icon" 
        class="h-3 w-3" 
      />
      <div 
        v-else-if="typeof icon === 'string'" 
        v-html="icon" 
        class="h-3 w-3" 
      />
    </div>

    <!-- Label content -->
    <span class="truncate max-w-[200px]">
      <slot>{{ label }}</slot>
    </span>

    <!-- Remove button for filter tags -->
    <button
      v-if="isFilter"
      type="button"
      :class="cn(
        'flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors',
        'ml-1 -mr-1 h-4 w-4 p-0',
        {
          'opacity-50 cursor-not-allowed': disabled,
        }
      )"
      :disabled="disabled"
      :aria-label="clearAriaLabel"
      :title="clearAriaLabel"
      @click="handleRemove"
    >
      <X class="h-3 w-3" />
    </button>
  </component>
</template>