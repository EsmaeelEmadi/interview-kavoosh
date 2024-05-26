import * as Yup from 'yup';

// TYPES
import { TaskStatus } from '@types_/models/task';

export const titleSchema = Yup.string().required().min(8).max(30);
export const descriptionSchema = Yup.string().min(20).max(400);
export const statusSchema = Yup.string()
  .required('Status is required')
  .oneOf(Object.values(TaskStatus), 'Invalid status');
