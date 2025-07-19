import React from "react";
import classNames from "classnames";
import { FaChevronRight } from "react-icons/fa";
import styles from "../../styles/components/Accordian/Accordian.module.scss";

type AccordionProps = {
  header: React.ReactNode;
  items: React.ReactNode;
  color?: "primary" | "secondary" | "link";
  size?: "small" | "large";
  open?: boolean;
};

const Accordion: React.FC<AccordionProps> = ({
  header,
  items,
  color = "primary",
  size = "large",
  open = false,
}) => (
  <details
    className={classNames(
      styles.accordion,
      styles[color],
      styles[size]
    )}
    open={open}
  >
    <summary className={styles.accordionHeader}>
      <span
        className={classNames(
          styles.headerIcon,
          styles[color]
        )}
      >
        <FaChevronRight />
      </span>
      <span className={styles.headerText}>{header}</span>
    </summary>
    <div className={styles.accordionContent}>{items}</div>
  </details>
);

export default Accordion;
