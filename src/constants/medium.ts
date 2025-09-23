import { MediumEnum } from "podverse-helpers";

export const MEDIUM = {
  menuItems: (tMedia: any) => [
    { label: tMedia("podcast.podcast"), param: "medium", value: `${MediumEnum.Podcast}` },
    { label: tMedia("video.video"), param: "medium", value: `${MediumEnum.Video}` },
    { label: tMedia("music.music"), param: "medium", value: `${MediumEnum.Music}` },
    { label: tMedia("mixed"), param: "medium", value: `${MediumEnum.Mixed}` },
  ],
  buttonTabs: (mediumId: number, tMedia: any, setMediumId: (id: number) => void) => {
    if (mediumId === MediumEnum.Video) {
      return [
        {
          key: MediumEnum.Video,
          label: tMedia("video.videos"),
          onClick: () => setMediumId(MediumEnum.Video)
        },
        {
          key: MediumEnum.Mixed,
          label: tMedia("mixed"),
          onClick: () => setMediumId(MediumEnum.Mixed)
        },
      ];
    } else if (mediumId === MediumEnum.Music) {
      return [
        {
          key: MediumEnum.Music,
          label: tMedia("music.music"),
          onClick: () => setMediumId(MediumEnum.Music)
        },
        {
          key: MediumEnum.Mixed,
          label: tMedia("mixed"),
          onClick: () => setMediumId(MediumEnum.Mixed)
        },
      ];
    } else {
      return [
        {
          key: MediumEnum.Podcast,
          label: tMedia("podcast.podcasts"),
          onClick: () => setMediumId(MediumEnum.Podcast)
        },
        {
          key: MediumEnum.Mixed,
          label: tMedia("mixed"),
          onClick: () => setMediumId(MediumEnum.Mixed)
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
    } else if (mediumId === MediumEnum.Mixed) {
      return tMedia("mixed");
    } else {
      return "";
    }
  }
};
