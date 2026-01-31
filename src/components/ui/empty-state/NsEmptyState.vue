<script setup lang="ts">
import { computed } from 'vue'
import { FileX, Search, InBox, AlertCircle, Info } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { emptyStateVariants, iconVariants, type EmptyStateVariants } from '.'

interface Props {
  title?: string
  description?: string
  icon?: string | object // Lucide icon name or component
  animationData?: any
  animationTitle?: string
  size?: EmptyStateVariants['size']
  variant?: EmptyStateVariants['variant']
  loop?: boolean | number
  animateOnHover?: boolean
  autoPlay?: boolean
  class?: string
  iconClass?: string
  titleClass?: string
  descriptionClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No data available',
  size: 'default',
  variant: 'default',
  loop: true,
  animateOnHover: false,
  autoPlay: true,
})

const DefaultIcon = computed(() => {
  if (props.icon) {
    return null // Use custom icon
  }
  
  // Choose appropriate default icon based on title content
  const title = props.title?.toLowerCase() || ''
  
  if (title.includes('search') || title.includes('find') || title.includes('result')) {
    return Search
  } else if (title.includes('empty') || title.includes('no') || title.includes('data')) {
    return FileX
  } else if (title.includes('message') || title.includes('notification') || title.includes('alert')) {
    return InBox
  } else if (title.includes('error') || title.includes('warning')) {
    return AlertCircle
  } else {
    return Info
  }
})

const iconComponent = computed(() => {
  if (typeof props.icon === 'object') {
    return props.icon // Vue component
  }
  
  if (typeof props.icon === 'string') {
    // Map string to Lucide icons
    const iconMap: Record<string, any> = {
      'file-x': FileX,
      'search': Search,
      'inbox': InBox,
      'alert-circle': AlertCircle,
      'info': Info,
    }
    
    return iconMap[props.icon] || DefaultIcon.value
  }
  
  return DefaultIcon.value
})

const hasIconSlot = computed(() => !!$slots.icon)
const hasDescriptionSlot = computed(() => !!$slots.description)
const hasActionsSlot = computed(() => !!$slots.actions)
</script>

<template>
  <div :class="cn(emptyStateVariants({ size, variant }), props.class)">
    <!-- Icon section -->
    <div class="mb-4">
      <slot name="icon">
        <!-- Lottie animation if provided -->
        <div
          v-if="animationData"
          :class="cn(iconVariants({ size }))"
          :title="animationTitle || title"
        >
          <!-- You can integrate a Lottie component here -->
          <component 
            :is="iconComponent" 
            :class="cn(iconVariants({ size }), props.iconClass)"
          />
        </div>
        
        <!-- Custom icon or default Lucide icon -->
        <component
          v-else-if="iconComponent && !hasIconSlot"
          :is="iconComponent"
          :class="cn(iconVariants({ size }), props.iconClass)"
        />
      </slot>
    </div>

    <!-- Title section -->
    <h3
      v-if="title || $slots.title"
      :class="cn(
        'text-lg font-semibold mb-2',
        {
          'text-foreground': variant === 'default',
          'text-muted-foreground': variant === 'muted'
        },
        titleClass
      )"
    >
      <slot name="title">{{ title }}</slot>
    </h3>

    <!-- Description section -->
    <div
      v-if="hasDescriptionSlot || description"
      :class="cn(
        'text-sm max-w-md mb-6',
        {
          'text-muted-foreground': variant === 'default',
          'text-muted-foreground/70': variant === 'muted'
        },
        descriptionClass
      )"
    >
      <slot name="description">
        <p>{{ description }}</p>
      </slot>
    </div>

    <!-- Actions section -->
    <div v-if="hasActionsSlot" class="mt-4">
      <slot name="actions" />
    </div>

    <!-- Extra content section -->
    <div v-if="$slots.extra" class="mt-6">
      <slot name="extra" />
    </div>
  </div>
</template>