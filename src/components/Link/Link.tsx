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
};

const Link: React.FC<CustomLinkProps> = ({
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
  ...rest
}) => {
  const linkClassName = color === 'primary' ? styles.link : styles.linkSecondary;

  if (href) {
    return (
      <NextLink
        href={href}
        className={classNames(linkClassName, className)}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        style={style}
        {...rest}
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
      disabled={disabled}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Link;