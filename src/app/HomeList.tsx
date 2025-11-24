"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ListCombinedChannels } from "../components/List/ListCombinedChannels/ListCombinedChannels";
import LoadingSpinnerOverlay from "../components/LoadingSpinner/LoadingSpinnerOverlay";
import { InfoWrapper } from "../components/InfoWrapper/InfoWrapper";
import { useHomeContext } from "./HomeContext";
import { useAccount } from "../contexts/Account";
import Link from "../components/Link/Link";
import { ROUTES } from "../constants/routes";
import { useLocalSettings } from "../contexts/LocalSettings";

export const HomeList: React.FC = () => {
  const { filterParams, setFilterParams, channels, totalPages, isLoading } = useHomeContext();
  const { loggedInAccount } = useAccount();
  const { viewSelected } = useLocalSettings();
  const tSubscriptions = useTranslations("subscriptions");
  const { page = 1, medium = "all" } = filterParams;

  return (
    <>
      {
        (!loggedInAccount || (channels.length === 0 && totalPages === 1)) && (
          <InfoWrapper>
            <p>
              {tSubscriptions.rich("how_to_start_message", {
                searchLink: (chunks) => <Link href={ROUTES.SEARCH}>{chunks}</Link>,
                podcastsLink: (chunks) => <Link href={ROUTES.PODCASTS}>{chunks}</Link>,
                videosLink: (chunks) => <Link href={ROUTES.VIDEOS}>{chunks}</Link>,
                musicLink: (chunks) => <Link href={ROUTES.ARTISTS}>{chunks}</Link>
              })}
            </p>
          </InfoWrapper>
        )
      }
      {
        (loggedInAccount && channels.length !== 0) && (
          <ListCombinedChannels
            page={page}
            setPage={(page) => setFilterParams({ ...filterParams, page })}
            channels={channels}
            totalPages={totalPages}
            medium={medium}
            viewSelected={viewSelected}
          />
        )
      }
      <LoadingSpinnerOverlay isLoading={isLoading} />
    </>
  );
};
