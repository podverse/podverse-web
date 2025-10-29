"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTranslations } from "next-intl";
import { DTOQueueResource } from "podverse-helpers";
import React from "react";
import { CallToActionMessage } from "../../CallToActionMessage/CallToActionMessage";
import { useModals } from "../../../contexts/Modals";
import { ListQueueResourceRow } from "./ListQueueResourceRow";
import { apiRequestService } from "../../../factories/apiRequestService";
import { useQueues } from "../../../contexts/Queue";
import { useQueueResourcesLoadActive } from "../../../hooks/useQueueResourcesLoadActive";
import LoadingSpinnerOverlay from "../../LoadingSpinner/LoadingSpinnerOverlay";
import styles from "../../../styles/components/List/Queues/ListQueueResources.module.scss";

type Props = {
  queueResources: DTOQueueResource[];
  showLoginMessage: boolean;
};

export const ListQueueResources: React.FC<Props> = ({ queueResources, showLoginMessage }) => {
  const tInstructions = useTranslations("instructions");
  const tAuthentication = useTranslations("authentication");
  const { setModalLogin } = useModals();
  const { activeQueue } = useQueues();
  const [isLoading, setIsLoading] = React.useState(true);
  const queueResourcesLoadActive = useQueueResourcesLoadActive();
  const [resources, setResources] = React.useState(queueResources);

  React.useEffect(() => {
    setResources(queueResources);
    setIsLoading(false);
  }, [queueResources]);

  const showCallToAction = showLoginMessage;
  const showPagination = !showLoginMessage;

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(resources);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setResources(reordered);

    const queue_id_text = activeQueue?.id_text;
    if (!queue_id_text) {
      console.warn("No queue_id_text provided to ListQueueResources");
      return;
    }

    function getIdText(resource: DTOQueueResource) {
      if (resource.clip) return resource.clip.id_text;
      if (resource.item_soundbite) return resource.item_soundbite.id_text;
      if (resource.item) return resource.item.id_text;
      return undefined;
    }
    
    function getType(resource: DTOQueueResource) {
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
      let updatedResource: DTOQueueResource | null = null;
      if (destIdx === 0) {
        if (movedType === "item") {
          updatedResource = await apiRequestService.reqQueueResourceItemAddNext(queue_id_text, movedIdText);
        } else if (movedType === "clip") {
          updatedResource = await apiRequestService.reqQueueResourceClipAddNext(queue_id_text, movedIdText);
        } else if (movedType === "item_soundbite") {
          updatedResource = await apiRequestService.reqQueueResourceItemSoundbiteAddNext(queue_id_text, movedIdText);
        }
      } else if (destIdx === reordered.length - 1) {
        if (movedType === "item") {
          updatedResource = await apiRequestService.reqQueueResourceItemAddLast(queue_id_text, movedIdText);
        } else if (movedType === "clip") {
          updatedResource = await apiRequestService.reqQueueResourceClipAddLast(queue_id_text, movedIdText);
        } else if (movedType === "item_soundbite") {
          updatedResource = await apiRequestService.reqQueueResourceItemSoundbiteAddLast(queue_id_text, movedIdText);
        }
      } else {
        const prevPosition = prevResource ? prevResource.list_position : undefined;
        const nextPosition = nextResource ? nextResource.list_position : undefined;
        if (movedType === "item" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqQueueResourceItemAddBetween(
            queue_id_text,
            movedIdText, { position1: String(prevPosition), position2: String(nextPosition) }
          );
        } else if (movedType === "clip" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqQueueResourceClipAddBetween(
            queue_id_text,
            movedIdText,
            { position1: String(prevPosition), position2: String(nextPosition) }
          );
        } else if (movedType === "item_soundbite" && prevPosition !== undefined && nextPosition !== undefined) {
          updatedResource = await apiRequestService.reqQueueResourceItemSoundbiteAddBetween(
            queue_id_text,
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

      await queueResourcesLoadActive();
    } catch (err) {
      console.error("Error updating queue order", err);
    }
    setIsLoading(false);
  };

  return (
    <>
      {showCallToAction && (
        <CallToActionMessage
          message={tInstructions("login_for_queues")}
          buttonLabel={tAuthentication("login")}
          onButtonClick={() => setModalLogin({ isOpen: true })}
        />
      )}
      {showPagination && !isLoading && (
        <div className={styles.listWrapper}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="queue-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {resources.map((queueResource, idx) => (
                    <Draggable key={queueResource.id} draggableId={String(queueResource.id)} index={idx}>
                      {(providedDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                        >
                          <ListQueueResourceRow
                            queueResource={queueResource}
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
          <LoadingSpinnerOverlay isLoading={isLoading} />
        </div>
      )}
    </>
  );
};
