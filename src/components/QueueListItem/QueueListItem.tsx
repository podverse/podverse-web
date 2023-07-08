import OmniAural from 'omniaural'
import { NowPlayingItem, User, convertNowPlayingItemToEpisode, convertNowPlayingItemToMediaRef } from "podverse-shared"
import React from "react"
import { TemplateProps } from "react-draggable-list"
import { isNowPlayingItemMediaRef } from "~/lib/utility/typeHelpers"
import { ClipListItem } from "../ClipListItem/ClipListItem"
import { EpisodeListItem } from "../EpisodeListItem/EpisodeListItem"

export type CommonProps = {
    userInfo: User
    isEditing: boolean
}

type Props = TemplateProps<NowPlayingItem, CommonProps>

/**
 * An item template component for the `DraggableList` by `react-draggable-list`.
 * 
 * From `react-draggable-list` docs:
 * 
 *      "...must be a React component used to render the list items. This must not be a stateless-functional component..." 
 */
export class QueueListItem extends React.Component<Props, any> {

    render() {
        const {
            item: queueItem,
            dragHandleProps,
            commonProps
        } = this.props
        const { isEditing, userInfo } = commonProps

        if (isNowPlayingItemMediaRef(queueItem)) {
            /* *TODO* remove the "as any" */
            const mediaRef = convertNowPlayingItemToMediaRef(queueItem) as any
            return (
                <ClipListItem
                    episode={mediaRef.episode}
                    handleRemove={() => OmniAural.removeQueueItemMediaRef(mediaRef.id)}
                    isLoggedInUserMediaRef={userInfo && userInfo.id === mediaRef.owner.id}
                    mediaRef={mediaRef}
                    podcast={mediaRef.episode.podcast}
                    showImage
                    showRemoveButton={isEditing}
                    showMoveButton={isEditing}
                    dragHandleProps={dragHandleProps}
                />
            )
        } else {
            /* *TODO* remove the "as any" */
            const episode = convertNowPlayingItemToEpisode(queueItem) as any
            return (
                <EpisodeListItem
                    episode={episode}
                    handleRemove={() => OmniAural.removeQueueItemEpisode(episode.id)}
                    podcast={episode.podcast}
                    showPodcastInfo
                    showRemoveButton={isEditing}
                    showMoveButton={isEditing}
                    dragHandleProps={dragHandleProps}
                />
            )
        }
    }
}
