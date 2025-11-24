"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { DTOCategory } from "podverse-helpers";
import { Modal } from "./Modal";
import { CategoriesList } from "../Category/CategoriesList";

type ModalCategoriesSelectProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategoryClick: (category: DTOCategory) => void;
};

export const ModalCategoriesSelect: React.FC<ModalCategoriesSelectProps> = ({
  isOpen, setIsOpen, onCategoryClick }) => {
  const tCategories = useTranslations("categories");

  const clearModalCategoriesSelect = () => {
    setIsOpen(false);
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={clearModalCategoriesSelect}
      header={tCategories("categories")}
      ariaLabel={tCategories("categories")}
      modalContentMaxWidth={500}>
      <CategoriesList onCategoryClick={onCategoryClick} />
    </Modal>
  );
};
