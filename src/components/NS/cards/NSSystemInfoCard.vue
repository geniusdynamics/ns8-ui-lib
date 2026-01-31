<script setup lang="ts">
import { computed } from 'vue'
import { HardDrive, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SystemMetrics {
  totalSpace: string
  usedSpace: string
  freeSpace: string
  usagePercentage: number
  temperature?: string
  loadAverage?: string[]
  uptime?: string
  processes?: number
  memory?: {
    total: string
    used: string
    free: string
    percentage: number
  }
  cpu?: {
    cores: number
    usage: number
    frequency: string
  }
}

interface Props {
  title?: string
  description?: string
  metrics?: SystemMetrics
  loading?: boolean
  refreshInterval?: number
  showTemperature?: boolean
  showLoadAverage?: boolean
  showUptime?: boolean
  showProcesses?: boolean
  showMemory?: boolean
  showCpu?: boolean
  showStorage?: boolean
  refreshable?: boolean
  light?: boolean
  maxHeight?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'System Information',
  description: 'Current system status and metrics',
  loading: false,
  showTemperature: false,
  showLoadAverage: true,
  showUptime: true,
  showProcesses: true,
  showMemory: true,
  showCpu: true,
  showStorage: true,
  refreshable: true,
  light: false,
})

const emit = defineEmits<{
  refresh: []
}>()

const hasMetrics = computed(() => !!props.metrics)

const storageVariant = computed(() => {
  if (!props.metrics?.usagePercentage) return 'default'
  
  const percentage = props.metrics.usagePercentage
  if (percentage >= 90) return 'destructive'
  if (percentage >= 80) return 'warning'
  if (percentage >= 60) return 'default'
  return 'success'
})

const memoryVariant = computed(() => {
  if (!props.metrics?.memory?.percentage) return 'default'
  
  const percentage = props.metrics.memory.percentage
  if (percentage >= 90) return 'destructive'
  if (percentage >= 80) return 'warning'
  if (percentage >= 60) return 'default'
  return 'success'
})

const cpuVariant = computed(() => {
  if (!props.metrics?.cpu?.usage) return 'default'
  
  const usage = props.metrics.cpu.usage
  if (usage >= 90) return 'destructive'
  if (usage >= 80) return 'warning'
  if (usage >= 60) return 'default'
  return 'success'
})

const containerClasses = computed(() => {
  return cn('w-full', props.class)
})

const cardClasses = computed(() => {
  return cn(
    'transition-all duration-200 hover:shadow-md',
    props.light ? 'bg-background/95' : 'bg-background'
  )
})

const metricsGridClasses = computed(() => {
  return cn('grid gap-4', {
    'grid-cols-1': !props.showMemory && !props.showCpu && !props.showStorage,
    'grid-cols-2': (props.showMemory && !props.showCpu && !props.showStorage) ||
                       (!props.showMemory && props.showCpu && !props.showStorage) ||
                       (!props.showMemory && !props.showCpu && props.showStorage),
    'grid-cols-3': (props.showMemory && props.showCpu && !props.showStorage) ||
                       (props.showMemory && !props.showCpu && props.showStorage) ||
                       (!props.showMemory && props.showCpu && props.showStorage),
    'lg:grid-cols-4': props.showMemory && props.showCpu && props.showStorage
  })
})
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            <Activity class="h-5 w-5 text-primary" />
            {{ title }}
          </CardTitle>
          <CardDescription>
            {{ description }}
          </CardDescription>
        </div>
        
        <!-- Refresh button -->
        <Button
          v-if="refreshable && !loading"
          variant="ghost"
          size="sm"
          @click="emit('refresh')"
        >
          <Clock class="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <div class="space-y-2">
          <div class="h-2 bg-secondary rounded-full" />
          <div class="h-2 bg-secondary rounded-full" />
          <div class="h-2 bg-secondary rounded-full" />
        </div>
      </div>

      <!-- System metrics -->
      <div v-else-if="hasMetrics" :class="metricsGridClasses">
        <!-- Storage metrics -->
        <div v-if="showStorage" class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium">
            <HardDrive class="h-4 w-4" />
            Storage
          </div>
          <Progress 
            :value="metrics.usagePercentage" 
            :variant="storageVariant"
            class="mb-2"
          />
          <div class="text-xs text-muted-foreground space-y-1">
            <div>Used: {{ metrics.usedSpace }} / {{ metrics.totalSpace }}</div>
            <div>Free: {{ metrics.freeSpace }}</div>
          </div>
        </div>

        <!-- Memory metrics -->
        <div v-if="showMemory && metrics?.memory" class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium">
            <Activity class="h-4 w-4" />
            Memory
          </div>
          <Progress 
            :value="metrics.memory.percentage" 
            :variant="memoryVariant"
            class="mb-2"
          />
          <div class="text-xs text-muted-foreground space-y-1">
            <div>Used: {{ metrics.memory.used }} / {{ metrics.memory.total }}</div>
            <div>Free: {{ metrics.memory.free }}</div>
          </div>
        </div>

        <!-- CPU metrics -->
        <div v-if="showCpu && metrics?.cpu" class="space-y-2">
          <div class="flex items-center gap-2 text-sm font-medium">
            <Activity class="h-4 w-4" />
            CPU
          </div>
          <Progress 
            :value="metrics.cpu.usage" 
            :variant="cpuVariant"
            class="mb-2"
          />
          <div class="text-xs text-muted-foreground space-y-1">
            <div>Usage: {{ metrics.cpu.usage }}%</div>
            <div>Cores: {{ metrics.cpu.cores }}</div>
            <div v-if="metrics.cpu.frequency">Frequency: {{ metrics.cpu.frequency }}</div>
          </div>
        </div>
      </div>

      <!-- Additional system info -->
      <div v-if="hasMetrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t">
        <!-- Temperature -->
        <div v-if="showTemperature && metrics?.temperature">
          <div class="text-xs text-muted-foreground">Temperature</div>
          <div class="text-sm font-medium">{{ metrics.temperature }}</div>
        </div>

        <!-- Load average -->
        <div v-if="showLoadAverage && metrics?.loadAverage">
          <div class="text-xs text-muted-foreground">Load Average</div>
          <div class="text-sm font-medium">{{ metrics.loadAverage.join(', ') }}</div>
        </div>

        <!-- Uptime -->
        <div v-if="showUptime && metrics?.uptime">
          <div class="text-xs text-muted-foreground">Uptime</div>
          <div class="text-sm font-medium">{{ metrics.uptime }}</div>
        </div>

        <!-- Processes -->
        <div v-if="showProcesses && metrics?.processes">
          <div class="text-xs text-muted-foreground">Processes</div>
          <div class="text-sm font-medium">{{ metrics.processes }}</div>
        </div>
      </div>

      <!-- No data state -->
      <div v-if="!hasMetrics && !loading" class="flex items-center gap-3 text-muted-foreground">
        <AlertCircle class="h-5 w-5" />
        <span>No system metrics available</span>
      </div>
    </CardContent>
  </Card>
</template>