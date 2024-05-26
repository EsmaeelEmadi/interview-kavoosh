// COMPONENTS
import { Dialog, DialogContent, DialogTitle } from '@material';

import TaskFormProvider from '../providers/TaskFormProvider';
import TaskForm from '../forms/TaskForm';

// TYPES
import type { IUseDialogProps } from '@elements/dialog/useDialog';
import type { FC } from 'react';
import { FormMode } from '@types_/components';

export interface ICreateNewTaskDialogProps {
  onSubmitAction: () => void;
}

type TCreateNewTaskDialog = (args: ICreateNewTaskDialogProps) => FC<IUseDialogProps>;

const CreateNewTaskDialog: TCreateNewTaskDialog = ({ onSubmitAction }) => {
  return ({ isOpen, close }: IUseDialogProps) => {
    return (
      <Dialog open={isOpen} onClose={close} fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TaskFormProvider mode={FormMode.CREATE}>
            <TaskForm onSubmitAction={onSubmitAction} />
          </TaskFormProvider>
        </DialogContent>
      </Dialog>
    );
  };
};

export default CreateNewTaskDialog;
