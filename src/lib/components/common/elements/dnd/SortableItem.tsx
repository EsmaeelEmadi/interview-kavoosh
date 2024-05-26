import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';

// HELPERS
import getColor from './utils/getColor';

// COMPONENTS
import Item from './Item';

// TYPES
import type { FC } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { ITask } from '@types_/models/task';

interface ISortableItemProps {
  onEdit?(): void;
  onRemove?(): void;
  task?: ITask;
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
  handle: boolean;
  disabled?: boolean;
  style(args: any): React.CSSProperties;
  getIndex(id: UniqueIdentifier): number;
  renderItem(): React.ReactElement;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
}
const SortableItem: FC<ISortableItemProps> = ({
  onEdit,
  onRemove,
  task,
  disabled,
  id,
  index,
  handle,
  renderItem,
  style,
  containerId,
  getIndex,
  wrapperStyle,
}) => {
  const { setNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } =
    useSortable({
      id,
    });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      onEdit={onEdit}
      onRemove={onRemove}
      task={task}
      ref={disabled ? undefined : setNodeRef}
      value={id}
      // dragging={isDragging}
      // sorting={isSorting}
      handle={handle}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      color={getColor(task?.status)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  );
};

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}

export default SortableItem;
