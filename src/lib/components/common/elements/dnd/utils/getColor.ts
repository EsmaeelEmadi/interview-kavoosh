import { theme } from '@themes/material/mainTheme';

// TYPES
import { TaskStatus } from '@types_/models/task';

type TGetColor = (containerName?: keyof typeof TaskStatus) => string | undefined;

const getColor: TGetColor = (containerName) => {
  switch (containerName) {
    case TaskStatus.TODO:
      return theme.palette.warning.light;
    case TaskStatus.DOING:
      return theme.palette.info.light;
    case TaskStatus.DONE:
      return theme.palette.success.light;
  }

  return undefined;
};

export default getColor;
