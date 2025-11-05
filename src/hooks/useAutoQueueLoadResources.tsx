import { useCallback, useEffect, useRef } from "react";
import { apiRequestService } from "../factories/apiRequestService";
import { useMediaPlayer } from "../contexts/MediaPlayer";
import { useAutoQueue } from "../contexts/AutoQueue";

export function useAutoQueueLoadResources() {  
  const { mpItem } = useMediaPlayer();
  const { autoQueueResources, setAutoQueueResources } = useAutoQueue();

  const mpItemRef = useRef(mpItem);
  useEffect(() => { mpItemRef.current = mpItem; }, [mpItem]);

  const autoQueueResourcesRef = useRef(autoQueueResources);
  useEffect(() => { autoQueueResourcesRef.current = autoQueueResources; }, [autoQueueResources]);

  return useCallback(async () => {
    const mpItem = mpItemRef.current;
    
    if (!mpItem) {
      setAutoQueueResources({});
      return;
    }

    const autoQueueResources = autoQueueResourcesRef.current;

    const newAutoQueueResources = { ...autoQueueResources };

    const autoQueueResourcesResponse = await apiRequestService
      .reqItemGetManyForQueueByPubDate(mpItem.id_text, "forward");

    const existingKeys = Object.keys(newAutoQueueResources).map(Number);
    const startKey = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 1;

    autoQueueResourcesResponse.forEach((item, idx) => {
      newAutoQueueResources[startKey + idx] = item;
    });

    setAutoQueueResources(newAutoQueueResources);
  }, []);
}
