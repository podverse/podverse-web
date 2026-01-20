import React, { ReactNode } from 'react'
import { FaTimes } from 'react-icons/fa'
import styles from '../../styles/components/Modal/Modal.module.scss'

type ModalProps = {
  isOpen: boolean
  onClose?: () => void
  ariaLabel: string
  children: ReactNode
  header?: string
  modalContentMaxWidth?: number
  contentTransparent?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  ariaLabel,
  children,
  header,
  modalContentMaxWidth,
  contentTransparent,
}: ModalProps) => {
  if (!isOpen) return null

  const modalContentStyle: React.CSSProperties = {
    ...(modalContentMaxWidth ? { maxWidth: modalContentMaxWidth } : {}),
    ...(contentTransparent ? {
      background: 'transparent',
      height: '100%',
      minHeight: '100%',
      justifyContent: 'center'
    } : {}),
  };

  const modalChildrenStyle: React.CSSProperties = {
    ...(contentTransparent ? { marginTop: 0 } : {})
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      className={styles.modalRoot}
    >
      <div
        className={styles.modalBackdrop}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={styles.modalContent}
        style={modalContentStyle}
      >
        {(header || header === '') && (
          <div className={styles.modalHeader}>
            <span
              className={styles.modalHeaderText}
              title={header}
            >
              {header}
            </span>
            {
              onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className={styles.modalCloseButton}
                >
                  <FaTimes />
                </button>
              )
            }
          </div>
        )}
        {!header && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className={`${styles.modalCloseButton} ${styles.modalCloseButtonAbsolute}`}
          >
            <FaTimes />
          </button>
        )}
        <div className={styles.modalChildren} style={modalChildrenStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}