/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Pictograms
export { default as GearPictogram } from './src/components/pictograms/GearPictogram.vue'
export { default as UserPictogram } from './src/components/pictograms/UserPictogram.vue'
export { default as FolderPictogram } from './src/components/pictograms/FolderPictogram.vue'
export { default as ServerRackPictogram } from './src/components/pictograms/ServerRackPictogram.vue'
export { default as HardDrivePictogram } from './src/components/pictograms/HardDrivePictogram.vue'
export { default as DocumentSecurityPictogram } from './src/components/pictograms/DocumentSecurityPictogram.vue'
export { default as AppsPictogram } from './src/components/pictograms/AppsPictogram.vue'
export { default as BulldozerPictogram } from './src/components/pictograms/BulldozerPictogram.vue'
export { default as CircleCheckPictogram } from './src/components/pictograms/CircleCheckPictogram.vue'
export { default as ExclamationMarkPictogram } from './src/components/pictograms/ExclamationMarkPictogram.vue'
export { default as FaceSatisfiedPictogram } from './src/components/pictograms/FaceSatisfiedPictogram.vue'
export { default as GroupPictogram } from './src/components/pictograms/GroupPictogram.vue'
export { default as LovePictogram } from './src/components/pictograms/LovePictogram.vue'
export { default as UserProfilePictogram } from './src/components/pictograms/UserProfilePictogram.vue'
export { default as WarningPictogram } from './src/components/pictograms/WarningPictogram.vue'

// Composables (Services)
export { useUtilService as UtilService } from './src/composables/useUtilService'
export { useDateTimeService as DateTimeService } from './src/composables/useDateTimeService'
export { useIconService as IconService } from './src/composables/useIconService'
export { useLottieService as LottieService } from './src/composables/useLottieService'
export { usePageTitleService as PageTitleService } from './src/composables/usePageTitleService'
export { useQueryParamService as QueryParamService } from './src/composables/useQueryParamService'
export { useStorageService as StorageService } from './src/composables/useStorageService'
export { useTaskService as TaskService } from './src/composables/useTaskService'
export { useFilterService as FilterService } from './src/composables/useFilterService'

// Install function for Vue app
import type { App } from 'vue'
import GearPictogram from './src/components/pictograms/GearPictogram.vue'
import UserPictogram from './src/components/pictograms/UserPictogram.vue'
import FolderPictogram from './src/components/pictograms/FolderPictogram.vue'
import ServerRackPictogram from './src/components/pictograms/ServerRackPictogram.vue'
import HardDrivePictogram from './src/components/pictograms/HardDrivePictogram.vue'
import DocumentSecurityPictogram from './src/components/pictograms/DocumentSecurityPictogram.vue'
import AppsPictogram from './src/components/pictograms/AppsPictogram.vue'
import BulldozerPictogram from './src/components/pictograms/BulldozerPictogram.vue'
import CircleCheckPictogram from './src/components/pictograms/CircleCheckPictogram.vue'
import ExclamationMarkPictogram from './src/components/pictograms/ExclamationMarkPictogram.vue'
import FaceSatisfiedPictogram from './src/components/pictograms/FaceSatisfiedPictogram.vue'
import GroupPictogram from './src/components/pictograms/GroupPictogram.vue'
import LovePictogram from './src/components/pictograms/LovePictogram.vue'
import UserProfilePictogram from './src/components/pictograms/UserProfilePictogram.vue'
import WarningPictogram from './src/components/pictograms/WarningPictogram.vue'

const Ns8UiLibNew = {
  install(app: App) {
    // Pictograms
    app.component('GearPictogram', GearPictogram)
    app.component('UserPictogram', UserPictogram)
    app.component('FolderPictogram', FolderPictogram)
    app.component('ServerRackPictogram', ServerRackPictogram)
    app.component('HardDrivePictogram', HardDrivePictogram)
    app.component('DocumentSecurityPictogram', DocumentSecurityPictogram)
    app.component('AppsPictogram', AppsPictogram)
    app.component('BulldozerPictogram', BulldozerPictogram)
    app.component('CircleCheckPictogram', CircleCheckPictogram)
    app.component('ExclamationMarkPictogram', ExclamationMarkPictogram)
    app.component('FaceSatisfiedPictogram', FaceSatisfiedPictogram)
    app.component('GroupPictogram', GroupPictogram)
    app.component('LovePictogram', LovePictogram)
    app.component('UserProfilePictogram', UserProfilePictogram)
    app.component('WarningPictogram', WarningPictogram)
  }
}

export default Ns8UiLibNew

// Version
export const version = '1.0.0'
