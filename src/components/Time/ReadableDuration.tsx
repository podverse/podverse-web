import { formatSecondsToReadableDuration } from "podverse-helpers";
import React from "react";

type ReadableDurationProps = {
  durationInSeconds: string | null;
};

export const ReadableDuration: React.FC<ReadableDurationProps> = ({ durationInSeconds }) => {
  if (!durationInSeconds) return null;

  const readableTime = formatSecondsToReadableDuration(durationInSeconds);
  
  return readableTime;
}
