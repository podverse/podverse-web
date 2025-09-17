import React from "react";
import classNames from "classnames";
import { FaChevronRight } from "react-icons/fa";
import styles from "../../styles/components/Accordian/Accordian.module.scss";

type AccordionProps = {
  header: React.ReactNode;
  headerClass?: string;
  content: React.ReactNode;
  contentClass?: string;
  color?: "primary" | "secondary" | "link";
  size?: "small" | "large";
  open?: boolean;
};

const Accordion: React.FC<AccordionProps> = ({
  header,
  headerClass,
  content,
  contentClass,
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
    <summary className={classNames(styles.accordionHeader, headerClass)}>
      <span
        className={classNames(
          styles.headerIcon,
          styles[color]
        )}
      >
        <FaChevronRight />
      </span>
      {header}
    </summary>
    <div className={classNames(styles.accordionContent, contentClass)}>
      {content}
    </div>
  </details>
);

export default Accordion;
