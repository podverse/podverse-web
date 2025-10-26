"use client";

import { useTranslations } from "next-intl";
import { formatSecondsToReadableDuration } from "podverse-helpers";
import React from "react";

type ReadableDurationProps = {
  durationStr: string | null;
  positionStr: string | null;
};

export const ReadableDuration: React.FC<ReadableDurationProps> = ({ durationStr, positionStr }) => {
  const tInfo = useTranslations("info");
  const position = positionStr ? Number(positionStr) : null;
  const duration = durationStr ? Number(durationStr) : null;

  if (position && duration) {
    const readableTime = formatSecondsToReadableDuration((duration - position).toString());
    return tInfo("time.left", { timeRemaining: readableTime });
  } else if (position && !duration) {
    const readableTime = formatSecondsToReadableDuration(position.toString());
    return tInfo("time.last", { timePosition: readableTime });
  } else if (duration) {
    return formatSecondsToReadableDuration(duration.toString());
  } else {
    return "";
  }
}
