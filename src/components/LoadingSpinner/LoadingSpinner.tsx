import React from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "../../styles/components/LoadingSpinner/LoadingSpinner.module.scss";

type SpinnerSize = "small" | "medium" | "large";

const sizeMap: Record<SpinnerSize, number> = {
  small: 18,
  medium: 32,
  large: 48,
};

type Props = {
  size?: SpinnerSize;
  className?: string;
  style?: React.CSSProperties;
};

const LoadingSpinner: React.FC<Props> = ({
  size = "medium",
  className = "",
  style = {},
}) => (
  <FaSpinner
    className={`${styles.spinner} ${className}`}
    style={style}
    size={sizeMap[size]}
    aria-label="Loading"
  />
);

export default LoadingSpinner;