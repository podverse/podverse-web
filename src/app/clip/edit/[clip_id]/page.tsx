import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../../utils/auth/ssrAuth";
import { ClipEditClient } from "./ClipEditClient";

type ClipEditPageProps = {
  params: Promise<{ clip_id: string }>;
}

export default async function ClipEditPage({ params }: ClipEditPageProps) {
  const { clip_id } = await params;
  const { apiRequestService } = await getSSRAuthService();
  
  let ssrClip;
  try {
    ssrClip = await apiRequestService.reqClipGet(clip_id);
    if (!ssrClip) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

  return (
    <ClipEditClient ssrClip={ssrClip} />
  );
}
