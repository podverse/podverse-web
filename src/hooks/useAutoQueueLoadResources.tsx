import { useCallback, useEffect, useRef } from "react";
import { DTOChannel, DTOClip, DTOItemQueueItem, DTOItemSoundbite, MediumEnum } from "podverse-helpers";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { AutoQueueResourcesMap, useAutoQueue } from "../contexts/AutoQueue";

export function useAutoQueueLoadResources() {  
  const { mpChannel, mpItem, mpClip, mpItemSoundbite } = useMediaPlayer();
  const { autoQueueResources, setAutoQueueResources, autoQueueConfig, setAutoQueueConfig } = useAutoQueue();

  const mpItemRef = useRef(mpItem);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);

  const mpChannelRef = useRef(mpChannel);
  useEffect(() => { mpChannelRef.current = mpChannel; }, [mpChannel]);

  const mpClipRef = useRef(mpClip);
  useEffect(() => { mpClipRef.current = mpClip; }, [mpClip]);

  const mpItemSoundbiteRef = useRef(mpItemSoundbite);
  useEffect(() => { mpItemSoundbiteRef.current = mpItemSoundbite; }, [mpItemSoundbite]);

  const autoQueueResourcesRef = useRef(autoQueueResources);
  useEffect(() => { autoQueueResourcesRef.current = autoQueueResources; }, [autoQueueResources]);

  const autoQueueConfigRef = useRef(autoQueueConfig);
  useEffect(() => { autoQueueConfigRef.current = autoQueueConfig; }, [autoQueueConfig]);

  return useCallback(async () => {
    const mpItem = mpItemRef.current;
    const mpChannel = mpChannelRef.current;
    const mpClip = mpClipRef.current;
    const mpItemSoundbite = mpItemSoundbiteRef.current;
    const autoQueueConfig = autoQueueConfigRef.current;
    
    if (!mpItem || !mpChannel) {
      setAutoQueueResources({});
      return;
    }

    const autoQueueResources = autoQueueResourcesRef.current;

    let newAutoQueueResources: AutoQueueResourcesMap = {};

    if (!autoQueueResources[0]) {
      newAutoQueueResources[0] = {
        item: mpItem,
        clip: mpClip,
        item_soundbite: mpItemSoundbite,
        channel: mpChannel
      };
    } else {
      newAutoQueueResources = { ...autoQueueResources };
    }
    
    let autoQueueResourcesResponse: any[] = [];

    if (autoQueueConfig.playlist_id_text) {
      if (autoQueueConfig.random) {
        const response = await apiRequestService
          .reqPlaylistResourceGetManyByShuffle(
            autoQueueConfig.playlist_id_text,
            autoQueueConfig.shuffleHash,
            autoQueueConfig.nextPage
          );
        autoQueueResourcesResponse = response.data;
        if (autoQueueConfig.repeat && autoQueueResourcesResponse.length === 0) {
          const response = await apiRequestService
            .reqPlaylistResourceGetManyByShuffle(
              autoQueueConfig.playlist_id_text,
              autoQueueConfig.shuffleHash,
              1
            );
          autoQueueResourcesResponse = response.data;
          setAutoQueueConfig({
            ...autoQueueConfig,
            nextPage: 2,
            shuffleHash: autoQueueConfig.shuffleHash,
          });
        } else {
          setAutoQueueConfig({
            ...autoQueueConfig,
            nextPage: autoQueueConfig.nextPage + 1,
          });
        }
      } else {
        const response = await apiRequestService
          .reqPlaylistResourceGetManyForQueueByListPosition(
            autoQueueConfig.playlist_id_text,
            { clip_id_text: mpClip?.id_text, item_soundbite_id_text: mpItemSoundbite?.id_text, item_id_text: mpItem.id_text },
            "forward"
          );
        autoQueueResourcesResponse = response.data;

        if (autoQueueConfig.repeat && autoQueueResourcesResponse.length === 0) {
          const response = await apiRequestService
            .reqPlaylistResourceGetManyByPlaylistIdText(
              autoQueueConfig.playlist_id_text,
              { page: 1 }
            );
          autoQueueResourcesResponse = response.data;
        }
      }
    } else {
      if (autoQueueConfig.random) {
        const response = await apiRequestService
          .reqItemGetManyByChannelShuffle(
            mpChannel.id_text,
            {
              page: autoQueueConfig.nextPage,
              shuffleHash: autoQueueConfig.shuffleHash,
            }
          );
        autoQueueResourcesResponse = response.data;
        if (autoQueueConfig.repeat && autoQueueResourcesResponse.length === 0) {
          const response = await apiRequestService
            .reqItemGetManyByChannelShuffle(
              mpChannel.id_text,
              {
                page: 1,
                shuffleHash: autoQueueConfig.shuffleHash,
              }
            );
          autoQueueResourcesResponse = response.data;
          setAutoQueueConfig({
            ...autoQueueConfig,
            nextPage: 1 + 1,
            shuffleHash: autoQueueConfig.shuffleHash,
          });
        } else {
          setAutoQueueConfig({
            ...autoQueueConfig,
            nextPage: autoQueueConfig.nextPage + 1,
          })
        }
      } else if (mpChannel?.medium_id === MediumEnum.Music) {
        autoQueueResourcesResponse = await apiRequestService
          .reqItemGetManyForQueueBySeason(mpItem.id_text, "forward");
        if (autoQueueConfig.repeat && autoQueueResourcesResponse.length === 0) {
          const response = await apiRequestService
            .reqItemGetManyByChannelBySeason({
              idOrIdText: mpChannel.id_text,
              page: 1,
              sort: "forward",
              range: null
            });
          autoQueueResourcesResponse = response.data;
        }
      } else {
        autoQueueResourcesResponse = await apiRequestService
          .reqItemGetManyForQueueByPubDate(mpItem.id_text, "forward");
        if (autoQueueConfig.repeat && autoQueueResourcesResponse.length === 0) {
          const response = await apiRequestService
            .reqItemGetManyByChannel({
              idOrIdText: mpChannel.id_text,
              page: 1,
              sort: "recent",
              range: null
            });
          autoQueueResourcesResponse = response.data;
        }
      }
    }

    const existingKeys = Object.keys(newAutoQueueResources).map(Number);
    const startKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;

    if (autoQueueConfig.playlist_id_text) {
      autoQueueResourcesResponse.forEach((playlistResource, idx) => {
        if (playlistResource.clip) {
          newAutoQueueResources[startKey + idx] = {
            item: playlistResource.clip.item,
            clip: playlistResource.clip,
            item_soundbite: null,
            channel: playlistResource.clip.item.channel
          };
        } else if (playlistResource.item_soundbite) {
          newAutoQueueResources[startKey + idx] = {
            item: playlistResource.item_soundbite.item,
            clip: null,
            item_soundbite: playlistResource.item_soundbite,
            channel: playlistResource.item_soundbite.item.channel
          };
        } else {
          newAutoQueueResources[startKey + idx] = {
            item: playlistResource.item,
            clip: null,
            item_soundbite: null,
            channel: playlistResource.item.channel
          };
        }
      });
    } else {
      autoQueueResourcesResponse.forEach((item, idx) => {
        newAutoQueueResources[startKey + idx] = {
          item: item,
          clip: null,
          item_soundbite: null,
          channel: item.channel
        };
      });
    }

    // If random is enabled, remove duplicate id_text items, keeping the first occurrence
    if (autoQueueConfig.random) {
      const seenClipIds = new Set<string>();
      const seenSoundbiteIds = new Set<string>();
      const seenItemIds = new Set<string>();
      const dedupedResources: {
        [key: number]: {
          item: DTOItemQueueItem;
          clip: DTOClip | null;
          item_soundbite: DTOItemSoundbite | null;
          channel: DTOChannel | null;
        }
      } = {};
      let newKey = 0;
      for (const key of Object.keys(newAutoQueueResources).map(Number).sort((a, b) => a - b)) {
        const row = newAutoQueueResources[key];
        let shouldSkip = false;
        if (row.clip) {
          if (seenClipIds.has(row.clip.id_text)) {
            shouldSkip = true;
          } else {
            seenClipIds.add(row.clip.id_text);
          }
        } else if (row.item_soundbite) {
          if (seenSoundbiteIds.has(row.item_soundbite.id_text)) {
            shouldSkip = true;
          } else {
            seenSoundbiteIds.add(row.item_soundbite.id_text);
          }
        } else {
          if (seenItemIds.has(row.item.id_text)) {
            shouldSkip = true;
          } else {
            seenItemIds.add(row.item.id_text);
          }
        }
        if (!shouldSkip) {
          dedupedResources[newKey] = row;
          newKey++;
        }
      }
      newAutoQueueResources = dedupedResources;
    }

    setAutoQueueResources(newAutoQueueResources);
  }, []);
}
