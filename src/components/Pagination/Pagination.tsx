"use client";

import React from "react";
import classNames from "classnames";
import NavArrowButton from "../NavArrowButton/NavArrowButton";
import { PAGINATION_MAX_BUTTONS } from "../../constants/pagination";
import styles from "../../styles/components/Pagination/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  children: React.ReactNode;
  maxButtons?: number;
  paginationControlsClassName?: string;
}

function getPageRange(currentPage: number, totalPages: number, maxButtons: number): number[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxButtons / 2);
  let start: number;
  let end: number;

  if (currentPage <= half) {
    start = 1;
    end = maxButtons;
  } else if (currentPage > totalPages - half) {
    start = totalPages - maxButtons + 1;
    end = totalPages;
  } else {
    start = currentPage - half;
    end = currentPage + half;
  }

  start = Math.max(1, start);
  end = Math.min(totalPages, end);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setPage,
  children,
  maxButtons = PAGINATION_MAX_BUTTONS,
  paginationControlsClassName = "",
}) => {
  const pageNumbers = getPageRange(currentPage, totalPages, maxButtons);

  const showPaginationControls = totalPages > 1;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className={styles.pagination}>
      {children}
      {showPaginationControls && (
        <div className={classNames(styles.paginationControls, paginationControlsClassName)}>
          {currentPage <= 1 ? (
            <span className={styles.arrowPlaceholder} />
          ) : (
            <NavArrowButton
              direction="left"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={false}
              ariaLabel="Previous page"
            />
          )}
          {pageNumbers.map((i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              disabled={i === currentPage}
              className={`${styles.pageButton} ${i === currentPage ? styles.active : ""}`}
            >
              {i}
            </button>
          ))}
          {currentPage >= totalPages ? (
            <span className={styles.arrowPlaceholder} />
          ) : (
            <NavArrowButton
              direction="right"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={false}
              ariaLabel="Next page"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;