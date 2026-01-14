import React from 'react';
import styles from '../../styles/components/Form/RadioButton.module.scss';

type Option = {
  label: string;
  value: string;
};

type RadioButtonProps = {
  eyebrow?: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  name: string;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  eyebrow,
  options,
  selectedValue,
  onChange,
  className,
  name,
}) => {
  const handleRadioChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={`${styles.radioButton} ${className || ''}`}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      <div className={styles.optionsWrapper}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleRadioChange(option.value)}
              className={styles.radio}
            />
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
