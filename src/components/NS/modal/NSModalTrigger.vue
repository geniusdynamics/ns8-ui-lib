<script setup lang="ts">
import { ref, computed } from 'vue'
import NSModal from './NSModal.vue'

interface Props {
  modelValue?: boolean
  open?: boolean
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
  maxWidth?: string
  maxHeight?: string
  persistent?: boolean
  fullscreen?: boolean
  class?: string
  contentClass?: string
  overlayClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  size: 'default',
  persistent: false,
  fullscreen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
  'open': []
  'close': []
}>()

const isOpen = computed({
  get: () => props.modelValue ?? props.open ?? false,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('update:open', value)
    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  }
})

const triggerRef = ref<HTMLElement>()
</script>

<template>
  <!-- Use DialogTrigger to wrap trigger content -->
  <slot name="trigger" :open="isOpen" :toggle="() => isOpen = !isOpen">
    <button
      v-if="!$slots.trigger"
      ref="triggerRef"
      @click="isOpen = !isOpen"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      Open Modal
    </button>
  </slot>

  <!-- Modal -->
  <NSModal
    v-model="isOpen"
    :title="title"
    :description="description"
    :show-close-button="showCloseButton"
    :close-on-overlay-click="closeOnOverlayClick"
    :close-on-escape="closeOnEscape"
    :size="size"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :class="class"
    :content-class="contentClass"
    :overlay-class="overlayClass"
    @open="emit('open')"
    @close="emit('close')"
  >
    <slot />
    
    <template #title>
      <slot name="title" />
    </template>
    
    <template #description>
      <slot name="description" />
    </template>
    
    <template #header>
      <slot name="header" />
    </template>
    
    <template #actions>
      <slot name="actions" />
    </template>
    
    <template #footer>
      <slot name="footer" />
    </template>
  </NSModal>
</template>