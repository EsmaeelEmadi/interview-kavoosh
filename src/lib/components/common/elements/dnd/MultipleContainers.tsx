import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';

// COMPONENTS
import Container from './Container';
import Item from './Item';
import SortableItem from './SortableItem';
import DroppableContainer from './DropableContainer';
import { Grid } from '@material';

// UTILS
import getColor from './utils/getColor';

// TYPES
import type { FC, CSSProperties } from 'react';
import { type ITask, TaskStatus } from '@types_/models/task';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

interface IMultipleContainersProps {
  onEdit?(task: ITask): void;
  handleEdit?(task: ITask): void;
  onRemove?(id: number): void;
  tasks: ITask[];
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  containerStyle?: CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): CSSProperties;
  wrapperStyle?(args: { index: number }): CSSProperties;
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  vertical?: boolean;
}

const PLACEHOLDER_ID = 'placeholder';

const MultipleContainers: FC<IMultipleContainersProps> = ({
  onEdit,
  handleEdit,
  onRemove,
  tasks,
  adjustScale = false,
  cancelDrop,
  handle = false,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  vertical = false,
}) => {
  const [items, setItems] = useState<Items>({
    [TaskStatus.TODO]: [],
    [TaskStatus.DOING]: [],
    [TaskStatus.DONE]: [],
  });
  const [containers, setContainers] = useState(Object.keys(items) as UniqueIdentifier[]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  useEffect(() => {
    if (tasks) {
      const newItems: Items = { TODO: [], DOING: [], DONE: [] };

      for (const task of tasks) {
        newItems[task.status].push(`${task.status}-${task.id}`);
      }

      setItems(() => newItems);
    }
  }, [tasks]);

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items,
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter((container) => {
                return container.id !== overId && containerItems.includes(container.id);
              }),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items],
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (!overId) return;

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          // if (onEdit) {
          //   onEdit({...task, status: overContainer});
          // }
          setItems((items) => {
            const activeItems = items[activeContainer];
            const overItems = items[overContainer];
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            let newIndex: number;

            if (overId in items) {
              newIndex = overItems.length + 1;
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height;

              const modifier = isBelowOverItem ? 1 : 0;

              newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            const activeItem = items[activeContainer][activeIndex];

            if (handleEdit) {
              const task = getTask(activeItem);
              if (task) {
                handleEdit({ ...task, status: overContainer as keyof typeof TaskStatus });
              }
            }
            return {
              ...items,
              [activeContainer]: items[activeContainer].filter((item) => item !== active.id),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                activeItem,
                ...items[overContainer].slice(newIndex, items[overContainer].length),
              ],
            };
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overId === PLACEHOLDER_ID) {
          const newContainerId = getNextContainerId();

          unstable_batchedUpdates(() => {
            setContainers((containers) => [...containers, newContainerId]);
            setItems((items) => ({
              ...items,
              [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
              [newContainerId]: [active.id],
            }));
            setActiveId(null);
          });
          return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id);
          const overIndex = items[overContainer].indexOf(overId);
          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
            }));
          }
        }

        setActiveId(null);
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <SortableContext
        items={[...containers, PLACEHOLDER_ID]}
        strategy={vertical ? verticalListSortingStrategy : horizontalListSortingStrategy}
      >
        <Grid container data-testid='multi-container-board'>
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              label={minimal ? undefined : `${containerId}`}
              items={items[containerId]}
              style={containerStyle}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  const task = getTask(value);

                  const handleRemove = () => {
                    if (onRemove && task) {
                      onRemove(task.id);
                    }
                  };

                  const handleEdit = () => {
                    if (onEdit && task) {
                      onEdit(task);
                    }
                  };

                  return (
                    <SortableItem
                      onEdit={handleEdit}
                      onRemove={handleRemove}
                      task={task}
                      disabled={isSortingContainer}
                      key={value}
                      id={value}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={containerId}
                      getIndex={getIndex}
                    />
                  );
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
        </Grid>
      </SortableContext>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    const task = getTask(id);

    const handleRemove = () => {
      if (onRemove && task) {
        onRemove(task.id);
      }
    };

    const handleEdit = () => {
      if (onEdit && task) {
        onEdit(task);
      }
    };
    return (
      <Item
        onEdit={handleEdit}
        onRemove={handleRemove}
        task={task}
        value={id}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(task?.status)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    );
  }

  function getTask(key: UniqueIdentifier) {
    if (typeof key === 'string') {
      return tasks.find((task) => task.id === Number(key.split('-')[1]));
    } else if (typeof key === 'number') {
      return tasks.find((task) => task.id === key);
    }
    return;
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    const task = getTask(containerId);

    const handleRemove = () => {
      if (onRemove && task) {
        onRemove(task.id);
      }
    };

    const handleEdit = () => {
      if (onEdit && task) {
        onEdit(task);
      }
    };
    return (
      <Container label={`${containerId}`}>
        {items[containerId].map((item, index) => (
          <Item
            onEdit={handleEdit}
            onRemove={handleRemove}
            task={task}
            key={item}
            value={item}
            handle={handle}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(task?.status)}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    );
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  }
};

export default MultipleContainers;
