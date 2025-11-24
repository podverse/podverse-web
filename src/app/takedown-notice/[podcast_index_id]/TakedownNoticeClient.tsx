"use client";
import React, { useEffect, useMemo } from "react";
import { MainHeader } from "../../../components/Main/MainHeader";
import { MainWrapper } from "../../../components/Main/MainWrapper";
import { useTranslations } from "next-intl";
import { DTOFeed } from "podverse-helpers";
import { useRouter } from "next/navigation";
import { MainInnerWrapper } from "../../../components/Main/MainInnerWrapper";
import { SideContent } from "../../../components/SideContent/SideContent";
import { MainInnerContentWrapper } from "../../../components/Main/MainInnerContentWrapper";

type TakedownNoticeClientProps = {
  ssrFeed: DTOFeed | null;
};

export function TakedownNoticeClient({ ssrFeed }: TakedownNoticeClientProps) {
  const tLegal = useTranslations("legal");
  const router = useRouter();

  const status = ssrFeed?.feed_flag_status?.id;

  const { policyKey, explanationKey } = useMemo(() => {
    switch (status) {
      case 3: // Spam
        return { policyKey: "spam_policy", explanationKey: "spam_policy_explanation" };
      case 4: // PendingArchive
      case 5: // Archived
        return { policyKey: "archive_policy", explanationKey: "archive_policy_explanation" };
      case 6: // Takedown
        return { policyKey: "takedown_policy", explanationKey: "takedown_policy_explanation" };
      default:
        return { policyKey: "takedown_policy", explanationKey: "takedown_policy_explanation" }; // Fallback
    }
  }, [status]);

  useEffect(() => {
    if (!ssrFeed || status === 1 || status === 2) {
      if (ssrFeed?.podcast_index_id) {
        router.replace(`/podcast-index/feed/${ssrFeed.podcast_index_id}`);
      } else {
        router.replace("/");
      }
    }
  }, [ssrFeed, status, router]);

  if (!ssrFeed || status === 1 || status === 2) {
    return null;
  }

  return (
    <>
      <MainHeader title={tLegal("takedown_notice")} />
      <MainWrapper>
        <MainInnerWrapper>
          <SideContent />
          <MainInnerContentWrapper>
            <h3 style={{ marginBottom: "1rem" }}>{tLegal(policyKey)}</h3>
            <p>{tLegal(explanationKey)}</p>
          </MainInnerContentWrapper>
        </MainInnerWrapper>
      </MainWrapper>
    </>
  );
}
