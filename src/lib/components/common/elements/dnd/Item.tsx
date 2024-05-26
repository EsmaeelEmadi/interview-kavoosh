import { forwardRef, memo, useEffect } from 'react';
import classNames from 'classnames';

import styles from './Item.module.css';

// COMPONENS
import { Typography, Box, IconButton, Stack, Divider } from '@material';

// ICONS
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// TYPES
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import type { ITask } from '@types_/models/task';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import { theme } from '@themes/material/mainTheme';

export interface IItemProps {
  task?: ITask;
  description?: string;
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: CSSProperties;
  transition?: string | null;
  wrapperStyle?: CSSProperties;
  value: ReactNode;
  onRemove?(): void;
  onEdit?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: Ref<HTMLElement>;
    style: CSSProperties | undefined;
    transform: IItemProps['transform'];
    transition: IItemProps['transition'];
    value: IItemProps['value'];
  }): ReactElement;
}

const Item = memo(
  forwardRef<HTMLLIElement, IItemProps>(
    (
      {
        task,
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        index,
        listeners,
        onRemove,
        onEdit,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      // if (!task) return null;

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          data-testid={`task-item-${task?.status}`}
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay,
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition].filter(Boolean).join(', '),
              '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
              '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
              '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
              '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
              '--index': index,
              '--color': color,
            } as CSSProperties
          }
          ref={ref}
        >
          <Box
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              color && styles.color,
            )}
            style={style}
            data-cypress='draggable-item'
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            <Stack
              paddingLeft={theme.spacing(3)}
              paddingRight={theme.spacing(2)}
              paddingY={theme.spacing(2)}
            >
              <Typography sx={{ fontWeight: 'bold' }}>{task?.title}</Typography>
              <Typography variant='caption' whiteSpace='normal'>
                {task?.description}
              </Typography>
            </Stack>
            {onEdit || onRemove ? (
              <>
                <Divider orientation='vertical' />
                <Stack paddingX={theme.spacing(2)} paddingY={theme.spacing(1)}>
                  {onEdit ? (
                    <IconButton
                      color='primary'
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => {
                        onEdit();
                      }}
                    >
                      <EditNoteIcon />
                    </IconButton>
                  ) : null}
                  {onRemove ? (
                    <IconButton
                      color='error'
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => {
                        onRemove();
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              </>
            ) : null}
          </Box>
        </li>
      );
    },
  ),
);

export default Item;
