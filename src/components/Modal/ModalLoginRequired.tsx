"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { CallToActionMessage } from "../CallToActionMessage/CallToActionMessage";

export const ModalLoginRequired: React.FC = () => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const header = tInstructions("login_required");
  const {
    modalLoginRequired, setModalLoginRequired,
    setModalLogin
  } = useModals();

  const clearModalLoginRequired = () => {
    setModalLoginRequired({
      title: null,
      message: null
    });
  }

  const showLoginOnClick = () => {
    clearModalLoginRequired();
    setModalLogin({ isOpen: true });
  }
  
  return (
    <Modal
      isOpen={!!modalLoginRequired.message}
      onClose={clearModalLoginRequired}
      header={header}
      ariaLabel={header}
      modalContentMaxWidth={500}>
      <CallToActionMessage
        message={tInstructions("login_to_add_feeds")}
        buttonLabel={tAuthentication("login")}
        onButtonClick={showLoginOnClick}
      />
    </Modal>
  );
};
