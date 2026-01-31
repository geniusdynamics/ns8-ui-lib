<script setup lang="ts">
import { ref } from 'vue'
import { 
  NSCheckbox, 
  NSTextInput, 
  NSToggle, 
  NSTag, 
  NSEmptyState, 
  NSInlineNotification,
  NSToastNotification,
  NSProgress,
  NSProgressBar,
  NSModal,
  NSModalTrigger,
  NSSlider,
  NSByteSlider,
  NSPagination,
  NSDataTable,
  NSWizard,
  NSBackupCard,
  NSSystemdServiceCard,
  NSSystemInfoCard
} from '@/components/NS'

// Basic component states
const checkboxValue = ref(false)
const textValue = ref('')
const toggleValue = ref(false)
const tags = ref(['Development', 'Vue.js', 'TypeScript'])
const sliderValue = ref(50)
const byteSliderValue = ref(512)
const progressValue = ref(65)
const modalOpen = ref(false)
const currentPage = ref(1)
const wizardStep = ref(0)

// Data table states
const tableData = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
])

const tableColumns = ref([
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
])

// Wizard steps
const wizardSteps = ref([
  {
    id: 'account',
    title: 'Account Setup',
    description: 'Configure your account settings',
  },
  {
    id: 'profile',
    title: 'Profile Information',
    description: 'Provide your personal details',
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Set your application preferences',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review your information before submission',
  },
])

// Backup data
const backupData = ref([
  {
    id: 'backup-1',
    name: 'Daily Backup',
    date: '2024-01-15 02:00',
    size: '2.3 GB',
    enabled: true,
    status: 'success' as const,
  },
  {
    id: 'backup-2',
    name: 'Weekly Backup',
    date: '2024-01-14 02:00',
    size: '1.8 GB',
    enabled: true,
    status: 'success' as const,
  },
])

// System metrics
const systemMetrics = ref({
  totalSpace: '100 GB',
  usedSpace: '65 GB',
  freeSpace: '35 GB',
  usagePercentage: 65,
  temperature: '42°C',
  loadAverage: ['1.2', '1.5', '1.8'],
  uptime: '15 days, 7 hours',
  processes: 156,
  memory: {
    total: '16 GB',
    used: '8.2 GB',
    free: '7.8 GB',
    percentage: 51,
  },
  cpu: {
    cores: 8,
    usage: 23,
    frequency: '2.4 GHz',
  },
})

// Service status
const serviceStatus = ref({
  running: true,
  enabled: true,
  status: 'Running',
  uptime: '5 days, 12 hours',
  lastRestart: '2024-01-10 08:30',
  memory: '256 MB',
  cpu: '5%',
})

const handleTagRemove = (index: number) => {
  tags.value.splice(index, 1)
}

const handleNotificationClose = () => {
  console.log('Notification closed')
}

