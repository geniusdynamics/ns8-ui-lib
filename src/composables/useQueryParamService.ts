/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { watch, onMounted, onUnmounted, Ref } from "vue";
import { RouteLocationNormalized, Router } from "vue-router";

export const useQueryParamService = () => {
  const getTypedValue = (stringValue: string): string | boolean => {
    if (stringValue === "true") {
      return true;
    }

    if (stringValue === "false") {
      return false;
    }

    return stringValue;
  };

  const getQueryParamsFromHash = (hash: string = window.location.hash) => {
    if (!hash.includes("?") || hash.split("?").length < 2) {
      return {};
    }

    const params = new URLSearchParams(hash.split("?").pop() || "");
    const queryParams: Record<string, string> = {};

    params.forEach((value, key) => {
      if (key) {
        queryParams[key] = value;
      }
    });

    return queryParams;
  };

  const getQueryParams = () => {
    return getQueryParamsFromHash(window.location.hash);
  };

  const getQueryParamsForApp = () => {
    return getQueryParamsFromHash((window as any).parent?.location?.hash || "");
  };

  const queryParamsToData = (
    q: Ref<Record<string, any>>,
    queryParams: Record<string, string>
  ) => {
    if (q.value) {
      Object.keys(q.value).forEach((dataItem) => {
        if (typeof queryParams[dataItem] !== "undefined") {
          q.value[dataItem] = getTypedValue(queryParams[dataItem]);
        }
      });
    }
  };

  const dataToQueryParams = (q: Ref<Record<string, any>>, route: RouteLocationNormalized, router: Router) => {
    const queryParams: string[] = [];

    for (const [key, value] of Object.entries(q.value)) {
      queryParams.push(`${key}=${encodeURIComponent(String(value))}`);
    }

    const urlWithParams = route.path + "?" + queryParams.join("&");

    if (route.fullPath !== urlWithParams) {
      router.replace(urlWithParams);
    }
  };

  const watchQueryData = (q: Ref<Record<string, any>>, route: RouteLocationNormalized, router: Router) => {
    if (q.value) {
      Object.keys(q.value).forEach((dataItem) => {
        watch(
          () => q.value[dataItem],
          () => {
            dataToQueryParams(q, route, router);
          }
        );
      });
    }
  };

  let urlCheckInterval: number | null = null;

  const initUrlBindingForApp = (q: Ref<Record<string, any>>, page: string, callback?: (page: string) => void) => {
    let currentUrl = (window as any).parent?.location?.href || "";

    const syncQueryParamsAndDataForApp = () => {
      const queryParams = getQueryParamsForApp();
      queryParamsToData(q, queryParams);
      dataToQueryParams(q, { path: "", fullPath: "", query: {} } as RouteLocationNormalized, {
        replace: () => {},
      } as unknown as Router);
    };

    const checkUrlChangeForApp = () => {
      const newUrl = (window as any).parent?.location?.href || "";

      if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        const queryParams = getQueryParamsForApp();
        const requestedPage = queryParams.page || "status";

        if (callback) {
          callback(requestedPage);
        }

        if (requestedPage !== page) {
          window.dispatchEvent(
            new CustomEvent("changeRoute", { detail: requestedPage })
          );
        } else {
          syncQueryParamsAndDataForApp();
        }
      }
      currentUrl = (window as any).parent?.location?.href || "";
    };

    const queryParams = getQueryParamsForApp();
    const requestedPage = queryParams.page || "status";

    if (requestedPage !== page) {
      return null;
    }

    syncQueryParamsAndDataForApp();
    urlCheckInterval = window.setInterval(checkUrlChangeForApp, 500);

    return urlCheckInterval;
  };

  const cleanupUrlBinding = () => {
    if (urlCheckInterval !== null) {
      clearInterval(urlCheckInterval);
      urlCheckInterval = null;
    }
  };

  const getPage = () => {
    const queryParams = getQueryParams();
    return queryParams.page || "status";
  };

  return {
    getTypedValue,
    getQueryParams,
    getQueryParamsForApp,
    queryParamsToData,
    dataToQueryParams,
    watchQueryData,
    initUrlBindingForApp,
    cleanupUrlBinding,
    getPage,
  };
};
