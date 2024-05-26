import * as Yup from 'yup';

// UTILS
import { titleSchema, descriptionSchema, statusSchema } from '@utils/validation/task';
import mockProvider from '@utils/mock/task';

// COMPONENTS
import { Formik, FormikHelpers } from 'formik';

// TYPES
import type { FC } from 'react';
import { IPropsWithForcedChildren, IFormMode, FormMode } from '@types_/components';
import { type ITask, TaskStatus } from '@types_/models/task';

/**
 * NOTE: If we want to implement path we can create a type union
 *       and use the type guards for more type safety
 */
type TFormValues = Omit<ITask, 'id'> & { id?: number };

// CONSTANTS
const INITIAL_VALUES: TFormValues = {
  id: undefined,
  title: '',
  description: '',
  status: TaskStatus.TODO,
};

// VALIDATIONS
const formValidationSchema = Yup.object().shape({
  title: titleSchema,
  description: descriptionSchema,
  status: statusSchema,
});

interface ITaskFormProviderProps extends IPropsWithForcedChildren, IFormMode {}

const TaskFormProvider: FC<ITaskFormProviderProps> = ({ children, mode }) => {
  const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    if (mode === FormMode.CREATE) {
      /**
       * NOTE: we can use type guards as well but because the validation
       *       makes sure all the fields are available it will be overkill
       */
      const res = await mockProvider.post(values);

      if (res.id) {
        helpers.setSubmitting(false);
        helpers.setStatus('submited');
      }
    } else if (mode === FormMode.UPDATE) {
      if (typeof values.id === 'number') {
        const res = await mockProvider.update(values as ITask);

        if (res.id) {
          helpers.setSubmitting(false);
          helpers.setStatus('submited');
        }
      } else {
        throw new Error('No id is provided for update');
      }
    }
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={handleSubmit}
      validationSchema={formValidationSchema}
    >
      {children}
    </Formik>
  );
};

export default TaskFormProvider;
