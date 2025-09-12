"use client";

import classNames from 'classnames';
import React, { useState } from "react";
import NextImage from "next/image";
import styles from "../../styles/components/Image/Image.module.scss";

interface ImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  noBorderRadius?: boolean;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  noBorderRadius = false
}) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={classNames(styles.imagePlaceholder, className)}
        style={{ width, height }}
        aria-label={alt}
      />
    );
  }

  const borderRadius = noBorderRadius ? 0 : 'var(--border-radius)';

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      style={{ borderRadius }}
    />
  );
};

export default Image;