/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const useStorageService = () => {
  const getFromStorage = <T = any>(prop: string): T | null => {
    try {
      const item = localStorage.getItem(prop);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`Error reading from storage for key "${prop}":`, err);
      return null;
    }
  };

  const saveToStorage = (prop: string, object: any) => {
    try {
      localStorage.setItem(prop, JSON.stringify(object));
    } catch (err) {
      console.error(`Error saving to storage for key "${prop}":`, err);
    }
  };

  const deleteFromStorage = (prop: string) => {
    try {
      localStorage.removeItem(prop);
    } catch (err) {
      console.error(`Error deleting from storage for key "${prop}":`, err);
    }
  };

  return {
    getFromStorage,
    saveToStorage,
    deleteFromStorage,
  };
};
