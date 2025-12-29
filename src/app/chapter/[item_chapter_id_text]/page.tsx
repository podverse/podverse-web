import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { ChapterClient } from "./ChapterClient";

export type ChapterPageProps = {
  params: Promise<{ item_chapter_id_text: string }>;
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { item_chapter_id_text } = await params;
  const { ssrApiRequestService } = await getSSRAuthService();
  
  const ssrItemChapter = await ssrApiRequestService.reqItemChapterGetByIdText(item_chapter_id_text);

  if (!ssrItemChapter.item_chapters_feed?.item) {
    return notFound();
  }

  const ssrItem = await ssrApiRequestService.reqItemGetByIdOrIdText(ssrItemChapter.item_chapters_feed.item.id_text);

  if (!ssrItem) {
    return notFound();
  }

  const ssrChannel = await ssrApiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

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
