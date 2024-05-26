// COMPONENTS
import { Dialog, DialogContent, DialogTitle } from '@material';

import TaskFormProvider from '../providers/TaskFormProvider';
import TaskForm from '../forms/TaskForm';

// TYPES
import type { IUseDialogProps } from '@elements/dialog/useDialog';
import type { FC } from 'react';
import { FormMode } from '@types_/components';
import type { ITask } from '@types_/models/task';

export interface ICreateNewTaskDialogProps {
  onSubmitAction: () => void;
}

type TEditTaskDialog = (args: ICreateNewTaskDialogProps) => FC<IUseDialogProps>;

const EditTaskDialog: TEditTaskDialog = ({ onSubmitAction }) => {
  return ({ isOpen, close, data }: IUseDialogProps<ITask>) => {
    return (
      <Dialog open={isOpen} onClose={close} fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TaskFormProvider mode={FormMode.UPDATE}>
            <TaskForm onSubmitAction={onSubmitAction} task={data} />
          </TaskFormProvider>
        </DialogContent>
      </Dialog>
    );
  };
};

export default EditTaskDialog;
