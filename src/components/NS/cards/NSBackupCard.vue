<script setup lang="ts">
import { computed } from 'vue'
import { Save, AlertCircle, CheckCircle, Loader2, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Backup {
  id: string
  name: string
  date: string
  size: string
  enabled: boolean
  status?: 'success' | 'error' | 'running' | 'pending'
}

interface Status {
  [key: string]: {
    success?: boolean
    message?: string
  }
}

interface Props {
  title?: string
  loading?: boolean
  backups?: Backup[]
  status?: Status
  noBackupMessage?: string
  statusLabel?: string
  statusSuccessLabel?: string
  backupDisabledLabel?: string
  light?: boolean
  maxHeight?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Backup',
  loading: false,
  backups: () => [],
  status: () => ({}),
  noBackupMessage: 'No backups available',
  statusLabel: 'Status',
  statusSuccessLabel: 'Enabled',
  backupDisabledLabel: 'Disabled',
  light: false,
})

const emit = defineEmits<{
  backup: [backupId: string]
  restore: [backupId: string]
  delete: [backupId: string]
  enable: [backupId: string]
  disable: [backupId: string]
}>()

const hasBackups = computed(() => props.backups.length > 0)
const backupsContainingInstance = computed(() => props.backups.filter(backup => backup.enabled))
const singleBackup = computed(() => backupsContainingInstance.value.length === 1 ? backupsContainingInstance.value[0] : null)

const getStatusIcon = (backup: Backup) => {
  switch (backup.status) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'running':
      return Loader2
    default:
      return null
  }
}

const getStatusClass = (backup: Backup) => {
  switch (backup.status) {
    case 'success':
      return 'text-green-600'
    case 'error':
      return 'text-destructive'
    case 'running':
      return 'text-blue-600'
    default:
      return 'text-muted-foreground'
  }
}

const containerClasses = computed(() => {
  return cn('w-full', props.class)
})

const cardClasses = computed(() => {
  return cn(
    'transition-all duration-200 hover:shadow-md',
    props.light ? 'bg-background/95' : 'bg-background'
  )
})

const tableWrapperClasses = computed(() => {
  return cn('w-full overflow-auto', {
    'max-h-64': props.maxHeight
  })
})

const tableClasses = computed(() => {
  return 'w-full min-w-[300px]'
})
</script>

<template>
  <Card :class="cardClasses">
    <CardHeader class="pb-3">
      <CardTitle class="flex items-center gap-2">
        <Save class="h-5 w-5 text-primary" />
        {{ title }}
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Loading state -->
      <div v-if="loading" class="space-y-2">
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
      </div>

      <!-- No backups state -->
      <div v-else-if="!hasBackups" class="flex items-center gap-3 text-muted-foreground">
        <AlertCircle class="h-5 w-5" />
        <span>{{ noBackupMessage }}</span>
      </div>

      <!-- Single backup state -->
      <div v-else-if="singleBackup" class="space-y-4">
        <div :class="tableWrapperClasses">
          <div :class="tableClasses">
            <!-- Status row -->
            <div class="flex items-center justify-between py-2 border-b">
              <span class="text-sm font-medium">{{ statusLabel }}</span>
              <div class="flex items-center gap-2">
                <span
                  v-if="!singleBackup.enabled"
                  class="text-destructive"
                >
                  {{ backupDisabledLabel }}
                </span>
                <span
                  v-else-if="status[singleBackup.id]?.success"
                  class="text-green-600"
                >
                  {{ statusSuccessLabel }}
                </span>
                <span
                  v-else-if="status[singleBackup.id]?.message"
                  class="text-destructive"
                >
                  {{ status[singleBackup.id].message }}
                </span>
              </div>
            </div>

            <!-- Backup details -->
            <div class="space-y-2 py-2">
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Name:</span>
                <span class="text-sm font-medium">{{ singleBackup.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Date:</span>
                <span class="text-sm">{{ singleBackup.date }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-muted-foreground">Size:</span>
                <span class="text-sm">{{ singleBackup.size }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-2 pt-2">
          <Button
            v-if="singleBackup.enabled"
            variant="outline"
            size="sm"
            @click="emit('backup', singleBackup.id)"
          >
            Create Backup
          </Button>
          <Button
            v-if="singleBackup.enabled"
            variant="outline"
            size="sm"
            @click="emit('restore', singleBackup.id)"
          >
            Restore
          </Button>
          <Button
            variant="destructive"
            size="sm"
            @click="emit('delete', singleBackup.id)"
          >
            Delete
          </Button>
        </div>
      </div>

      <!-- Multiple backups state -->
      <div v-else>
        <div :class="tableWrapperClasses">
          <table :class="tableClasses">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2 text-sm font-medium">Name</th>
                <th class="text-left p-2 text-sm font-medium">Date</th>
                <th class="text-left p-2 text-sm font-medium">Size</th>
                <th class="text-left p-2 text-sm font-medium">Status</th>
                <th class="text-right p-2 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="backup in backups" :key="backup.id" class="border-b">
                <td class="p-2 text-sm">{{ backup.name }}</td>
                <td class="p-2 text-sm">{{ backup.date }}</td>
                <td class="p-2 text-sm">{{ backup.size }}</td>
                <td class="p-2 text-sm">
                  <div class="flex items-center gap-2">
                    <component
                      v-if="getStatusIcon(backup)"
                      :is="getStatusIcon(backup)"
                      :class="cn('h-4 w-4', getStatusClass(backup))"
                    />
                    <span :class="getStatusClass(backup)">
                      {{ backup.status || 'Unknown' }}
                    </span>
                  </div>
                </td>
                <td class="p-2 text-sm">
                  <div class="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="emit('enable', backup.id)"
                      :disabled="backup.enabled"
                    >
                      Enable
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="emit('disable', backup.id)"
                      :disabled="!backup.enabled"
                    >
                      Disable
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="emit('restore', backup.id)"
                    >
                      Restore
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CardContent>
  </Card>
</template>