/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const useLottieService = () => {
  const getLottieJson = (name: string) => {
    const lottieFiles: Record<string, any> = {
      ghost: () => import("../lib/lottie/ghost.json"),
      "ghost-dark-bg": () => import("../lib/lottie/ghost-dark-bg.json"),
      rocket: () => import("../lib/lottie/rocket.json"),
      gears: () => import("../lib/lottie/gears.json"),
    };

    const loadLottie = lottieFiles[name];
    if (loadLottie) {
      return loadLottie();
    }

    return Promise.reject(new Error(`Lottie animation "${name}" not found`));
  };

  return {
    getLottieJson,
  };
};
