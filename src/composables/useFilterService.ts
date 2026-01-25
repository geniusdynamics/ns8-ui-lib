/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const useFilterService = () => {
  const byteFormat = (size: number | null | string): string => {
    if (size === null || size === "" || isNaN(Number(size))) {
      return "-";
    }

    const numSize = Number(size);

    switch (true) {
      case numSize >= 0 && numSize < 1024:
        return `${numSize} B`;
      case numSize >= 1024 && numSize < Math.pow(1024, 2):
        return `${Math.round((numSize / 1024) * 100) / 100} KiB`;
      case numSize >= Math.pow(1024, 2) && numSize < Math.pow(1024, 3):
        return `${Math.round((numSize / Math.pow(1024, 2)) * 100) / 100} MiB`;
      case numSize >= Math.pow(1024, 3) && numSize < Math.pow(1024, 4):
        return `${Math.round((numSize / Math.pow(1024, 3)) * 100) / 100} GiB`;
      default:
        return `${Math.round((numSize / Math.pow(1024, 4)) * 100) / 100} TiB`;
    }
  };

  const humanFormat = (number: number | null | string, decimals: boolean = false): string => {
    if (number === null || number === "" || isNaN(Number(number))) {
      return "-";
    }

    const numNumber = Number(number);

    switch (true) {
      case numNumber >= 0 && numNumber < 1000:
        return `${numNumber}`;
      case numNumber >= 1000 && numNumber < Math.pow(1000, 2):
        if (decimals) {
          return `${Math.round((numNumber / 1000) * 10) / 10} K`;
        } else {
          return `${Math.round(numNumber / 1000)} K`;
        }
      case numNumber >= Math.pow(1000, 2) && numNumber < Math.pow(1000, 3):
        if (decimals) {
          return `${Math.round((numNumber / Math.pow(1000, 2)) * 10) / 10} M`;
        } else {
          return `${Math.round(numNumber / Math.pow(1000, 2))} M`;
        }
      case numNumber >= Math.pow(1000, 3) && numNumber < Math.pow(1000, 4):
        if (decimals) {
          return `${Math.round((numNumber / Math.pow(1000, 3)) * 10) / 10} G`;
        } else {
          return `${Math.round(numNumber / Math.pow(1000, 3))} G`;
        }
      default:
        if (decimals) {
          return `${Math.round((numNumber / Math.pow(1000, 4)) * 10) / 10} T`;
        } else {
          return `${Math.round(numNumber / Math.pow(1000, 4))} T`;
        }
    }
  };

  const mibFormat = (size: number | null | string): string => {
    if (size === null || size === "" || isNaN(Number(size))) {
      return "-";
    }

    const numSize = Number(size);

    switch (true) {
      case numSize >= 0 && numSize < 1024:
        return `${numSize} MiB`;
      case numSize >= 1024 && numSize < Math.pow(1024, 2):
        return `${Math.round((numSize / 1024) * 100) / 100} GiB`;
      default:
        return `${Math.round((numSize / Math.pow(1024, 2)) * 100) / 100} TiB`;
    }
  };

  const gibFormat = (size: number | null | string): string => {
    if (size === null || size === "" || isNaN(Number(size))) {
      return "-";
    }

    const numSize = Number(size);

    switch (true) {
      case numSize >= 0 && numSize < 1024:
        return `${numSize} GiB`;
      default:
        return `${Math.round((numSize / 1024) * 100) / 100} TiB`;
    }
  };

  const secondsFormat = (value: number): string => {
    if (value < 0) {
      return "-";
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = (value - (hours * 3600 + minutes * 60)) % 60;

    let duration = "";

    if (hours > 0) {
      duration += `${hours}h `;
    }

    if (minutes > 0) {
      duration += `${minutes}m `;
    }

    if (seconds > 0) {
      duration += `${seconds}s`;
    }

    if (!duration) {
      return "0s";
    }

    return duration.trim();
  };

  const secondsLongFormat = (value: number): string => {
    if (value < 0) {
      return "-";
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);
    const seconds = (value - (hours * 3600 + minutes * 60)) % 60;

    const dHours = hours > 9 ? hours : `0${hours}`;
    const dMins = minutes > 9 ? minutes : `0${minutes}`;
    const dSecs = seconds > 9 ? seconds : `0${seconds}`;

    return `${dHours}h ${dMins}m ${dSecs}s`;
  };

  return {
    byteFormat,
    humanFormat,
    mibFormat,
    gibFormat,
    secondsFormat,
    secondsLongFormat,
  };
};
