/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { onMounted } from "vue";

export const usePageTitleService = () => {
  const setPageTitle = (pageTitle: string | (() => string) | undefined) => {
    if (pageTitle) {
      const title = typeof pageTitle === "function" ? pageTitle() : pageTitle;

      if (title.includes(".title")) {
        const productName = (window as any).parent?.CONFIG?.PRODUCT_NAME || "";
        document.title = productName;
        if ((window as any).parent?.document) {
          (window as any).parent.document.title = productName;
        }
      } else {
        document.title = title;
        if ((window as any).parent?.document) {
          (window as any).parent.document.title = title;
        }
      }
    }
  };

  onMounted(() => {
    const meta = document.querySelector('meta[name="vue-page-title"]') as HTMLMetaElement;
    if (meta) {
      setPageTitle(meta.content);
    }
  });

  return {
    setPageTitle,
  };
};
