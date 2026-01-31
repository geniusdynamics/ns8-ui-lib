# NS8 UI Library

A Vue 3 component library for NethServer 8 UI applications, built with TypeScript, TailwindCSS, and Shadcn Vue.

## Installation

```bash
pnpm add @geniusdynamics/ns8-ui-lib
# or
npm install @geniusdynamics/ns8-ui-lib
# or
yarn add @geniusdynamics/ns8-ui-lib
```

## Features

- **Vue 3** - Composition API with TypeScript support
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn Vue** - Accessible UI components
- **TypeScript** - Full type support
- **Vite** - Fast development and building

## Components

### NS Components (Enhanced)

- `NSCheckbox` - Checkbox component with validation
- `NSTextInput` - Text input with validation and icons
- `NSToggle` - Toggle/switch component
- `NSTag` - Tag/badge component
- `NSEmptyState` - Empty state display
- `NSInlineNotification` - Inline notifications (info, success, warning, error)
- `NSToastNotification` - Toast notifications
- `NSProgress` / `NSProgressBar` - Progress indicators
- `NSModal` / `NSModalTrigger` - Modal dialogs
- `NSSlider` / `NSByteSlider` - Slider inputs
- `NSPagination` - Pagination component
- `NSDataTable` - Data table with sorting, filtering, and pagination
- `NSWizard` - Multi-step wizard
- `NSBackupCard` - Backup management card
- `NSSystemdServiceCard` - Systemd service status card
- `NSSystemInfoCard` - System information card
- `NSLottieAnimation` - Lottie animation component

### UI Components (Shadcn Vue)

- Button, Card, Dialog, Input, Label, Select
- Sheet, Switch, Table, Tabs, Textarea

## Composables

```typescript
import {
  useUtilService,
  useDateTimeService,
  useQueryParamService,
  usePageTitleService,
  useTaskService,
  useFilterService,
  useStorageService,
  useIconService
} from '@geniusdynamics/ns8-ui-lib'

// UtilService - UUID generation, error messages, sorting
const { getUuid, getErrorMessage, sortByProperty } = useUtilService()

// DateTimeService - Date formatting
const { formatDate, formatTime } = useDateTimeService()

// QueryParamService - URL query parameter handling
const { getPage, getQueryParamsForApp } = useQueryParamService()

// PageTitleService - Page title management
const { setPageTitle } = usePageTitleService()

// TaskService - NS8 task execution
const { 
  createModuleTaskForApp, 
  createClusterTaskForApp,
  createErrorNotificationForApp 
} = useTaskService()
```

## Usage Example

```vue
<script setup lang="ts">
import { 
  NSInlineNotification, 
  NSTextInput, 
  NSToggle,
  useTaskService 
} from '@geniusdynamics/ns8-ui-lib'

const { createModuleTaskForApp } = useTaskService()
</script>

<template>
  <NSInlineNotification
    variant="success"
    title="Success!"
    description="Operation completed successfully."
  />
  
  <NSTextInput
    label="Hostname"
    placeholder="example.org"
  />
  
  <NSToggle
    label="Enable feature"
    left-text="Off"
    right-text="On"
  />
</template>
```

## Example Application

See the `example-vue3/` directory for a complete NS8 module UI example that demonstrates:
- Status page with services, images, volumes
- Settings page with configuration
- About page with module information
- Side menu navigation
- i18n internationalization

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build library
pnpm build-lib

# Type check
pnpm type-check
```

## Publishing

To publish the package to npm:

```bash
# 1. Build the library
pnpm build-lib

# 2. Update version in package.json
# Edit version field

# 3. Login to npm (if not already logged in)
npm login

# 4. Publish
npm publish --access public
```

## License

GPL-3.0-or-later

## Author

Genius Dynamics
