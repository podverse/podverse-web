import React from "react";
import NextLink from "next/link";
import classNames from "classnames";
import styles from "../../styles/components/Link/Link.module.scss";

type CustomLinkProps = {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  tabIndex?: number;
  "aria-label"?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  color?: 'primary' | 'secondary';
  target?: '_blank';
  rel?: string;
  title?: string;
};

export const Link: React.FC<CustomLinkProps> = ({
  href,
  onClick,
  children,
  className,
  type = "button",
  tabIndex,
  "aria-label": ariaLabel,
  disabled = false,
  style,
  color = 'primary',
  target,
  rel,
  title
}) => {
  const linkClassName = color === 'primary' ? styles.link : styles.linkSecondary;

  if (href) {
    if (disabled) {
      return (
        <span
          className={classNames(linkClassName, className, styles.disabled)}
          aria-disabled="true"
          style={style}
          title={title}
        >
          {children}
        </span>
      );
    }
    return (
      <NextLink
        href={href}
        className={classNames(linkClassName, className)}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        title={title}
        style={style}
        target={target}
        rel={rel}
      >
        {children}
      </NextLink>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(linkClassName, className)}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};
