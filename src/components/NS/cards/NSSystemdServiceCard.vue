<script setup lang="ts">
import { computed } from 'vue'
import { Info, CheckCircle, AlertCircle, Clock, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ServiceStatus {
  running: boolean
  enabled: boolean
  status?: string
  uptime?: string
  lastRestart?: string
  memory?: string
  cpu?: string
}

interface Props {
  title?: string
  description?: string
  icon?: any
  loading?: boolean
  status?: ServiceStatus
  serviceName?: string
  light?: boolean
  showUptime?: boolean
  showMetrics?: boolean
  maxHeight?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Service',
  description: '',
  loading: false,
  status: () => ({ running: false, enabled: false }),
  serviceName: '',
  light: false,
  showUptime: true,
  showMetrics: false,
})

const emit = defineEmits<{
  start: [serviceName: string]
  stop: [serviceName: string]
  restart: [serviceName: string]
  enable: [serviceName: string]
  disable: [serviceName: string]
  view: [serviceName: string]
}>()

const statusIcon = computed(() => {
  if (props.loading) return Clock
  
  if (!props.status.enabled) {
    return AlertCircle
  }
  
  if (props.status.running) {
    return CheckCircle
  }
  
  return Info
})

const statusClass = computed(() => {
  if (props.loading) return 'text-muted-foreground'
  
  if (!props.status.enabled) {
    return 'text-destructive'
  }
  
  if (props.status.running) {
    return 'text-green-600'
  }
  
  return 'text-orange-600'
})

const statusBadgeVariant = computed(() => {
  if (props.loading) return 'secondary'
  
  if (!props.status.enabled) {
    return 'destructive'
  }
  
  if (props.status.running) {
    return 'default'
  }
  
  return 'secondary'
})

const statusText = computed(() => {
  if (props.loading) return 'Loading...'
  
  if (!props.status.enabled) {
    return 'Disabled'
  }
  
  if (props.status.running) {
    return props.status.status || 'Running'
  }
  
  return props.status.status || 'Stopped'
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

const iconClass = computed(() => {
  return cn('h-8 w-8', statusClass.value)
})
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-3">
          <component
            v-if="icon"
            :is="icon"
            :class="iconClass"
          />
          <div>
            <div class="text-lg font-semibold">{{ title }}</div>
            <CardDescription v-if="description">
              {{ description }}
            </CardDescription>
          </div>
        </CardTitle>
        
        <!-- Status badge -->
        <Badge :variant="statusBadgeVariant">
          {{ statusText }}
        </Badge>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
        <Skeleton class="h-4 w-2/3" />
      </div>

      <!-- Service details -->
      <div v-else class="space-y-3">
        <!-- Service name -->
        <div v-if="serviceName" class="text-sm text-muted-foreground">
          <span class="font-medium">Service:</span> {{ serviceName }}
        </div>

        <!-- Uptime -->
        <div v-if="showUptime && status?.uptime" class="flex items-center gap-2">
          <Clock class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm">
            <span class="font-medium">Uptime:</span> {{ status.uptime }}
          </span>
        </div>

        <!-- Last restart -->
        <div v-if="status?.lastRestart" class="text-sm text-muted-foreground">
          <span class="font-medium">Last restart:</span> {{ status.lastRestart }}
        </div>

        <!-- Metrics -->
        <div v-if="showMetrics" class="grid grid-cols-2 gap-3">
          <div v-if="status?.memory" class="text-sm">
            <span class="font-medium">Memory:</span> {{ status.memory }}
          </div>
          <div v-if="status?.cpu" class="text-sm">
            <span class="font-medium">CPU:</span> {{ status.cpu }}
          </div>
        </div>

        <!-- Custom status message -->
        <div v-if="status?.status && status?.status !== statusText" class="text-sm">
          {{ status.status }}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-between pt-4 border-t">
        <div class="flex gap-2">
          <Button
            v-if="status?.enabled && !status?.running"
            variant="default"
            size="sm"
            @click="emit('start', serviceName)"
          >
            Start
          </Button>
          <Button
            v-if="status?.enabled && status?.running"
            variant="outline"
            size="sm"
            @click="emit('stop', serviceName)"
          >
            Stop
          </Button>
          <Button
            v-if="status?.enabled"
            variant="outline"
            size="sm"
            @click="emit('restart', serviceName)"
          >
            Restart
          </Button>
          <Button
            v-if="!status?.enabled"
            variant="default"
            size="sm"
            @click="emit('enable', serviceName)"
          >
            Enable
          </Button>
          <Button
            v-if="status?.enabled"
            variant="destructive"
            size="sm"
            @click="emit('disable', serviceName)"
          >
            Disable
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          @click="emit('view', serviceName)"
        >
          <MoreHorizontal class="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>