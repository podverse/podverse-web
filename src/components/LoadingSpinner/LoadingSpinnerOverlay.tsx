import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import styles from "../../styles/components/LoadingSpinner/LoadingSpinnerOverlay.module.scss";

type Props = {
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  isLoading?: boolean;
};

const LoadingSpinnerOverlay: React.FC<Props> = ({ size = "large", className = "", style = {}, isLoading = false }) => {
  if (!isLoading) return null;

  return (
    <div className={`${styles.overlay} ${className}`} style={style}>
      <div className={styles.spinnerWrapper}>
        <LoadingSpinner size={size} />
      </div>
    </div>
  );
};

export default LoadingSpinnerOverlay;