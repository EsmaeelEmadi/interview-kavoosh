import { useEffect } from 'react';

// COMPONENTS
import { Form, Field, useFormikContext } from 'formik';

import { Grid, LoadingButton, MenuItem, Stack } from '@material';
import { Select, TextField } from '@elements/form/index';

// TYPES
import type { FC } from 'react';
import { ITask, TaskStatus } from '@types_/models/task';

interface ITaskFormProps {
  onSubmitAction?: () => void;
  task?: ITask;
}

const TaskForm: FC<ITaskFormProps> = ({ onSubmitAction, task }) => {
  const { isSubmitting, submitForm, setFieldValue, status } = useFormikContext();

  useEffect(() => {
    if (status === 'submited') {
      if (onSubmitAction) {
        onSubmitAction();
      }
    }
  }, [status]);

  useEffect(() => {
    if (task) {
      setFieldValue('title', task.title);
      setFieldValue('description', task.description);
      setFieldValue('status', task.status);
      setFieldValue('id', task.id);
    }
  }, [task]);

  return (
    <Form>
      <Stack gap={3} padding={4}>
        <Field
          component={TextField}
          name='title'
          type='text'
          label='title'
          disabled={isSubmitting}
          variant='standard'
        />
        <Field
          component={TextField}
          name='description'
          type='text'
          label='description'
          disabled={isSubmitting}
          multiline
          rows={4}
          variant='standard'
        />

        <Field
          component={Select}
          name='status'
          label='status'
          disabled={isSubmitting}
          variant='standard'
        >
          {Object.values(TaskStatus).map((key) => {
            return (
              <MenuItem value={key} key={key}>
                {key}
              </MenuItem>
            );
          })}
        </Field>
        <Grid container direction='row-reverse'>
          <LoadingButton onClick={submitForm} disabled={isSubmitting} loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Grid>
      </Stack>
    </Form>
  );
};

export default TaskForm;
