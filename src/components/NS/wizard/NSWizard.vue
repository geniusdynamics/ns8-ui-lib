<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface WizardStep {
  id: string
  title: string
  description?: string
  icon?: any
  disabled?: boolean
  valid?: boolean
  onValidate?: () => boolean | Promise<boolean>
  onEnter?: () => void
  onLeave?: () => void
}

interface Props {
  modelValue?: number
  steps?: WizardStep[]
  vertical?: boolean
  showStepNumbers?: boolean
  showStepIcons?: boolean
  showNavigation?: boolean
  showProgressBar?: boolean
  allowSkip?: boolean
  hidePreviousOnFirst?: boolean
  hideNextOnLast?: boolean
  finishButtonText?: string
  nextButtonText?: string
  previousButtonText?: string
  skipButtonText?: string
  disabled?: boolean
  class?: string
  stepClass?: string
  navigationClass?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  steps: () => [],
  vertical: false,
  showStepNumbers: true,
  showStepIcons: false,
  showNavigation: true,
  showProgressBar: true,
  allowSkip: false,
  hidePreviousOnFirst: true,
  hideNextOnLast: false,
  finishButtonText: 'Finish',
  nextButtonText: 'Next',
  previousButtonText: 'Previous',
  skipButtonText: 'Skip',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [step: number]
  'step-change': [step: number, previousStep: number]
  'finish': [data: any]
  'skip': [step: number]
  'validate': [step: number, valid: boolean]
}>()

const currentStep = computed({
  get: () => props.modelValue || 0,
  set: (step: number) => {
    if (step >= 0 && step < props.steps.length && !props.disabled) {
      const previousStep = currentStep.value
      
      // Call onLeave for current step
      if (props.steps[previousStep]?.onLeave) {
        props.steps[previousStep].onLeave()
      }
      
      // Update step
      emit('update:modelValue', step)
      emit('step-change', step, previousStep)
      
      // Call onEnter for new step
      if (props.steps[step]?.onEnter) {
        props.steps[step].onEnter()
      }
    }
  }
})

const currentStepData = computed(() => {
  return props.steps[currentStep.value] || {}
})

const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === props.steps.length - 1)

const progressPercentage = computed(() => {
  return ((currentStep.value + 1) / props.steps.length) * 100
})

const containerClasses = computed(() => {
  const baseClasses = 'w-full'
  
  return cn(baseClasses, props.class)
})

const wizardClasses = computed(() => {
  const baseClasses = 'flex'
  
  return cn(
    baseClasses,
    props.vertical ? 'flex-col' : 'flex-col lg:flex-row gap-8'
  )
})

const stepsClasses = computed(() => {
  const baseClasses = 'flex'
  
  return cn(
    baseClasses,
    props.vertical ? 'flex-col space-y-4' : 'flex-row lg:flex-col lg:space-y-4'
  )
})

const contentClasses = computed(() => {
  const baseClasses = 'flex-1 min-w-0'
  
  return cn(baseClasses, props.contentClass)
})

const navigationClasses = computed(() => {
  const baseClasses = 'flex justify-between items-center pt-6'
  
  return cn(baseClasses, props.navigationClass)
})

const stepClasses = computed(() => {
  return cn(
    'flex items-center gap-3 cursor-pointer transition-colors',
    props.stepClass,
    {
      'opacity-50 cursor-not-allowed': props.disabled
    }
  )
})

const getStepState = (index: number) => {
  const step = props.steps[index]
  
  if (!step) return 'disabled'
  
  if (index < currentStep.value) return 'completed'
  if (index === currentStep.value) return 'active'
  if (step.disabled) return 'disabled'
  return 'pending'
}

const getStepClasses = (index: number) => {
  const state = getStepState(index)
  
  const baseClasses = 'flex items-center justify-center rounded-full transition-colors'
  
  const stateClasses = {
    completed: 'bg-primary text-primary-foreground',
    active: 'bg-primary text-primary-foreground ring-2 ring-ring ring-offset-2',
    pending: 'bg-muted text-muted-foreground border-2 border-border',
    disabled: 'bg-muted text-muted-foreground opacity-50 border-2 border-border'
  }

  return cn(baseClasses, stateClasses[state])
}

const canGoNext = computed(() => {
  if (props.disabled) return false
  if (isLastStep.value) return false
  
  const step = props.steps[currentStep.value]
  if (step?.disabled) return false
  
  // Check if current step is valid
  if (step?.valid === false) return false
  
  return true
})

const canGoPrevious = computed(() => {
  if (props.disabled) return false
  if (isFirstStep.value) return false
  
  return true
})

const canSkip = computed(() => {
  if (props.disabled) return false
  if (!props.allowSkip) return false
  
  const step = props.steps[currentStep.value]
  if (step?.disabled) return false
  
  return true
})

