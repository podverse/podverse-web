import { useCallback, useEffect, useRef } from "react";
import { MediumEnum } from "podverse-helpers";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useAutoQueue } from "../contexts/AutoQueue";

export function useAutoQueueLoadResources() {  
  const { mpChannel, mpItem } = useMediaPlayer();
  const { autoQueueResources, setAutoQueueResources } = useAutoQueue();

  const mpItemRef = useRef(mpItem);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);

  const mpChannelRef = useRef(mpChannel);
  useEffect(() => { mpChannelRef.current = mpChannel; }, [mpChannel]);

  const autoQueueResourcesRef = useRef(autoQueueResources);
  useEffect(() => { autoQueueResourcesRef.current = autoQueueResources; }, [autoQueueResources]);

  return useCallback(async () => {
    const mpItem = mpItemRef.current;
    const mpChannel = mpChannelRef.current;
    
    if (!mpItem) {
      setAutoQueueResources({});
      return;
    }

    const autoQueueResources = autoQueueResourcesRef.current;

    const newAutoQueueResources = { ...autoQueueResources };

    const autoQueueResourcesResponse = mpChannel?.medium_id === MediumEnum.Music
      ? await apiRequestService.reqItemGetManyForQueueBySeason(mpItem.id_text, "forward")
      : await apiRequestService.reqItemGetManyForQueueByPubDate(mpItem.id_text, "forward");

    const existingKeys = Object.keys(newAutoQueueResources).map(Number);
    const startKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 1;

    autoQueueResourcesResponse.forEach((item, idx) => {
      newAutoQueueResources[startKey + idx] = item;
    });

    setAutoQueueResources(newAutoQueueResources);
  }, []);
}
