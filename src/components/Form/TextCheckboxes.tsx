import React from 'react';
import styles from '../../styles/components/Form/TextCheckboxes.module.scss';

type Option = {
  label: string;
  value: string;
};

type TextCheckboxesProps = {
  eyebrow?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
  name: string;
};

export const TextCheckboxes: React.FC<TextCheckboxesProps> = ({
  eyebrow,
  options,
  selectedValues,
  onChange,
  className,
  name,
}) => {
  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <div className={`${styles.textCheckboxes} ${className || ''}`}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      <div className={styles.optionsWrapper}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className={styles.checkbox}
            />
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
