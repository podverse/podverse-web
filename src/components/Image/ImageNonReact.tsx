"use client";

import classNames from 'classnames';
import React, { useState } from "react";
import { PROXY } from '../../constants/proxy';
import { IMAGES } from '../../constants/images';
import styles from "../../styles/components/Image/ImageNonReact.module.scss";

interface ImageNonReactProps {
  src?: string | null;
  alt: string;
  className?: string;
  skipProxy?: boolean;
}

export const ImageNonReact: React.FC<ImageNonReactProps> = ({
  src,
  alt,
  className,
  skipProxy
}) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <img
        src={IMAGES.SRC.PLACEHOLDER}
        alt={alt}
        className={classNames(styles.imagePlaceholder, className)}
      />
    );
  }

  const finalSrc = skipProxy ? src : PROXY.PATH + encodeURIComponent(src);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};
