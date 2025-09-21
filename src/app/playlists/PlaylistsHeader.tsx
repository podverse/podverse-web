"use client";

import { useTranslations } from "next-intl";
import React from "react";
import MainHeaderTextOnly from "../../components/Main/MainHeaderTextOnly";

export const PlaylistsHeader: React.FC = () => {
  const tFeatures = useTranslations("features");

  return (
    <MainHeaderTextOnly title={tFeatures("playlists")} />
  );
};
