import { getSSRAuthService } from "../../../utils/auth/ssrAuth";
import { PlaylistClient } from "./PlaylistClient";

export type PlaylistPageProps = {
  params: Promise<{ playlist_id: string }>;
};

export default async function Playlist({ params }: PlaylistPageProps) {
  const { playlist_id } = await params;

  const { apiRequestService } = await getSSRAuthService();

  const ssrPlaylist = await apiRequestService.reqPlaylistGet(playlist_id);

  return (
    <PlaylistClient ssrPlaylist={ssrPlaylist} />
  );
}
