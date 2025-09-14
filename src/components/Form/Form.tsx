import React from "react";

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const Form: React.FC<FormProps> = ({ onSubmit, children, className = "", style }) => (
  <form onSubmit={onSubmit} className={className} style={style}>
    {children}
  </form>
);

export default Form;