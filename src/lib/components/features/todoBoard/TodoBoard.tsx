// HOOKS
import useDialog from '@elements/dialog/useDialog';

// COMPONENTS
import { Container, Stack, Grid, Button, Typography } from '@material';

import CreateNewTaskDialog from '@features/task/dialogs/CreateNewTaskDialog';
import EditTaskDialog from '@features/task/dialogs/EditTaskDialog';

// SERVICES
import mock from '@utils/mock/task';

// TYPES
import { FC, useCallback, useEffect, useState } from 'react';
import MultipleContainers from '@elements/dnd/MultipleContainers';
import type { ITask } from '@types_/models/task';

const TodoBoard: FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchTasks = useCallback(() => {
    mock.get().then((mockTasks) => {
      setTasks(() => mockTasks);
    });
  }, []);

  const removeTask = useCallback((id: number) => {
    mock
      .remove(id)
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        fetchTasks();
      });
  }, []);

  const updateTask = useCallback((task: ITask) => {
    mock
      .update(task)
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        fetchTasks();
      });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateSubmit = () => {
    fetchTasks();
    closeCreateTask();
  };

  const handleEditSubmit = () => {
    fetchTasks();
    closeEditTask();
  };

  const {
    Dialog: CreateTaskDialogElement,
    open: openCreateTask,
    close: closeCreateTask,
  } = useDialog(CreateNewTaskDialog({ onSubmitAction: handleCreateSubmit }));
  const {
    Dialog: EditTaskDialogElement,
    open: openEditTask,
    close: closeEditTask,
    setData: editTaskSetData,
  } = useDialog<ITask>(EditTaskDialog({ onSubmitAction: handleEditSubmit }));

  const handleEdit = useCallback((task: ITask) => {
    editTaskSetData(task);
    openEditTask();
  }, []);

  return (
    <>
      <Container maxWidth='xl' sx={{ paddingY: 6 }} data-testid='todo-board'>
        <Stack gap={4}>
          <Grid container direction='column'>
            <Typography variant='h4'>Todo Board</Typography>
          </Grid>
          <Grid>
            <Button
              variant='contained'
              onClick={() => {
                openCreateTask();
              }}
            >
              Create New Todo
            </Button>
          </Grid>
          <Grid>
            <MultipleContainers
              tasks={tasks}
              onEdit={handleEdit}
              onRemove={removeTask}
              handleEdit={updateTask}
            />
          </Grid>
        </Stack>
      </Container>
      <CreateTaskDialogElement />
      <EditTaskDialogElement />
    </>
  );
};

export default TodoBoard;
