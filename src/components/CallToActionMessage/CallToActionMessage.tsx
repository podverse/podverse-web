import React from "react";
import styles from "../../styles/components/CallToActionMessage/CallToActionMessage.module.scss";

type CallToActionMessageProps = {
  message: React.ReactNode;
  buttonLabel: React.ReactNode;
  onButtonClick: () => void;
};

export const CallToActionMessage: React.FC<CallToActionMessageProps> = ({
  message,
  buttonLabel,
  onButtonClick
}) => (
  <div className={styles.message}>
    <p>{message}</p>
    <button
      onClick={onButtonClick}
      type="button">
      {buttonLabel}
    </button>
  </div>
);
