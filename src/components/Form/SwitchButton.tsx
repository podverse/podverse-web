import { useTranslations } from 'next-intl'
import React from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { PopoverIcon } from '../PopoverIcon/PopoverIcon'
import styles from '../../styles/components/Form/SwitchButton.module.scss'

type SwitchButtonProps = {
  id?: string
  label: string
  checked: boolean
  onChange: (next: boolean) => void
  loading?: boolean
  className?: string
  helpText?: string
  'aria-describedby'?: string
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  id,
  label,
  checked,
  onChange,
  loading,
  className,
  helpText,
  'aria-describedby': ariaDescribedBy
}) => {
  const handleToggle = () => {
    if (loading) return;
    onChange(!checked);
  };
  const tMisc = useTranslations('misc');

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <div className={styles.headerRow}>
        <div className={styles.labelWrapper}>
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          {helpText && (
            <PopoverIcon text={helpText} ariaLabel={`Help for ${label}`} />
          )}
        </div>
      </div>

      <div className={styles.controlRow}>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={ariaDescribedBy}
          className={`${styles.switch} ${checked ? styles.on : styles.off} ${loading ? styles.disabled : ''}`}
          onClick={handleToggle}
          disabled={loading}
          aria-disabled={loading}
        >
          <span className={styles.track} />
          <span className={styles.thumb} />
        </button>

        <div className={styles.stateLabel} aria-hidden>
          {checked ? tMisc('on') : tMisc('off')}
        </div>

        {loading && (
          <div className={styles.loadingWrapper} aria-hidden>
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
    </div>
  )
}
