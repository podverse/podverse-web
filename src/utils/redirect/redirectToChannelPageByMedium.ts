import { redirect } from "next/navigation";
import { MediumEnum } from "podverse-helpers";
import { ROUTES } from "../../constants/routes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getChannelPathByMedium = (medium_id: number, channel_id_text: string) => {
  if (medium_id === MediumEnum.Podcast || medium_id === MediumEnum.Video) return `${ROUTES.PODCAST}/${channel_id_text}`;
  if (medium_id === MediumEnum.Music) return `${ROUTES.ALBUM}/${channel_id_text}`;
  if (medium_id === MediumEnum.PublisherMusic) return `${ROUTES.ARTIST}/${channel_id_text}`;
  return null;
};

export const redirectToChannelPageByMediumServer = (medium_id: number, channel_id_text: string) => {
  const path = getChannelPathByMedium(medium_id, channel_id_text);
  if (path) redirect(path);
};

export const redirectToChannelPageByMediumClient = (router: AppRouterInstance) => {
  return (medium_id: number, channel_id_text: string) => {
    const path = getChannelPathByMedium(medium_id, channel_id_text);
    if (path) router.push(path);
  };
};
