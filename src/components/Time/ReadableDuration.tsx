import { formatSecondsToReadableDuration } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Time/ReadableDuration.module.scss";

type ReadableDurationProps = {
  durationInSeconds: string | null;
};

export const ReadableDuration: React.FC<ReadableDurationProps> = ({ durationInSeconds }) => {
  if (!durationInSeconds) return null;

  const readableTime = formatSecondsToReadableDuration(durationInSeconds);
  
  return (
    <div className={styles.readableDuration}>
      {readableTime}
    </div>
  )
}
