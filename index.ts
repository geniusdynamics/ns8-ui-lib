/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// NS Components
export {
  NSBackupCard,
  NSSystemdServiceCard,
  NSSystemInfoCard,
  NSByteSlider,
  NSCheckbox,
  NSDataTable,
  NSEmptyState,
  NSInlineNotification,
  NSLottieAnimation,
  NSModal,
  NSModalTrigger,
  NSPagination,
  NSProgress,
  NSProgressBar,
  NSSlider,
  NSTag,
  NSTextInput,
  NSToastNotification,
  NSToggle,
  NSWizard,
} from "./src/components/NS";

// Composables (Services)
export { useUtilService as UtilService } from "./src/composables/useUtilService";
export { useDateTimeService as DateTimeService } from "./src/composables/useDateTimeService";
export { useIconService as IconService } from "./src/composables/useIconService";
export { usePageTitleService as PageTitleService } from "./src/composables/usePageTitleService";
export { useQueryParamService as QueryParamService } from "./src/composables/useQueryParamService";
export { useStorageService as StorageService } from "./src/composables/useStorageService";
export { useTaskService as TaskService } from "./src/composables/useTaskService";
export { useFilterService as FilterService } from "./src/composables/useFilterService";
// Composables (Services)
export { useUtilService } from "./src/composables/useUtilService";
export { useDateTimeService } from "./src/composables/useDateTimeService";
export { useIconService } from "./src/composables/useIconService";
export { usePageTitleService } from "./src/composables/usePageTitleService";
export { useQueryParamService } from "./src/composables/useQueryParamService";
export { useStorageService } from "./src/composables/useStorageService";
export { useTaskService } from "./src/composables/useTaskService";
export { useFilterService } from "./src/composables/useFilterService";

// Install function for Vue app
import type { App } from "vue";

const Ns8UiLibNew = {
  install(app: App) {
    // No pictograms - using Lucide icons instead
  },
};

export default Ns8UiLibNew;

// Version
export const version = "1.0.0";
