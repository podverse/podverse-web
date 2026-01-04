"use client";

import React from "react";
import { Link } from "../../Link/Link";
import styles from "../../../styles/components/Media/Header/IconButton.module.scss";

type IconButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
  color?: "secondary" | "primary";
  isGold?: boolean;
  type?: string;
  target?: '_blank';
  rel?: string;
  children?: React.ReactNode;
};

export const IconButton: React.FC<IconButtonProps> = ({
  href,
  onClick,
  className = "",
  ariaLabel,
  title,
  color = "secondary",
  isGold = false,
  type,
  target,
  rel,
  children
}) => {
  const classes = [styles.button, isGold ? styles.buttonGold : null, className].filter(Boolean).join(" ").trim();

  // Use Link component for consistent handling of anchor and button semantics
  return (
    <Link
      href={href || undefined}
      type={type as any}
      onClick={onClick as any}
      className={classes}
      aria-label={ariaLabel}
      title={title}
      color={color}
      target={target as '_blank' | undefined}
      rel={rel}
    >
      {children}
    </Link>
  );
};

export default IconButton;
