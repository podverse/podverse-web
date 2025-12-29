import { notFound } from "next/navigation";
import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { PlaylistClient } from "./PlaylistClient";

export type PlaylistPageProps = {
  params: Promise<{ playlist_id: string }>;
};

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { playlist_id } = await params;
  const { ssrApiRequestService } = await getSSRAuthService();
  
  let ssrPlaylist;
  try {
    ssrPlaylist = await ssrApiRequestService.reqPlaylistGet(playlist_id);
    if (!ssrPlaylist) {
      return notFound();
    }
  } catch (err) {
    return notFound();
  }

  return (
    <PlaylistClient ssrPlaylist={ssrPlaylist} />
  );
}
