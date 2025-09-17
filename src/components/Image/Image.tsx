"use client";

import classNames from 'classnames';
import React, { useState } from "react";
import NextImage from "next/image";
import styles from "../../styles/components/Image/Image.module.scss";
import { PROXY } from '../../constants/proxy';

interface ImageProps {
  src?: string | null;
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

  const proxySrc = PROXY.PATH + src;

  return (
    <NextImage
      src={proxySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default Image;