/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { nextTick } from 'vue';
import { v4 as uuidv4 } from "uuid";

export const useUtilService = () => {
  const DELETE_DELAY = 7000; // you have 7 seconds to cancel object deletion
  const time24HourPattern = /([01]\d|2[0-3]):?([0-5]\d)/;
  const time24HourPatternString = "([01]\\d|2[0-3]):?([0-5]\\d)";
  const time24HourPlaceholder = "hh:mm";
  // used to highlight the anchor user has just navigated to
  let highlightAnchor = "";
  const ipAddressPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
  const cidrPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}\/(\d){1,2}$/;

  const getErrorMessage = (error: any, t?: (key: string, args?: any) => string) => {
    if (error.message === "Network Error") {
      return t ? t("error.network_error") : "Network error";
    }

    if (/^timeout of .+ exceeded$/.test(error.message)) {
      // axios timeout reached
      return t ? t("error.network_timeout") : "Network timeout";
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          return t ? t("error.401") : "Unauthorized";
        case 403:
          return t ? t("error.403") : "Forbidden";
        case 404:
          return t ? t("error.404") : "Not found";
      }
    }

    return t ? t("error.generic_error") : "Generic error";
  };

  /**
   * Clear errors inside context. Used to clear previous errors before input data validation
   */
  const clearErrors = (error: any) => {
    clearStrings(error);
  };

  const clearStrings = (obj: any) => {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] == "string") {
        obj[key] = "";
      } else if (typeof obj[key] == "boolean") {
        obj[key] = false;
      } else if (typeof obj[key] == "object") {
        // recursion
        clearStrings(obj[key]);
      } else {
        console.error("unexpected object type:", typeof obj[key]);
      }
    }
  };

  /**
   * Sort function to order array elements by a specific property (for array of objects) or by a specific index (for arrays of arrays)
   */
  const sortByProperty = (property: string) => {
    return function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  /**
   * Sort function for module instances (e.g. ["dokuwiki1", "dokuwiki2", "dokuwiki11"])
   */
  const sortModuleInstances = () => {
    return function (instance1: any, instance2: any) {
      const instance1Name = instance1.id.split(/[0-9]+/)[0];
      const instance1Number = parseInt(
        instance1.id.substring(instance1Name.length)
      );

      const instance2Name = instance2.id.split(/[0-9]+/)[0];
      const instance2Number = parseInt(
        instance2.id.substring(instance2Name.length)
      );

      // compare instance names
      if (instance1Name < instance2Name) {
        return -1;
      } else if (instance1Name > instance2Name) {
        return 1;
      } else {
        // compare instance numbers
        if (instance1Number < instance2Number) {
          return -1;
        } else if (instance1Number > instance2Number) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  };

  /**
   * Return if input string can be parsed as a JSON object
   */
  const isJson = (s: string) => {
    try {
      JSON.parse(s);
      return true;
    } catch (err) {
      return false;
    }
  };

  /**
   * Try to parse input string and return a JSON object. If input string cannot be parsed, then input string is returned
   */
  const tryParseJson = (s: string) => {
    try {
      return JSON.parse(s);
    } catch (err) {
      return s;
    }
  };

  /**
   * Set focus on an HTML element
   */
  const focusElement = (elementRef: any) => {
    nextTick(() => {
      const element = elementRef.value || elementRef;
      if (element && element.focus) {
        element.focus();
      }
    });
  };

  /**
   * Smoothly scroll to a specific element in the page
   */
  const scrollToElement = (element: Element) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  /**
   * Get app description using the locale
   */
  const getAppDescription = (app: any, t: (key: string, args?: any) => string, locale: string) => {
    let description = app.description[locale];

    if (!description) {
      // fallback to english
      description = app.description.en;
    }
    return description;
  };

  /**
   * Get app categories using the locale
   */
  const getAppCategories = (app: any, t: (key: string, args?: any) => string) => {
    let i18nCategories: string[] = [];

    for (const category of app.categories) {
      if (category === "unknown") {
        return "";
      }

      i18nCategories.push(
        t("software_center.app_categories." + category)
      );
    }
    return i18nCategories.join(", ");
  };

  /**
   * Used in Backup section
   */
  const getBackupScheduleDescription = (schedule: any, t: (key: string, args?: any) => string) => {
    if (!schedule) {
      return "-";
    }

    switch (schedule.interval) {
      case "hourly":
        if (schedule.minute == 0) {
          return t("backup.every_hour");
        } else {
          return t("backup.minutes_past_the_hour", { minutes: schedule.minute });
        }
      case "daily":
        if (time24HourPattern.test(schedule.time)) {
          return t("backup.every_day_at", { time: schedule.time });
        } else {
          return "-";
        }
      case "weekly":
        if (time24HourPattern.test(schedule.time)) {
          return t("backup.every_weekday_at_hour", {
            weekDay: t("calendar." + schedule.weekDay),
            time: schedule.time,
          });
        } else {
          return "-";
        }
      case "monthly":
        if (time24HourPattern.test(schedule.time)) {
          return t("backup.every_month_at_time", {
            dayNum: schedule.monthDay,
            time: schedule.time,
          });
        } else {
          return "-";
        }
      default:
        return "-";
    }
  };

  /**
   * Get the base64 representation of a file
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Generate a universally unique identifier
   */
  const getUuid = () => {
    return uuidv4();
  };

  /**
   * Get a readable label for a node
   */
  const getNodeLabel = (node: any, t: (key: string, args?: any) => string) => {
    return node.ui_name
      ? node.ui_name + " (" + t("common.node") + " " + node.id + ")"
      : t("common.node") + " " + node.id;
  };

  /**
   * Get a readable short label for a node
   */
  const getShortNodeLabel = (node: any, t: (key: string, args?: any) => string) => {
    return node.ui_name
      ? node.ui_name
      : t("common.node") + " " + node.id;
  };

  /**
   * Decode a jwt token and parse its payload
   */
  const decodeJwtPayload = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  /**
   * Get SHA256 digest of a string
   */
  const getSha256 = async (message: string) => {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash message
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  return {
    DELETE_DELAY,
    time24HourPattern,
    time24HourPatternString,
    time24HourPlaceholder,
    highlightAnchor,
    ipAddressPattern,
    cidrPattern,
    getErrorMessage,
    clearErrors,
    clearStrings,
    sortByProperty,
    sortModuleInstances,
    isJson,
    tryParseJson,
    focusElement,
    scrollToElement,
    getAppDescription,
    getAppCategories,
    getBackupScheduleDescription,
    fileToBase64,
    getUuid,
    getNodeLabel,
    getShortNodeLabel,
    decodeJwtPayload,
    getSha256,
  };
};