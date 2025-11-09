"use client";

import classNames from 'classnames';
import React, { useState } from "react";
import NextImage from "next/image";
import { PROXY } from '../../constants/proxy';
import { IMAGES } from '../../constants/images';
import styles from "../../styles/components/Image/Image.module.scss";

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
  className
}) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <NextImage
        src={IMAGES.SRC.PLACEHOLDER}
        alt={alt}
        width={width}
        height={height}
        className={classNames(styles.imagePlaceholder, className)}
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