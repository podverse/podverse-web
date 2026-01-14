import React from 'react';
import styles from '../../styles/components/Form/Checkbox.module.scss';

type CheckboxProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  className,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`${styles.checkbox} ${className || ''}`}>
      <label htmlFor={id} className={styles.option}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={handleCheckboxChange}
          className={styles.checkboxInput}
        />
        <span className={styles.label}>{label}</span>
      </label>
    </div>
  );
};
