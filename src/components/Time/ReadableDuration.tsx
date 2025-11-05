"use client";

import { useTranslations } from "next-intl";
import { DTOItem, formatSecondsToReadableDuration, QueueResourcesAbridgedIndex } from "podverse-helpers";
import React from "react";

type ReadableDurationProps = {
  durationStr: string | null;
  positionStr: string | null;
};

export function getDurationAndPositionStr(
  item: DTOItem,
  queueResourcesAbridgedIndex: QueueResourcesAbridgedIndex
): { durationStr: string | null, positionStr: string } {
  const queueResourceAbridged = queueResourcesAbridgedIndex.items?.[item.id];
  let durationStr = item.item_about?.duration ? item.item_about.duration.toString() : null;
  let positionStr = "";

  if (queueResourceAbridged) {
    if (Number(queueResourceAbridged.d) > 0) {
      durationStr = queueResourceAbridged?.d?.toString() || null;
    }
    if (Number(queueResourceAbridged.p) > 0) {
      positionStr = queueResourceAbridged?.p?.toString() || "";
    }
  }

  return { durationStr, positionStr };
}

export const ReadableDuration: React.FC<ReadableDurationProps> = ({ durationStr, positionStr }) => {
  const tInfo = useTranslations("info");
  const position = positionStr ? Number(positionStr) : null;
  const duration = durationStr ? Number(durationStr) : null;

  if (position && duration) {
    const timeLeft = duration - position;
    const readableTime = formatSecondsToReadableDuration(timeLeft.toString());
    return tInfo("time.left", { timeRemaining: readableTime });
  } else if (position && !duration) {
    const readableTime = formatSecondsToReadableDuration(position.toString());
    return tInfo("time.last", { timePosition: readableTime });
  } else if (duration) {
    const readableTime = formatSecondsToReadableDuration(duration.toString());
    return readableTime;
  } else {
    return "";
  }
};
