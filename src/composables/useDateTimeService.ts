/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { formatDistance, subDays, isBefore } from "date-fns";
import { parseISO } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";

export const useDateTimeService = () => {
  const formatDate = format;
  const formatDateDistance = formatDistance;
  const subDaysFn = subDays;
  const parseIsoDate = parseISO;
  const dateIsBefore = isBefore;

  const formatInTimeZone = (date: Date | string, fmt: string, tz: string) => {
    return format(toZonedTime(date, tz), fmt, { timeZone: tz });
  };

  return {
    formatDate,
    formatDateDistance,
    subDays: subDaysFn,
    parseIsoDate,
    dateIsBefore,
    formatInTimeZone,
  };
};
