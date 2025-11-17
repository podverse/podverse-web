import { useTranslations } from "next-intl";
import { MainHeader } from "../../../../components/Main/MainHeader";

export function PodcastIndexFeedHeader() {
  const tFeatures = useTranslations("features");
  return (
    <MainHeader title={tFeatures("add_feed.add_feed")} />
  )
}
