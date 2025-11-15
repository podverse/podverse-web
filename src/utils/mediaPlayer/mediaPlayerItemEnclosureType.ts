import { DTOItem, SelectedLabeledItemEnclosureAndSource } from "podverse-helpers";

export const checkIfIsAudioFile = (selectedItemEnclosureAndSource: SelectedLabeledItemEnclosureAndSource): boolean => {
  return selectedItemEnclosureAndSource.labeledItemEnclosure?.mediaType === "audio";
}

export const checkIfIsVideoFile = (selectedItemEnclosureAndSource: SelectedLabeledItemEnclosureAndSource): boolean => {
  return selectedItemEnclosureAndSource.labeledItemEnclosure?.mediaType === "video";
}

export const checkIsLiveItem = (mpItem: DTOItem | null): boolean => {
  return !!mpItem?.live_item;
}
