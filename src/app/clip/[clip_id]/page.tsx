import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { ClipClient } from "./ClipClient";

export type ClipPageProps = {
  params: Promise<{ clip_id: string }>;
};

export default async function ClipPage({ params }: ClipPageProps) {
  const { clip_id } = await params;
  const { apiRequestService } = await getSSRAuthService();
  const ssrClip = await apiRequestService.reqClipGet(clip_id);

  if (!ssrClip) {
    return notFound();
  }

  const ssrItem = await apiRequestService.reqItemGetByIdOrIdText(ssrClip.item.id_text);

  if (!ssrItem) {
    return notFound();
  }

  const ssrChannel = await apiRequestService.reqChannelGetByIdOrIdText(ssrItem.channel_id);

  if (!ssrChannel) {
    return notFound();
  }

  return (
    <ClipClient
      ssrChannel={ssrChannel}
      ssrItem={ssrItem}
      ssrClip={ssrClip}
    />
  );
}
