"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";

type ReadableTimeProps = {
  start: string;
  end: string | null;
};

export const ReadableTime: React.FC<ReadableTimeProps> = ({ start, end }) => {
  const locale = useLocale();
  const tInfo = useTranslations("info");

  const formatTime = (time: string | Date) =>
    typeof time === "string"
      ? new Date(time).toLocaleTimeString(locale, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        })
      : time.toLocaleTimeString(locale, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });

  const startTime = formatTime(start);
  const endTime = end ? formatTime(end) : null;

  const timeText = endTime
    ? tInfo("time.start_end", { timeStart: startTime, timeEnd: endTime })
    : tInfo("time.start", { timeStart: startTime });

  return timeText;
};
