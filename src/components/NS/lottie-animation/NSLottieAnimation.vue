<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useLottieService, type LottieOptions } from '@/composables/useLottieService'
import { cn } from '@/lib/utils'

interface Props {
  animation?: string // Animation ID from service
  data?: any // Direct animation data (bypasses service)
  width?: number
  height?: number
  loop?: boolean
  autoplay?: boolean
  speed?: number
  playOnHover?: boolean
  stopOnHoverOut?: boolean
  direction?: number
  mode?: 'bounce' | 'normal'
  renderer?: 'svg' | 'canvas' | 'html'
  className?: string // For lottie player
  containerClassName?: string
  lazy?: boolean
  placeholder?: string
  responsive?: boolean
  preserveAspectRatio?: string
  title?: string
  ariaLabel?: string
  role?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 200,
  loop: false,
  autoplay: true,
  speed: 1,
  playOnHover: false,
  stopOnHoverOut: false,
  direction: 1,
  mode: 'normal',
  renderer: 'svg',
  lazy: false,
  responsive: true,
  preserveAspectRatio: 'xMidYMid meet',
  role: 'img',
})

const emit = defineEmits<{
  load: []
  ready: []
  play: []
  pause: []
  stop: []
  complete: []
  loopComplete: []
  enterFrame: [event: any]
  error: [error: Error]
  mouseOver: []
  mouseOut: []
}>()

const { getLottieData, getAnimation, createAnimationState } = useLottieService()

// State
const containerRef = ref<HTMLElement>()
const lottiePlayer = ref<any>(null)
const isLoading = ref(false)
const isError = ref(false)
const isLoaded = ref(false)
const isPlaying = ref(false)
const error = ref<string | null>(null)

// Animation state management
const animationState = createAnimationState(props.animation)

// Computed properties
const shouldLoad = computed(() => {
  return !props.lazy || (props.lazy && isLoaded.value === false)
})

const containerStyle = computed(() => ({
  width: props.width ? `${props.width}px` : 'auto',
  height: props.height ? `${props.height}px` : 'auto',
  maxWidth: props.responsive ? '100%' : undefined,
  aspectRatio: props.preserveAspectRatio,
}))

const containerClasses = computed(() => {
  return cn(
    'relative inline-block',
    {
      'opacity-50': isLoading.value,
      'opacity-100': !isLoading.value,
    },
    props.containerClassName
  )
})

const playerClasses = computed(() => {
  return cn('w-full h-full', props.className)
})

// Load animation
const loadAnimation = async () => {
  if (!shouldLoad.value) return

  isLoading.value = true
  isError.value = false
  error.value = null

  try {
    let animationData = props.data

    // Load animation data if not provided directly
    if (!animationData && props.animation) {
      animationData = await getLottieData(props.animation)
    }

    if (!animationData) {
      throw new Error('No animation data available')
    }

    emit('load')

    // Initialize lottie player
    await nextTick()
    
    if (containerRef.value && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      const Lottie = await import('lottie-web')
      
      lottiePlayer.value = Lottie.default.loadAnimation({
        container: containerRef.value,
        renderer: props.renderer,
        loop: props.loop,
        autoplay: props.autoplay && !props.playOnHover,
        animationData,
        rendererSettings: {
          preserveAspectRatio: props.preserveAspectRatio,
          className: playerClasses.value,
        },
      })

      setupEventListeners()
      isLoaded.value = true
      isLoading.value = false
      emit('ready')
    }
  } catch (err) {
    isLoading.value = false
    isError.value = true
    error.value = err instanceof Error ? err.message : 'Failed to load animation'
    emit('error', err instanceof Error ? err : new Error(String(err)))
  }
}

// Setup event listeners
const setupEventListeners = () => {
  if (!lottiePlayer.value) return

  lottiePlayer.value.addEventListener('DOMLoaded', () => {
    emit('ready')
  })

  lottiePlayer.value.addEventListener('complete', () => {
    emit('complete')
  })

  lottiePlayer.value.addEventListener('loopComplete', () => {
    emit('loopComplete')
  })

  lottiePlayer.value.addEventListener('enterFrame', (event: any) => {
    emit('enterFrame', event)
  })

  lottiePlayer.value.addEventListener('data_ready', () => {
    isLoaded.value = true
    emit('ready')
  })

  lottiePlayer.value.addEventListener('data_failed', () => {
    isError.value = true
    emit('error', new Error('Animation data failed to load'))
  })
}

// Player controls
const play = () => {
  if (lottiePlayer.value && !isPlaying.value) {
    lottiePlayer.value.play()
    isPlaying.value = true
    emit('play')
  }
}

const pause = () => {
  if (lottiePlayer.value && isPlaying.value) {
    lottiePlayer.value.pause()
    isPlaying.value = false
    emit('pause')
  }
}

const stop = () => {
  if (lottiePlayer.value) {
    lottiePlayer.value.stop()
    isPlaying.value = false
    emit('stop')
  }
}

const destroy = () => {
  if (lottiePlayer.value) {
    lottiePlayer.value.destroy()
    lottiePlayer.value = null
    isLoaded.value = false
    isPlaying.value = false
  }
}

const goTopAndStop = (frame?: number) => {
  if (lottiePlayer.value) {
    lottiePlayer.value.goToAndStop(frame || 0, true)
  }
}

const setDirection = (direction: number) => {
  if (lottiePlayer.value) {
    lottiePlayer.value.setDirection(direction)
  }
}

const setSpeed = (speed: number) => {
  if (lottiePlayer.value) {
    lottiePlayer.value.setSpeed(speed)
  }
}

// Hover handlers
const handleMouseOver = () => {
  if (props.playOnHover && !isPlaying.value) {
    play()
  }
  emit('mouseOver')
}

const handleMouseOut = () => {
  if (props.stopOnHoverOut && isPlaying.value) {
    pause()
  }
  emit('mouseOut')
}

// Watch for prop changes
watch([() => props.animation, () => props.data], () => {
  if (shouldLoad.value) {
    destroy()
    loadAnimation()
  }
})

watch(() => props.speed, (newSpeed) => {
  if (lottiePlayer.value) {
    setSpeed(newSpeed)
  }
})

watch(() => props.direction, (newDirection) => {
  if (lottiePlayer.value) {
    setDirection(newDirection)
  }
})

// Lifecycle
onMounted(() => {
  if (shouldLoad.value) {
    loadAnimation()
  }
})

onBeforeUnmount(() => {
  destroy()
})

// Expose methods
defineExpose({
  play,
  pause,
  stop,
  destroy,
  goTopAndStop,
  setDirection,
  setSpeed,
  lottiePlayer: lottiePlayer,
  isLoaded,
  isPlaying,
  isLoading,
  isError,
})
</script>

<template>
  <div 
    ref="containerRef"
    :class="containerClasses"
    :style="containerStyle"
    :title="title"
    :aria-label="ariaLabel"
    :role="role"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  >
    <!-- Loading placeholder -->
    <div v-if="isLoading && !isLoaded" class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span v-if="placeholder" class="ml-2 text-sm text-muted-foreground">{{ placeholder }}</span>
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="flex items-center justify-center text-destructive">
      <div class="text-sm">{{ error || 'Failed to load animation' }}</div>
    </div>

    <!-- Animation container -->
    <div v-else-if="shouldLoad" class="w-full h-full" />
  </div>
</template>