const goToStep = async (index: number) => {
  if (index < 0 || index >= props.steps.length) return
  
  const step = props.steps[index]
  if (step?.disabled) return
  
  // Validate current step if moving forward
  if (index > currentStep.value) {
    const currentStepData = props.steps[currentStep.value]
    if (currentStepData?.onValidate) {
      try {
        const isValid = await currentStepData.onValidate()
        emit('validate', currentStep.value, isValid)
        if (!isValid) return
      } catch (error) {
        emit('validate', currentStep.value, false)
        return
      }
    }
  }
  
  currentStep.value = index
}

const handleNext = async () => {
  if (!canGoNext.value) return
  
  const currentStepData = props.steps[currentStep.value]
  
  // Validate current step
  if (currentStepData?.onValidate) {
    try {
      const isValid = await currentStepData.onValidate()
      emit('validate', currentStep.value, isValid)
      if (!isValid) return
    } catch (error) {
      emit('validate', currentStep.value, false)
      return
    }
  }
  
  if (isLastStep.value) {
    emit('finish', {})
  } else {
    currentStep.value++
  }
}

const handlePrevious = () => {
  if (canGoPrevious.value) {
    currentStep.value--
  }
}

const handleSkip = () => {
  if (canSkip.value) {
    emit('skip', currentStep.value)
    if (!isLastStep.value) {
      currentStep.value++
    }
  }
}

// Watch for step changes
watch(currentStep, (newStep, oldStep) => {
  if (newStep !== oldStep) {
    // Auto-validate new step
    const step = props.steps[newStep]
    if (step?.onValidate) {
      step.onValidate().then(isValid => {
        emit('validate', newStep, isValid)
      })
    }
  }
}, { immediate: true })
</script>

<template>
  <div :class="containerClasses">
    <!-- Progress bar -->
    <div v-if="showProgressBar" class="mb-8">
      <div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          class="h-full w-full bg-primary transition-all duration-300 ease-in-out"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
      <div class="mt-2 text-sm text-muted-foreground">
        Step {{ currentStep + 1 }} of {{ steps.length }}
      </div>
    </div>

    <div :class="wizardClasses">
      <!-- Steps navigation -->
      <div :class="stepsClasses">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          :class="stepClasses"
          @click="goToStep(index)"
        >
          <!-- Step indicator -->
          <div :class="getStepClasses(index)" class="w-8 h-8 text-sm font-medium">
            <Check v-if="getStepState(index) === 'completed'" class="h-4 w-4" />
            <component v-else-if="showStepIcons && step.icon" :is="step.icon" class="h-4 w-4" />
            <span v-else-if="showStepNumbers">{{ index + 1 }}</span>
          </div>

          <!-- Step info -->
          <div class="text-left">
            <div class="font-medium text-sm">{{ step.title }}</div>
            <div v-if="step.description" class="text-xs text-muted-foreground">
              {{ step.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <Separator 
        v-if="!vertical" 
        orientation="vertical" 
        class="hidden lg:block" 
      />

      <!-- Content -->
      <div :class="contentClasses">
        <!-- Current step content -->
        <div class="space-y-6">
          <slot 
            :name="`step-${currentStepData.id}`" 
            :step="currentStepData"
            :index="currentStep"
            :isFirst="isFirstStep"
            :isLast="isLastStep"
            :next="handleNext"
            :previous="handlePrevious"
            :skip="handleSkip"
            :canGoNext="canGoNext"
            :canGoPrevious="canGoPrevious"
            :canSkip="canSkip"
          >
            <!-- Default step content -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold">{{ currentStepData.title }}</h2>
              <p v-if="currentStepData.description" class="text-muted-foreground">
                {{ currentStepData.description }}
              </p>
              <div class="text-sm text-muted-foreground">
                Step {{ currentStep + 1 }} of {{ steps.length }}
              </div>
            </div>
          </slot>
        </div>

        <!-- Navigation buttons -->
        <div v-if="showNavigation" :class="navigationClasses">
          <div class="flex gap-2">
            <!-- Previous button -->
            <Button
              v-if="!hidePreviousOnFirst || !isFirstStep"
              variant="outline"
              :disabled="!canGoPrevious"
              @click="handlePrevious"
            >
              <ChevronLeft class="h-4 w-4" />
              {{ previousButtonText }}
            </Button>

            <!-- Skip button -->
            <Button
              v-if="allowSkip && !isLastStep"
              variant="ghost"
              :disabled="!canSkip"
              @click="handleSkip"
            >
              {{ skipButtonText }}
            </Button>
          </div>

          <div class="flex gap-2">
            <!-- Next/Finish button -->
            <Button
              :disabled="!canGoNext"
              @click="handleNext"
            >
              {{ isLastStep ? finishButtonText : nextButtonText }}
              <ChevronRight v-if="!isLastStep" class="h-4 w-4" />
              <Check v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>