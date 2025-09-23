import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../../utils/auth/ssrAuth";
import { PlaylistEditClient } from "./PlaylistEditClient";

type PlaylistEditPageProps = {
  params: Promise<{ playlist_id: string }>;
}

export default async function PlaylistEditPage({ params }: PlaylistEditPageProps) {
  const { playlist_id } = await params;
  const { apiRequestService } = await getSSRAuthService();
  
  let ssrPlaylist;
  try {
    ssrPlaylist = await apiRequestService.reqPlaylistGet(playlist_id);
    if (!ssrPlaylist) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

  return (
    <PlaylistEditClient ssrPlaylist={ssrPlaylist} />
  );
}
