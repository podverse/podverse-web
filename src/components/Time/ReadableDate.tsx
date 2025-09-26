"use client";

import React from "react";
import { formatDateAbbrev } from "podverse-helpers";
import { useLocale, useTranslations } from "next-intl";

type ReadableDateProps = {
  date?: string | null;
};

export const ReadableDate: React.FC<ReadableDateProps> = ({ date }) => {
  const locale = useLocale();
  const tMisc = useTranslations("misc");
  const readableDate = date ? formatDateAbbrev(date, locale) : tMisc("unknown_date");

  return readableDate;
}
