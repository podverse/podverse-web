import React, { ReactNode } from 'react'
import { FaTimes } from 'react-icons/fa'
import styles from '../../styles/components/Modal/Modal.module.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  ariaLabel: string
  children: ReactNode
  header?: string
  modalContentMaxWidth?: number
}

export const Modal = ({
  isOpen,
  onClose,
  ariaLabel,
  children,
  header,
  modalContentMaxWidth
}: ModalProps) => {
  if (!isOpen) return null

  const modalContentStyle = modalContentMaxWidth
    ? { maxWidth: modalContentMaxWidth }
    : undefined

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
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}
            >
              {header}
            </span>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={styles.modalCloseButton}
            >
              <FaTimes />
            </button>
          </div>
        )}
        {!header && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className={styles.modalCloseButton}
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            <FaTimes />
          </button>
        )}
        <div className={styles.modalChildren}>
          {children}
        </div>
      </div>
    </div>
  )
}