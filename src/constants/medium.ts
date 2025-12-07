import { MediumEnum } from "podverse-helpers";

export const MEDIUM = {
  menuItems: (tMedia: any) => [
    { label: tMedia("podcast.podcasts"), param: "medium", value: `${MediumEnum.AV}` },
    { label: tMedia("music.music"), param: "medium", value: `${MediumEnum.Music}` }
  ],
  buttonTabs: (mediumId: number, tMedia: any, onClick: (id: number) => void) => {
    if (mediumId === MediumEnum.Music) {
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
          key: MediumEnum.AV,
          label: tMedia("podcast.podcasts"),
          onClick: () => onClick(MediumEnum.AV)
        }
      ];
    }
  },
  getMediumTranslation: (mediumId: number, tMedia: any) => {
    if (mediumId === MediumEnum.AV) {
      return tMedia("podcast.podcasts");
    } else if (mediumId === MediumEnum.Podcast) {
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
