import { actionTypes } from "~/redux/constants";

export const playerQueueLoadPrimaryItems = payload => {
  return {
    type: actionTypes.PLAYER_QUEUE_LOAD_PRIMARY_ITEMS,
    payload
  }
}

export const playerQueueLoadSecondaryItems = payload => {
  return {
    type: actionTypes.PLAYER_QUEUE_LOAD_SECONDARY_ITEMS,
    payload
  }
}
