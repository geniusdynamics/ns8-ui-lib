<script setup lang="ts">
import { computed } from 'vue'
import { FileX, Search, InBox, AlertCircle, Info } from 'lucide-vue-next'
import { NSLottieAnimation } from '@/components/NS/lottie-animation'
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  description?: string
  icon?: string | object
  lottiePath?: string // Path to Lottie JSON file
  lottieData?: any // Direct Lottie animation data
  animationTitle?: string
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'muted'
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

const containerClasses = computed(() => {
  const sizeClasses = {
    default: 'p-8',
    sm: 'p-4',
    lg: 'p-12'
  }

  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground'
  }

  return cn(
    'flex flex-col items-center justify-center text-center',
    sizeClasses[props.size],
    variantClasses[props.variant],
    props.class
  )
})

const iconClasses = computed(() => {
  const sizeClasses = {
    default: 'h-16 w-16',
    sm: 'h-12 w-12',
    lg: 'h-20 w-20'
  }

  return cn('text-muted-foreground', sizeClasses[props.size], props.iconClass)
})

const titleClasses = computed(() => {
  return cn(
    'text-lg font-semibold mb-2',
    {
      'text-foreground': props.variant === 'default',
      'text-muted-foreground': props.variant === 'muted'
    },
    props.titleClass
  )
})

const descriptionClasses = computed(() => {
  return cn(
    'text-sm max-w-md mb-6',
    {
      'text-muted-foreground': props.variant === 'default',
      'text-muted-foreground/70': props.variant === 'muted'
    },
    props.descriptionClass
  )
})

const hasIconSlot = computed(() => !!$slots.icon)
const hasDescriptionSlot = computed(() => !!$slots.description)
const hasActionsSlot = computed(() => !!$slots.actions)
</script>

<template>
  <div :class="containerClasses">
    <!-- Icon section -->
    <div class="mb-4">
      <slot name="icon">
        <!-- Lottie animation if provided -->
        <NSLottieAnimation
          v-if="lottiePath || lottieData"
          :path="lottiePath"
          :animation-data="lottieData"
          :width="48"
          :height="48"
          :class="iconClasses"
          :title="animationTitle || title"
          :play-on-hover="true"
          :stop-on-hover-out="true"
        />
        
        <!-- Custom icon or default Lucide icon -->
        <component
          v-else-if="iconComponent && !hasIconSlot"
          :is="iconComponent"
          :class="iconClasses"
        />
      </slot>
    </div>

    <!-- Title section -->
    <h3
      v-if="title || $slots.title"
      :class="titleClasses"
    >
      <slot name="title">{{ title }}</slot>
    </h3>

    <!-- Description section -->
    <div
      v-if="hasDescriptionSlot || description"
      :class="descriptionClasses"
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