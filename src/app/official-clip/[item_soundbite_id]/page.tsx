import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { OfficialClipClient } from "./OfficialClipClient";

export type OfficialClipPageProps = {
  params: Promise<{ item_soundbite_id: string }>;
};

export default async function OfficialClipPage({ params }: OfficialClipPageProps) {
  const { item_soundbite_id } = await params;
  const { ssrApiRequestService } = await getSSRAuthService();
  const ssrItemSoundbite = await ssrApiRequestService.reqItemSoundbiteGet(item_soundbite_id);

  if (!ssrItemSoundbite.item) {
    return notFound();
  }

  const ssrItem = await ssrApiRequestService.reqItemGetByIdOrIdText(ssrItemSoundbite.item.id_text);

  if (!ssrItem) {
    return notFound();
  }

  const ssrChannel = await ssrApiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  if (!ssrChannel) {
    return notFound();
  }

  return (
    <OfficialClipClient
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrItemSoundbite={ssrItemSoundbite}
    />
  );
}
