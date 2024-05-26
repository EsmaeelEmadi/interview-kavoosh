// import { UniqueIdentifier } from '@dnd-kit/core';
import { TaskStatus } from '@types_/models/task';

type TGetColor = (containerName?: keyof typeof TaskStatus) => string | undefined;

const getColor: TGetColor = (containerName) => {
  switch (containerName) {
    case TaskStatus.TODO:
      return '#7193f1';
    case TaskStatus.DOING:
      return '#ffda6c';
    case TaskStatus.DONE:
      return '#00bcd4';
  }

  return undefined;
};

export default getColor;
