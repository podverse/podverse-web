"use client";

import { useTranslations } from "next-intl";
import { formatHHMMSS } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Time/ReadableDuration.module.scss";

type ReadableTimeRangeProps = {
  startTime: string;
  endTime?: string | null;
};

export const ReadableTimeRange: React.FC<ReadableTimeRangeProps> = ({ startTime, endTime }) => {
  const tFeatures = useTranslations("features");

  if (!startTime) return null;

  const readableStartTime = formatHHMMSS(Number(startTime));
  const readableEndTime = endTime ? formatHHMMSS(Number(endTime)) : null;

  return (
    <div className={styles.readableDuration}>
      {tFeatures("clip.clip_time_range", { hhmmssStart: readableStartTime, hhmmssEnd: readableEndTime ?? "" })}
    </div>
  )
}
