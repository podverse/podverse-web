import React from 'react';
import styles from '../../styles/components/Form/InlineForm.module.scss';

type InlineFormProps = {
  children: React.ReactNode;
  className?: string;
};

type InlineFormInfoProps = {
  children: React.ReactNode;
  className?: string;
};

type InlineFormButtonsProps = {
  children: React.ReactNode;
  className?: string;
};

type InlineFormFieldGroupProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * A card-like inline form wrapper with secondary background.
 * Use for forms that appear within settings panels or other inline contexts.
 */
export function InlineForm({ children, className = '' }: InlineFormProps) {
  return (
    <div className={`${styles.inlineForm} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Info/help text within an InlineForm
 */
export function InlineFormInfo({ children, className = '' }: InlineFormInfoProps) {
  return (
    <div className={`${styles.inlineFormInfo} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Button container for InlineForm - right-aligned with gap
 */
export function InlineFormButtons({ children, className = '' }: InlineFormButtonsProps) {
  return (
    <div className={`${styles.inlineFormButtons} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Groups a field with its info text, with top margin for spacing
 */
export function InlineFormFieldGroup({ children, className = '' }: InlineFormFieldGroupProps) {
  return (
    <div className={`${styles.inlineFormFieldGroup} ${className}`}>
      {children}
    </div>
  );
}
