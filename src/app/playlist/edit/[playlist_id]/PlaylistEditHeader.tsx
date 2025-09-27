"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { MainHeader } from "../../../../components/Main/MainHeader";

export const PlaylistEditHeader: React.FC = () => {
  const tFeatures = useTranslations("features");

  return (
    <MainHeader title={tFeatures("playlist.edit_playlist")} />
  );
};