const handleNotificationAction = () => {
  console.log('Notification action triggered')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleWizardFinish = (data: any) => {
  console.log('Wizard finished:', data)
}
</script>

<template>
  <div class="p-8 space-y-12 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">NS Components - Complete Showcase</h1>

    <!-- Basic Form Controls -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Basic Form Controls</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- NS Checkbox -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">NS Checkbox</h3>
          <NSCheckbox
            v-model:checked="checkboxValue"
            label="Accept terms and conditions"
            description="By checking this box, you agree to our terms"
          />
          <NSCheckbox
            v-model:checked="checkboxValue"
            label="Required field"
            description="This checkbox is required"
            error-message="This field is required"
            :checked="false"
          />
        </div>

        <!-- NS Text Input -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">NS Text Input</h3>
          <NSTextInput
            v-model="textValue"
            label="Email"
            type="email"
            placeholder="email@example.com"
            prefix="📧"
            success-message="Email format is valid"
          />
          <NSTextInput
            v-model="textValue"
            label="Password"
            type="password"
            placeholder="Enter your password"
            :show-password-toggle="true"
          />
        </div>

        <!-- NS Toggle -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">NS Toggle</h3>
          <NSToggle
            v-model:checked="toggleValue"
            label="Dark Mode"
            description="Enable dark theme"
            left-text="Light"
            right-text="Dark"
          />
          <NSToggle
            v-model:checked="toggleValue"
            label="Notifications"
            description="Enable notifications"
            variant="success"
            :checked="true"
          />
        </div>
      </div>
    </section>

    <!-- Tags and Badges -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">NS Tag</h2>
      <div class="flex flex-wrap gap-2">
        <NSTag 
          v-for="(tag, index) in tags" 
          :key="index" 
          :label="tag" 
          removable 
          @remove="handleTagRemove(index)" 
        />
        <NSTag label="Default" />
        <NSTag label="Secondary" variant="secondary" />
        <NSTag label="Destructive" variant="destructive" />
        <NSTag label="Success" variant="success" />
        <NSTag label="Warning" variant="warning" />
        <NSTag label="Info" variant="info" />
        <NSTag label="Large" size="lg" />
      </div>
    </section>

    <!-- Progress and Sliders -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Progress & Sliders</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Progress Components</h3>
          <NSProgress
            :value="progressValue"
            show-label
            label="Upload Progress"
            description="File upload in progress..."
          />
          <NSProgressBar
            :value="progressValue"
            show-label
            label="Processing"
            description="Background task running..."
          />
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">Slider Components</h3>
          <NSSlider
            v-model="sliderValue"
            :max="100"
            show-label
            label="Volume Control"
            show-value
            format-value="(val) => `${val}%`"
          />
          <NSByteSlider
            v-model="byteSliderValue"
            :max="1024"
            show-label
            label="Memory Limit"
            show-value
          />
        </div>
      </div>
    </section>

    <!-- Empty State and Notifications -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Empty States & Notifications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Empty States</h3>
          <NSEmptyState
            title="No results found"
            description="Try adjusting your search filters to find what you're looking for."
          />
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">Notifications</h3>
          <NSInlineNotification
            title="Success!"
            description="Your changes have been saved successfully."
            variant="success"
            :show-close-button="true"
            @close="handleNotificationClose"
          />
          <NSInlineNotification
            title="Warning"
            description="Please review your input before proceeding."
            variant="warning"
            action-label="Review"
            @action="handleNotificationAction"
          />
        </div>
      </div>
    </section>

    <!-- Modal -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Modal</h2>
      <NSModalTrigger
        v-model="modalOpen"
        title="Example Modal"
        description="This is an example modal with rich content."
      >
        <template #trigger>
          <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Open Modal
          </button>
        </template>
        
        <div class="space-y-4">
          <p>This modal demonstrates the NSModal component with:</p>
          <ul class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Customizable sizes</li>
            <li>Fullscreen mode</li>
            <li>Header and footer slots</li>
            <li>Escape key and overlay click handling</li>
          </ul>
          <div class="flex justify-end gap-2 pt-4">
            <button 
              class="px-3 py-2 border border-input bg-background hover:bg-accent rounded-md"
              @click="modalOpen = false"
            >
              Cancel
            </button>
            <button 
              class="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              @click="modalOpen = false"
            >
              Confirm
            </button>
          </div>
        </div>
      </NSModalTrigger>
    </section>

    <!-- Data Table -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Data Table</h2>
      <NSDataTable
        :data="tableData"
        :columns="tableColumns"
        :current-page="currentPage"
        :items-per-page="2"
        :pagination="true"
        :searchable="true"
        :selectable="true"
        :striped="true"
        :hover="true"
        show-total
        @page-change="handlePageChange"
      />
    </section>

    <!-- Wizard -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Wizard</h2>
      <NSWizard
        v-model="wizardStep"
        :steps="wizardSteps"
        :show-progress-bar="true"
        :show-navigation="true"
        :allow-skip="true"
        finish-text="Complete Setup"
        @finish="handleWizardFinish"
      >
        <template #step-account>
          <div class="space-y-4">
            <NSTextInput label="Username" placeholder="Choose a username" />
            <NSTextInput label="Email" type="email" placeholder="your@email.com" />
            <NSTextInput label="Password" type="password" :show-password-toggle="true" />
          </div>
        </template>
        
        <template #step-profile>
          <div class="space-y-4">
            <NSTextInput label="First Name" placeholder="John" />
            <NSTextInput label="Last Name" placeholder="Doe" />
            <NSTextInput label="Phone" placeholder="+1 234 567 8900" />
          </div>
        </template>
        
        <template #step-preferences>
          <div class="space-y-4">
            <NSToggle label="Email Notifications" description="Receive email updates" />
            <NSToggle label="Push Notifications" description="Receive push notifications" />
            <NSToggle label="Dark Mode" description="Use dark theme" />
          </div>
        </template>
        
        <template #step-review>
          <div class="space-y-4">
            <NSEmptyState
              title="Review Your Information"
              description="Please review all the information you've provided before completing the setup."
              icon="search"
            />
          </div>
        </template>
      </NSWizard>
    </section>

    <!-- Specialized Cards -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Specialized Cards</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Backup Card -->
        <NSBackupCard
          :backups="backupData"
          :loading="false"
          title="Backup Management"
          no-backup-message="No backups configured"
          @backup="(id) => console.log('Backup:', id)"
          @restore="(id) => console.log('Restore:', id)"
          @delete="(id) => console.log('Delete:', id)"
        />

        <!-- Systemd Service Card -->
        <NSSystemdServiceCard
          title="Web Server"
          description="Apache HTTP Server"
          :status="serviceStatus"
          service-name="apache2"
          :show-uptime="true"
          :show-metrics="true"
          @start="(name) => console.log('Start:', name)"
          @stop="(name) => console.log('Stop:', name)"
          @restart="(name) => console.log('Restart:', name)"
        />

        <!-- System Info Card -->
        <NSSystemInfoCard
          title="System Overview"
          description="Current system status and resource usage"
          :metrics="systemMetrics"
          :show-storage="true"
          :show-memory="true"
          :show-cpu="true"
          :show-uptime="true"
          :show-temperature="true"
          :refreshable="true"
          @refresh="() => console.log('Refresh metrics')"
        />
      </div>
    </section>

    <!-- Pagination -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold">Pagination</h2>
      <NSPagination
        :current-page="currentPage"
        :total-items="50"
        :items-per-page="10"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="[5, 10, 20, 50]"
        @page-change="handlePageChange"
      />
    </section>
  </div>
</template>