<script setup lang="ts">
import { ref } from 'vue'
import { 
  NSCheckbox, 
  NSTextInput, 
  NSToggle, 
  NSTag, 
  NSEmptyState, 
  NSInlineNotification 
} from '@/components/NS'

const checkboxValue = ref(false)
const textValue = ref('')
const toggleValue = ref(false)
const tags = ref(['Development', 'Vue.js', 'TypeScript'])

const handleTagRemove = (index: number) => {
  tags.value.splice(index, 1)
}

const handleNotificationClose = () => {
  console.log('Notification closed')
}

const handleNotificationAction = () => {
  console.log('Notification action triggered')
}
</script>

<template>
  <div class="p-8 space-y-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">NS Components Demo</h1>

    <!-- NS Checkbox -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Checkbox</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NSCheckbox
          v-model:checked="checkboxValue"
          label="Accept terms and conditions"
          description="By checking this box, you agree to our terms"
        />
        <NSCheckbox
          v-model:checked="checkboxValue"
          label="Enable notifications"
          description="Receive updates about your account"
          :checked="true"
        />
        <NSCheckbox
          v-model:checked="checkboxValue"
          label="Required field"
          description="This checkbox is required"
          error-message="This field is required"
          :checked="false"
        />
        <NSCheckbox
          v-model:checked="checkboxValue"
          label="Indeterminate state"
          description="Showing indeterminate state"
          :indeterminate="true"
        />
      </div>
    </div>

    <!-- NS Text Input -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Text Input</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NSTextInput
          v-model="textValue"
          label="Username"
          placeholder="Enter your username"
          description="Choose a unique username"
        />
        <NSTextInput
          v-model="textValue"
          label="Password"
          type="password"
          placeholder="Enter your password"
          :show-password-toggle="true"
        />
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
          label="Invalid Input"
          placeholder="Type something invalid"
          error-message="This field has an error"
        />
      </div>
    </div>

    <!-- NS Toggle -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Toggle</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <NSToggle
          v-model:checked="toggleValue"
          label="Maintenance Mode"
          description="Site under maintenance"
          variant="warning"
        />
        <NSToggle
          v-model:checked="toggleValue"
          label="Delete Mode"
          description="Dangerous operation"
          variant="destructive"
        />
      </div>
    </div>

    <!-- NS Tag -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Tag</h2>
      <div class="flex flex-wrap gap-2">
        <NSTag v-for="(tag, index) in tags" :key="index" :label="tag" removable @remove="handleTagRemove(index)" />
        <NSTag label="Default" />
        <NSTag label="Secondary" variant="secondary" />
        <NSTag label="Destructive" variant="destructive" />
        <NSTag label="Success" variant="success" />
        <NSTag label="Warning" variant="warning" />
        <NSTag label="Info" variant="info" />
        <NSTag label="Large" size="lg" />
      </div>
    </div>

    <!-- NS Empty State -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Empty State</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NSEmptyState
          title="No results found"
          description="Try adjusting your search filters to find what you're looking for."
        />
        <NSEmptyState
          title="No files uploaded"
          description="Upload your first file to get started."
          icon="search"
        />
      </div>
    </div>

    <!-- NS Inline Notification -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">NS Inline Notification</h2>
      <div class="grid grid-cols-1 gap-4">
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
        <NSInlineNotification
          title="Error"
          description="Failed to save your changes. Please try again."
          variant="destructive"
          :show-close-button="true"
          :loading="false"
        />
      </div>
    </div>
  </div>
</template>