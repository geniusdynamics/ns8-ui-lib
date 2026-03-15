<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { LottieAnimation } from "lottie-web-vue";
import { cn } from "@/lib/utils";

interface Props {
  path?: string; // Path to Lottie JSON file
  animationData?: any; // Direct animation data
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  playOnHover?: boolean;
  stopOnHoverOut?: boolean;
  direction?: number;
  renderer?: "svg" | "canvas" | "html";
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
  placeholder?: string;
  responsive?: boolean;
  preserveAspectRatio?: string;
  title?: string;
  ariaLabel?: string;
  role?: string;
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
  renderer: "svg",
  lazy: false,
  responsive: true,
  preserveAspectRatio: "xMidYMid meet",
  role: "img",
});

const emit = defineEmits<{
  load: [];
  ready: [];
  play: [];
  pause: [];
  stop: [];
  complete: [];
  loopComplete: [];
  enterFrame: [event: any];
  error: [error: Error];
  mouseOver: [];
  mouseOut: [];
}>();

// State
const isLoading = ref(false);
const isError = ref(false);
const isLoaded = ref(false);
const isPlaying = ref(props.autoplay);
const error = ref<string | null>(null);
const lottieRef = ref<InstanceType<typeof LottieAnimation>>();

// Computed properties
const lottieOptions = computed(() => ({
  path: props.path,
  animationData: props.animationData,
  loop: props.loop,
  autoplay: props.autoplay && !props.playOnHover,
  renderer: props.renderer,
  rendererSettings: {
    preserveAspectRatio: props.preserveAspectRatio,
  },
}));

const containerStyle = computed(() => ({
  width: props.width
    ? typeof props.width === "number"
      ? `${props.width}px`
      : props.width
    : "auto",
  height: props.height
    ? typeof props.height === "number"
      ? `${props.height}px`
      : props.height
    : "auto",
  maxWidth: props.responsive ? "100%" : undefined,
}));

const containerClasses = computed(() => {
  return cn(
    "relative inline-block",
    {
      "opacity-50": isLoading.value,
      "opacity-100": !isLoading.value,
    },
    props.containerClassName,
  );
});

const playerClasses = computed(() => {
  return cn("w-full h-full", props.className);
});

// Player controls
const play = () => {
  if (lottieRef.value && !isPlaying.value) {
    lottieRef.value.play();
    isPlaying.value = true;
    emit("play");
  }
};

const pause = () => {
  if (lottieRef.value && isPlaying.value) {
    lottieRef.value.pause();
    isPlaying.value = false;
    emit("pause");
  }
};

const stop = () => {
  if (lottieRef.value) {
    lottieRef.value.stop();
    isPlaying.value = false;
    emit("stop");
  }
};

const goToAndStop = (frame?: number) => {
  if (lottieRef.value) {
    lottieRef.value.goToAndStop(frame || 0, true);
  }
};

const setDirection = (direction: number) => {
  if (lottieRef.value) {
    lottieRef.value.setDirection(direction);
  }
};

const setSpeed = (speed: number) => {
  if (lottieRef.value) {
    lottieRef.value.setSpeed(speed);
  }
};

// Event handlers
const handleDataReady = () => {
  isLoaded.value = true;
  isLoading.value = false;
  emit("ready");
};

const handleDataFailed = () => {
  isLoading.value = false;
  isError.value = true;
  error.value = "Failed to load animation";
  emit("error", new Error("Animation data failed to load"));
};

const handleDOMLoaded = () => {
  emit("load");
};

const handleComplete = () => {
  emit("complete");
};

const handleLoopComplete = () => {
  emit("loopComplete");
};

const handleEnterFrame = (event: any) => {
  emit("enterFrame", event);
};

// Hover handlers
const handleMouseOver = () => {
  if (props.playOnHover && !isPlaying.value) {
    play();
  }
  emit("mouseOver");
};

const handleMouseOut = () => {
  if (props.stopOnHoverOut && isPlaying.value) {
    pause();
  }
  emit("mouseOut");
};

// Watch for prop changes
watch([() => props.path, () => props.animationData], () => {
  isLoading.value = true;
  isLoaded.value = false;
  isError.value = false;
});

watch(
  () => props.speed,
  (newSpeed) => {
    setSpeed(newSpeed);
  },
);

watch(
  () => props.direction,
  (newDirection) => {
    setDirection(newDirection);
  },
);

// Expose methods
defineExpose({
  play,
  pause,
  stop,
  goToAndStop,
  setDirection,
  setSpeed,
  isLoaded,
  isPlaying,
  isLoading,
  isError,
});
</script>

<template>
  <div
    :class="containerClasses"
    :style="containerStyle"
    :title="title"
    :aria-label="ariaLabel"
    :role="role"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  >
    <!-- Loading placeholder -->
    <div
      v-if="isLoading && !isLoaded"
      class="flex items-center justify-center h-full"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
      <span v-if="placeholder" class="ml-2 text-sm text-muted-foreground">{{
        placeholder
      }}</span>
    </div>

    <!-- Error state -->
    <div
      v-else-if="isError"
      class="flex items-center justify-center h-full text-destructive"
    >
      <div class="text-sm">{{ error || "Failed to load animation" }}</div>
    </div>

    <!-- Lottie Animation -->
    <LottieAnimation
      v-if="path || animationData"
      ref="lottieRef"
      :options="lottieOptions"
      :width="width"
      :height="height"
      :class="playerClasses"
      @onDataReady="handleDataReady"
      @onDataFailed="handleDataFailed"
      @onDOMLoaded="handleDOMLoaded"
      @onComplete="handleComplete"
      @onLoopComplete="handleLoopComplete"
      @onEnterFrame="handleEnterFrame"
    />
  </div>
</template>
