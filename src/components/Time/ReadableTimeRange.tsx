"use client";

import { useTranslations } from "next-intl";
import { formatHHMMSS } from "podverse-helpers";
import React from "react";

type ReadableTimeRangeProps = {
  startTime: string;
  endTime?: string | null;
};

export const ReadableTimeRange: React.FC<ReadableTimeRangeProps> = ({ startTime, endTime }) => {
  const tFeatures = useTranslations("features");

  if (!startTime) return null;

  const readableStartTime = formatHHMMSS(Number(startTime));
  const readableEndTime = endTime ? formatHHMMSS(Number(endTime)) : null;

  if (endTime) {
    return tFeatures("clip.clip_time_range", {
      hhmmssStart: readableStartTime,
      hhmmssEnd: readableEndTime ?? ""
    });
  } else {
    return readableStartTime;
  }
}
