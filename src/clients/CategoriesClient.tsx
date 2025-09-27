"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { DTOCategory } from "podverse-helpers";
import React from "react";
import CategoriesList from "../components/Category/CategoriesList";
import { MainHeader } from "../components/Main/MainHeader";
import { MainWrapper } from "../components/Main/MainWrapper";

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
      <MainHeader title={tMedia(titleKey)} />
      <MainWrapper>
        <CategoriesList onCategoryClick={onClick} />
      </MainWrapper>
    </>
  );
}
