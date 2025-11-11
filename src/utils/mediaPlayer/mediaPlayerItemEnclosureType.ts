import { DTOItem, getMediaTypeFromSource } from "podverse-helpers";

export const checkIfIsAudioFile = (selectedItemEnclosureUrl: string): boolean => {
  return !!selectedItemEnclosureUrl && getMediaTypeFromSource(selectedItemEnclosureUrl) === "audio";
}

export const checkIfIsVideoFile = (selectedItemEnclosureUrl: string): boolean => {
  return !!selectedItemEnclosureUrl && getMediaTypeFromSource(selectedItemEnclosureUrl) === "video";
}

export const checkIsLiveItem = (mpItem: DTOItem | null): boolean => {
  return !!mpItem?.live_item;
}
