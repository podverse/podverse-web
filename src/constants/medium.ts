import { MediumEnum } from "podverse-helpers";

export const MEDIUM = {
  menuItems: (tMedia: any) => [
    { label: tMedia("podcast.podcast"), param: "medium", value: `${MediumEnum.Podcast}` },
    { label: tMedia("video.video"), param: "medium", value: `${MediumEnum.Video}` },
    { label: tMedia("music.music"), param: "medium", value: `${MediumEnum.Music}` }
  ],
  buttonTabs: (mediumId: number, tMedia: any, onClick: (id: number) => void) => {
    if (mediumId === MediumEnum.Video) {
      return [
        {
          key: MediumEnum.Video,
          label: tMedia("video.videos"),
          onClick: () => onClick(MediumEnum.Video)
        }
      ];
    } else if (mediumId === MediumEnum.Music) {
      return [
        {
          key: MediumEnum.Music,
          label: tMedia("music.music"),
          onClick: () => onClick(MediumEnum.Music)
        }
      ];
    } else {
      return [
        {
          key: MediumEnum.Podcast,
          label: tMedia("podcast.podcasts"),
          onClick: () => onClick(MediumEnum.Podcast)
        }
      ];
    }
  },
  getMediumTranslation: (mediumId: number, tMedia: any) => {
    if (mediumId === MediumEnum.Podcast) {
      return tMedia("podcast.podcasts");
    } else if (mediumId === MediumEnum.Video) {
      return tMedia("video.videos");
    } else if (mediumId === MediumEnum.Music) {
      return tMedia("music.music");
    } else {
      return "";
    }
  }
};
