/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Composables (Services)
export { useUtilService as UtilService } from "./src/composables/useUtilService";
export { useDateTimeService as DateTimeService } from "./src/composables/useDateTimeService";
export { useIconService as IconService } from "./src/composables/useIconService";
export { useLottieService as LottieService } from "./src/composables/useLottieService";
export { usePageTitleService as PageTitleService } from "./src/composables/usePageTitleService";
export { useQueryParamService as QueryParamService } from "./src/composables/useQueryParamService";
export { useStorageService as StorageService } from "./src/composables/useStorageService";
export { useTaskService as TaskService } from "./src/composables/useTaskService";
export { useFilterService as FilterService } from "./src/composables/useFilterService";

// Install function for Vue app
import type { App } from "vue";

const Ns8UiLibNew = {
  install(app: App) {},
};

export default Ns8UiLibNew;

// Version
export const version = "1.0.0";
