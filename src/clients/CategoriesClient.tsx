"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import CategoriesList from "../components/Category/CategoriesList";
import HeaderTextOnly from "../components/Header/HeaderTextOnly";
import MainWrapper from "../components/MainWrapper/MainWrapper";
import { DTOCategory } from "podverse-helpers";

interface CategoriesClientProps {
  titleKey: string;
  linkPath: string;
}

export default function CategoriesClient(props: CategoriesClientProps) {
  const { titleKey, linkPath } = props;
  const tMedia = useTranslations("media");
  const router = useRouter();

  const onClick = (category: DTOCategory) => {
    router.push(`${linkPath}?category=${category.mapping_key}`);
  }

  return (
    <>
      <HeaderTextOnly title={tMedia(titleKey)} />
      <MainWrapper>
        <CategoriesList onCategoryClick={onClick} />
      </MainWrapper>
    </>
  );
}
