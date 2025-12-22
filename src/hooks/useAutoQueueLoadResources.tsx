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

    if (!autoQueueResources[1]) {
      newAutoQueueResources[1] = {
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
          const newShuffleHash = getShuffleHash();
          const response = await apiRequestService
            .reqItemGetManyByChannelShuffle(
              mpChannel.id_text,
              {
                page: 1,
                shuffleHash: newShuffleHash
              }
            );
          autoQueueResourcesResponse = response.data;
          setAutoQueueConfig({
            ...autoQueueConfig,
            nextPage: 2,
            shuffleHash: newShuffleHash,
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
    const startKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 1;

    autoQueueResourcesResponse.forEach((item, idx) => {
      newAutoQueueResources[startKey + idx] = item;
    });

    setAutoQueueResources(newAutoQueueResources);
  }, []);
}
