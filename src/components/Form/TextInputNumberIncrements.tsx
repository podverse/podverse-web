"use client";

import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import styles from '../../styles/components/Form/TextInputNumberIncrements.module.scss'
import { useTranslations } from 'next-intl';

type NumberStepperProps = {
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  step?: number
  disabled: boolean
  readOnly: boolean
}

export const TextInputNumberIncrement: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  readOnly
}) => {
  const tMisc = useTranslations('misc');

  const handleStep = (direction: 1 | -1) => {
    if (!onChange) return
    let current = value === '' ? 0 : Number(value)
    let next = current + (step || 1) * direction
    if (typeof min === 'number') next = Math.max(next, min)
    if (typeof max === 'number') next = Math.min(next, max)
    
    const event = {
      ...({} as React.ChangeEvent<HTMLInputElement>),
      target: {
        value: String(next)
      }
    }
    onChange(event as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <button
          type="button"
          aria-label={tMisc('increment')}
          onClick={() => handleStep(1)}
          tabIndex={-1}
          disabled={disabled || readOnly}
          className={styles.incrementButton}
        >
          <FaChevronUp />
        </button>
        <button
          type="button"
          aria-label={tMisc('decrement')}
          onClick={() => handleStep(-1)}
          tabIndex={-1}
          disabled={disabled || readOnly}
          className={styles.decrementButton}
        >
          <FaChevronDown />
        </button>
      </div>
    </>
  )
}