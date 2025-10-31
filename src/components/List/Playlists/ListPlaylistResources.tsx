"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DTOPlaylist, DTOPlaylistResource } from "podverse-helpers";
import React from "react";
import { ListPlaylistResourceRow } from "./ListPlaylistResourceRow";
import { apiRequestService } from "../../../factories/apiRequestService";
import LoadingSpinnerOverlay from "../../LoadingSpinner/LoadingSpinnerOverlay";
import Pagination from "../../Pagination/Pagination";
import styles from "../../../styles/components/List/Playlists/ListPlaylistResources.module.scss";
import { useSkipInitialEffect } from "../../../hooks/useSkipInitialEffect";
import { scrollMainToTop } from "../../../utils/scroll";

type Props = {
  playlist: DTOPlaylist;
  playlistResources: DTOPlaylistResource[];
  isEditMode?: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages?: number;
};

export const ListPlaylistResources: React.FC<Props> = ({
  playlist,
  playlistResources,
  isEditMode = false,
  page = 1,
  setPage,
  totalPages = 1
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [resources, setResources] = React.useState(playlistResources);

  React.useEffect(() => {
    setResources(playlistResources);
    setIsLoading(false);
  }, [playlistResources]);

  useSkipInitialEffect(() => {
    scrollMainToTop();
  }, [resources]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(resources);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setResources(reordered);

    const playlist_id_text = playlist?.id_text;
    if (!playlist_id_text) {
      console.warn("No playlist_id_text provided to ListPlaylistResources");
      return;
    }

    function getIdText(resource: DTOPlaylistResource) {
      if (resource.clip) return resource.clip.id_text;
      if (resource.item_soundbite) return resource.item_soundbite.id_text;
      if (resource.item) return resource.item.id_text;
      return undefined;
    }
    
    function getType(resource: DTOPlaylistResource) {
      if (resource.clip) return "clip";
      if (resource.item_soundbite) return "item_soundbite";
      if (resource.item) return "item";
      return undefined;
    }

    const movedType = getType(removed);
    const movedIdText = getIdText(removed);

    if (!movedType || !movedIdText) {
      console.warn("Could not determine moved resource type or id_text");
      return;
    }

    const destIdx = result.destination.index;
    const prevResource = reordered[destIdx - 1];
    const nextResource = reordered[destIdx + 1];
    setIsLoading(true);

    try {
      let updatedResource: DTOPlaylistResource | null = null;
      if (destIdx === 0) {
        if (movedType === "item") {
          updatedResource = await apiRequestService.reqPlaylistResourceItemAddFirst(playlist_id_text, movedIdText);
        } else if (movedType === "clip") {
          updatedResource = await apiRequestService.reqPlaylistResourceClipAddFirst(playlist_id_text, movedIdText);
        } else if (movedType === "item_soundbite") {
          updatedResource = await apiRequestService.reqPlaylistResourceItemSoundbiteAddFirst(playlist_id_text, movedIdText);
        }
      } else if (destIdx === reordered.length - 1) {
        if (movedType === "item") {
          updatedResource = await apiRequestService.reqPlaylistResourceItemAddLast(playlist_id_text, movedIdText);
        } else if (movedType === "clip") {
          updatedResource = await apiRequestService.reqPlaylistResourceClipAddLast(playlist_id_text, movedIdText);
        } else if (movedType === "item_soundbite") {
          updatedResource = await apiRequestService.reqPlaylistResourceItemSoundbiteAddLast(playlist_id_text, movedIdText);
        }
      } else {
        const prevPosition = prevResource ? prevResource.list_position : undefined;
        const nextPosition = nextResource ? nextResource.list_position : undefined;
        if (movedType === "item" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqPlaylistResourceItemAddBetween(
            playlist_id_text,
            movedIdText,
            { position1: String(prevPosition), position2: String(nextPosition) }
          );
        } else if (movedType === "clip" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqPlaylistResourceClipAddBetween(
            playlist_id_text,
            movedIdText,
            { position1: String(prevPosition), position2: String(nextPosition) }
          );
        } else if (movedType === "item_soundbite" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqPlaylistResourceItemSoundbiteAddBetween(
            playlist_id_text,
            movedIdText,
            { position1: String(prevPosition), position2: String(nextPosition) }
          );
        }
      }
      
      let updatedReordered = [...reordered];
      if (updatedResource) {
        const updatedListPosition = updatedResource.list_position;
        const movedResource = updatedReordered[destIdx];

        if (movedType === "clip" && movedResource.clip_id === removed.clip_id) {
          updatedReordered[destIdx] = {
            ...movedResource,
            list_position: updatedListPosition,
          };
        } else if (movedType === "item_soundbite" && movedResource.item_soundbite_id === removed.item_soundbite_id) {
          updatedReordered[destIdx] = {
            ...movedResource,
            list_position: updatedListPosition,
          };
        } else if (movedType === "item" && movedResource.item_id === removed.item_id) {
          updatedReordered[destIdx] = {
            ...movedResource,
            list_position: updatedListPosition,
          };
        }
      }

      setResources(updatedReordered);
    } catch (err) {
      console.error("Error updating playlist order", err);
    }
    setIsLoading(false);
  };

  if (isEditMode) {
    return (
      <>
        {!isLoading && (
          <div className={styles.listWrapper}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="playlist-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {resources.map((playlistResource, idx) => (
                      <Draggable key={playlistResource.id} draggableId={String(playlistResource.id)} index={idx}>
                        {(providedDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                          >
                            <ListPlaylistResourceRow
                              playlistResource={playlistResource}
                              removeFromPlaylist={() => {
                                const updatedResources = resources.filter((res) => res.id !== playlistResource.id);
                                setResources(updatedResources);
                              }}
                              isEditModePlaylist={true}
                              playlist={playlist}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        <LoadingSpinnerOverlay isLoading={isLoading} />
      </>
    );
  } else {
    console.log("page", page, "totalPages", totalPages);
    return (
      <>
      <div className={styles.listWrapper}>
        <Pagination
          currentPage={page}
          maxButtons={5}
          totalPages={totalPages}
          setPage={setPage}
        >
          {resources.map((playlistResource) => (
            <ListPlaylistResourceRow
              key={playlistResource.id}
              playlistResource={playlistResource}
              removeFromPlaylist={() => {}}
              isEditModePlaylist={false}
              playlist={playlist}
            />
          ))}
        </Pagination>
      </div>
        <LoadingSpinnerOverlay isLoading={isLoading} />
      </>
    );
  }
};
