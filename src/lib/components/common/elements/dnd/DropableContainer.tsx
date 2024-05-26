import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';

// COMPONENTS
import Container from './Container';

// TYPES
import { FC } from 'react';
import type { IContainerProps } from './Container';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { AnimateLayoutChanges } from '@dnd-kit/sortable';

interface IDroppableContainerProps extends IContainerProps {
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const DroppableContainer: FC<IDroppableContainerProps> = ({
  children,
  disabled,
  id,
  items,
  ...props
}) => {
  const { setNodeRef } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });

  return (
    <Container ref={disabled ? undefined : setNodeRef} {...props}>
      {children}
    </Container>
  );
};

export default DroppableContainer;
