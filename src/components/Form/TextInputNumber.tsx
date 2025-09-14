import React from 'react';
import { TextInput } from './TextInput';

type TextInputNumberProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  eyebrow?: string;
};

const TextInputNumber: React.FC<TextInputNumberProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  eyebrow,
  ...rest
}) => {
  // Only allow numbers and empty string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      onChange(e);
    }
  };

  return (
    <TextInput
      type="number"
      value={value.toString()}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      eyebrow={eyebrow}
      {...rest}
      style={{ MozAppearance: 'textfield' }}
      onWheel={e => (e.target as HTMLInputElement).blur()} // Prevent scroll changing value
    />
  );
};

export default TextInputNumber;