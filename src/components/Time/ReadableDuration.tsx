import { formatSecondsToReadableDuration } from "podverse-helpers";
import React from "react";
import styles from "../../styles/components/Time/ReadableDuration.module.scss";

type ReadableDurationProps = {
  durationInSeconds: string;
};

export const ReadableDuration: React.FC<ReadableDurationProps> = ({ durationInSeconds }) => {
  const readableTime = formatSecondsToReadableDuration(durationInSeconds || '0');
  return (
    <div className={styles.readableTime}>
      {readableTime}
    </div>
  )
}
