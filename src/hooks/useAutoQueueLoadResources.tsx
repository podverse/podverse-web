import { useCallback, useEffect, useRef } from "react";
import { DTOItemQueueItem, getShuffleHash, MediumEnum } from "podverse-helpers";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useAutoQueue } from "../contexts/AutoQueue";

export function useAutoQueueLoadResources() {  
  const { mpChannel, mpItem } = useMediaPlayer();
  const { autoQueueResources, setAutoQueueResources, autoQueueConfig, setAutoQueueConfig } = useAutoQueue();

  const mpItemRef = useRef(mpItem);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);

  const mpChannelRef = useRef(mpChannel);
  useEffect(() => { mpChannelRef.current = mpChannel; }, [mpChannel]);

  const autoQueueResourcesRef = useRef(autoQueueResources);
  useEffect(() => { autoQueueResourcesRef.current = autoQueueResources; }, [autoQueueResources]);

  const autoQueueConfigRef = useRef(autoQueueConfig);
  useEffect(() => { autoQueueConfigRef.current = autoQueueConfig; }, [autoQueueConfig]);

  return useCallback(async () => {
    const mpItem = mpItemRef.current;
    const mpChannel = mpChannelRef.current;
    const autoQueueConfig = autoQueueConfigRef.current;
    
    if (!mpItem || !mpChannel) {
      setAutoQueueResources({});
      return;
    }

    const autoQueueResources = autoQueueResourcesRef.current;

    let newAutoQueueResources: {
      [key: number]: DTOItemQueueItem;
    } = {};

    if (!autoQueueResources[0]) {
      newAutoQueueResources[0] = {
        ...mpItem,
        channel: mpChannel
      };
    } else {
      newAutoQueueResources = { ...autoQueueResources };
    }
    
    let autoQueueResourcesResponse: any[] = [];

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
      if (autoQueueResourcesResponse.length === 0) {
        if (autoQueueConfig.repeat) {
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
        }
      } else {
        setAutoQueueConfig({
          ...autoQueueConfig,
          nextPage: autoQueueConfig.nextPage + 1,
        })
      }
    } else if (mpChannel?.medium_id === MediumEnum.Music) {
      autoQueueResourcesResponse = await apiRequestService
        .reqItemGetManyForQueueBySeason(mpItem.id_text, "forward");
      if (autoQueueResourcesResponse.length === 0) {
        if (autoQueueConfig.repeat) {
          const response = await apiRequestService
            .reqItemGetManyByChannelBySeason({
              idOrIdText: mpChannel.id_text,
              page: 1,
              sort: "forward",
              range: null
            });
          autoQueueResourcesResponse = response.data;
        }
      }
    } else {
      autoQueueResourcesResponse = await apiRequestService
        .reqItemGetManyForQueueByPubDate(mpItem.id_text, "forward");
      if (autoQueueResourcesResponse.length === 0) {
        if (autoQueueConfig.repeat) {
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

    autoQueueResourcesResponse.forEach((item, idx) => {
      newAutoQueueResources[startKey + idx] = item;
    });

    // If random is enabled, remove duplicate id_text items, keeping the first occurrence
    if (autoQueueConfig.random) {
      const seenIdTexts = new Set<string>();
      const dedupedResources: { [key: number]: DTOItemQueueItem } = {};
      let newKey = 0;
      for (const key of Object.keys(newAutoQueueResources).map(Number).sort((a, b) => a - b)) {
        const item = newAutoQueueResources[key];
        if (!seenIdTexts.has(item.id_text)) {
          seenIdTexts.add(item.id_text);
          dedupedResources[newKey] = item;
          newKey++;
        }
        // If duplicate, skip (removes later occurrence)
      }
      newAutoQueueResources = dedupedResources;
    }

    setAutoQueueResources(newAutoQueueResources);
  }, []);
}
