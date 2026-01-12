"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FaInfoCircle } from 'react-icons/fa';
import { Button } from '../Button/Button';
import styles from '../../styles/components/PopoverIcon/PopoverIcon.module.scss';

type PopoverIconProps = {
  text: string;
  ariaLabel?: string;
};

type PopoverPosition = {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
};

export const PopoverIcon: React.FC<PopoverIconProps> = ({
  text,
  ariaLabel
}) => {
  const tMisc = useTranslations('misc');
  const defaultAriaLabel = ariaLabel || tMisc('show_help_information');
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate popover position and width
  useEffect(() => {
    if (!isOpen || !buttonRef.current) {
      setPosition(null);
      return;
    }

    const calculatePosition = () => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportPadding = 16; // Padding from viewport edges
      const minWidth = 200;
      const maxWidth = 400;

      // Calculate available space
      const spaceToLeft = buttonRect.left;
      const spaceToRight = viewportWidth - buttonRect.right;
      const totalAvailableSpace = spaceToLeft + spaceToRight - (viewportPadding * 2);

      // Determine optimal width
      let popoverWidth = Math.min(maxWidth, Math.max(minWidth, totalAvailableSpace));

      // Calculate horizontal position - center relative to button
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      let popoverLeft = buttonCenterX - popoverWidth / 2;

      // Adjust if popover goes off-screen on the left
      if (popoverLeft < viewportPadding) {
        popoverLeft = viewportPadding;
        // Recalculate width if we hit the left edge
        const maxWidthFromLeft = viewportWidth - viewportPadding - viewportPadding;
        popoverWidth = Math.min(popoverWidth, maxWidthFromLeft);
      }

      // Adjust if popover goes off-screen on the right
      if (popoverLeft + popoverWidth > viewportWidth - viewportPadding) {
        popoverLeft = viewportWidth - viewportPadding - popoverWidth;
        // Recalculate width if we hit the right edge
        const maxWidthFromRight = viewportWidth - viewportPadding - viewportPadding;
        popoverWidth = Math.min(popoverWidth, maxWidthFromRight);
      }

      // Ensure minimum width
      if (popoverWidth < minWidth) {
        popoverWidth = minWidth;
        // Adjust left if we're at minimum width
        if (popoverLeft + popoverWidth > viewportWidth - viewportPadding) {
          popoverLeft = viewportWidth - viewportPadding - popoverWidth;
        }
        if (popoverLeft < viewportPadding) {
          popoverLeft = viewportPadding;
        }
      }

      // Calculate arrow position relative to popover
      const arrowLeft = buttonCenterX - popoverLeft;
      // Clamp arrow to stay within popover bounds (with some padding)
      const arrowPadding = 20;
      const clampedArrowLeft = Math.max(
        arrowPadding,
        Math.min(popoverWidth - arrowPadding, arrowLeft)
      );

      // Calculate vertical position (above the button)
      // We'll position the bottom of the popover just above the button
      // Since we don't know the height yet, we'll use a reasonable offset
      // The popover will render and the arrow will point to the button
      const marginFromButton = 8; // Space between popover and button
      const estimatedPopoverHeight = 100; // Rough estimate, will adjust if needed
      const popoverTop = buttonRect.top - estimatedPopoverHeight - marginFromButton;

      setPosition({
        top: popoverTop,
        left: popoverLeft,
        width: popoverWidth,
        arrowLeft: clampedArrowLeft
      });
    };

    calculatePosition();

    // Recalculate on scroll/resize if pinned
    if (isPinned) {
      const handleScroll = () => {
        calculatePosition();
      };
      const handleResize = () => {
        calculatePosition();
      };
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }

    return undefined;
  }, [isOpen, isPinned]);

  // Handle click outside to close (only if pinned)
  useEffect(() => {
    if (!isOpen || !isPinned) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
        setIsPinned(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isPinned]);

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setIsPinned(newState);
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        ref={buttonRef}
        variant="unstyled"
        onClick={handleClick}
        aria-label={defaultAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
        className={styles.iconButton}
      >
        <FaInfoCircle className={styles.icon} />
      </Button>
      {isOpen && position && (
        <div
          ref={popoverRef}
          className={styles.popover}
          role="tooltip"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            '--arrow-left': `${position.arrowLeft}px`
          } as React.CSSProperties & { '--arrow-left': string }}
        >
          {text}
        </div>
      )}
    </div>
  );
};
