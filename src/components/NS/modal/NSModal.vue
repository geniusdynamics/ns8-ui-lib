<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { X, Maximize2, Minimize2 } from 'lucide-vue-next'
import { 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogOverlay, 
  DialogPortal, 
  DialogTitle, 
  DialogTrigger 
} from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props {
  open?: boolean
  modelValue?: boolean
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

const isFullscreen = computed(() => props.fullscreen)

const contentClasses = computed(() => {
  const baseClasses = 'relative z-50 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full'
  
  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-screen-2xl'
  }

  const fullscreenClasses = isFullscreen.value 
    ? 'w-screen h-screen max-w-none rounded-none border-none p-0'
    : ''

  return cn(
    baseClasses, 
    sizeClasses[props.size],
    fullscreenClasses,
    props.contentClass
  )
})

const overlayClasses = computed(() => {
  const baseClasses = 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
  
  return cn(baseClasses, props.overlayClass)
})

const sizeStyle = computed(() => {
  if (props.maxWidth || props.maxHeight) {
    return {
      maxWidth: props.maxWidth,
      maxHeight: props.maxHeight
    }
  }
  return {}
})

const handleClose = () => {
  if (!props.persistent) {
    isOpen.value = false
  }
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay 
      :class="overlayClasses"
      @click="closeOnOverlayClick ? handleClose() : undefined"
    />
    <DialogContent
      :class="contentClasses"
      :style="sizeStyle"
      :aria-describedby="description ? undefined : undefined"
    >
      <!-- Header -->
      <div 
        v-if="title || $slots.header || showCloseButton" 
        :class="cn(
          'flex items-center justify-between',
          isFullscreen ? 'border-b p-6' : 'mb-4'
        )"
      >
        <!-- Title and description -->
        <div class="space-y-1">
          <DialogTitle 
            v-if="title || $slots.title"
            class="text-lg font-semibold leading-none tracking-tight"
          >
            <slot name="title">{{ title }}</slot>
          </DialogTitle>
          <DialogDescription 
            v-if="description || $slots.description"
            class="text-sm text-muted-foreground"
          >
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </div>

        <!-- Close button -->
        <div class="flex items-center gap-2">
          <!-- Fullscreen toggle -->
          <button
            v-if="!fullscreen"
            type="button"
            class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            @click="isFullscreen = !isFullscreen"
          >
            <Maximize2 v-if="!isFullscreen" class="h-4 w-4" />
            <Minimize2 v-else class="h-4 w-4" />
          </button>

          <!-- Close button -->
          <DialogClose
            v-if="showCloseButton && !persistent"
            class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </div>
      </div>

      <!-- Custom header slot -->
      <slot name="header" />

      <!-- Content -->
      <div :class="cn('flex-1', isFullscreen ? 'p-6' : '')">
        <slot />
      </div>

      <!-- Custom footer slot -->
      <slot name="footer" />

      <!-- Default actions -->
      <div 
        v-if="$slots.actions" 
        :class="cn(
          'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
          isFullscreen ? 'border-t p-6 mt-auto' : 'mt-6'
        )"
      >
        <slot name="actions" />
      </div>
    </DialogContent>
  </DialogPortal>
</template>