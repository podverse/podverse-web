import React from "react";
import styles from "../../styles/components/LoadingSpinner/LoadingSpinnerOverlay.module.scss";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
};

const LoadingSpinnerOverlay: React.FC<Props> = ({
  size = "large",
  className = "",
  style = {},
}) => (
  <div className={`${styles.overlay} ${className}`} style={style}>
    <div className={styles.spinnerWrapper}>
      <LoadingSpinner size={size} />
    </div>
  </div>
);

export default LoadingSpinnerOverlay;