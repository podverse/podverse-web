import React from "react";
import styles from "../../styles/components/NavArrowButton/NavArrowButton.module.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type NavArrowButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const NavArrowButton: React.FC<NavArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
  ariaLabel,
}) => (
  <button
    className={`${styles.navButton} ${direction === "left" ? styles.navButtonLeft : styles.navButtonRight}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    type="button"
  >
    {direction === "left" ? <FaChevronLeft /> : <FaChevronRight />}
  </button>
);

export default NavArrowButton;
