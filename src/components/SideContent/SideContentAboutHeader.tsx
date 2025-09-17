"use client";

import { useTranslations } from "next-intl";

export const SideContentAboutHeader = () => {
  const tInfo = useTranslations("info");

  return (
    <h2>{tInfo("about")}</h2>
  )
}
