<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        :class="cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-md', 
          size === 'lg' && 'max-w-lg',
          size === 'xl' && 'max-w-xl',
          size === '2xl' && 'max-w-2xl',
          size === '3xl' && 'max-w-3xl',
          size === '4xl' && 'max-w-4xl',
          size === '5xl' && 'max-w-5xl',
          className
        )"
      >
        <div v-if="$slots.title || $slots.description" class="flex flex-col space-y-1.5 text-center sm:text-left">
          <DialogTitle v-if="$slots.title" class="text-lg font-semibold leading-none tracking-tight">
            <slot name="title" />
          </DialogTitle>
          <DialogDescription v-if="$slots.description" class="text-sm text-muted-foreground">
            <slot name="description" />
          </DialogDescription>
        </div>
        
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <slot />
        </div>
        
        <DialogClose
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <Cross2Icon class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue'
import { Cross2Icon } from '@radix-vue/icons'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  open?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  size: 'lg'
})

const open = computed({
  get: () => props.open,
  set: (value) => {
    if (!value) {
      // Handle close
    }
  }
})
</script>