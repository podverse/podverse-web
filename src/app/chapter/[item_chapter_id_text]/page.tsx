import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { ChapterClient } from "./ChapterClient";

export type ChapterPageProps = {
  params: Promise<{ item_chapter_id_text: string }>;
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { item_chapter_id_text } = await params;
  const { apiRequestService } = await getSSRAuthService();
  
  const ssrItemChapter = await apiRequestService.reqItemChapterGetByIdText(item_chapter_id_text);

  if (!ssrItemChapter.item_chapters_feed?.item) {
    return notFound();
  }

  const ssrItem = await apiRequestService.reqItemGetByIdOrIdText(ssrItemChapter.item_chapters_feed.item.id_text);

  if (!ssrItem) {
    return notFound();
  }

  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  if (!ssrChannel) {
    return notFound();
  }

  return (
    <ChapterClient
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrItemChapter={ssrItemChapter}
    />
  );
}
