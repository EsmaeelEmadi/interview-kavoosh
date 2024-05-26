import { render } from '@testing-library/react';

import MultipleContainers from './MultipleContainers';
import { TaskStatus } from '@types_/models/task';
import mockDataProvider, { init } from '@utils/mock/task';

describe('TodoBoard component', () => {
  beforeAll(async () => {
    init('cache-test');
    mockDataProvider.clear();
  });

  it('test if todo-board is on the page', () => {
    const tasks = [
      { id: 1, title: 'Task 1', status: TaskStatus.TODO },
      { id: 2, title: 'Task 2', status: TaskStatus.TODO },
      { id: 3, title: 'Task 3', status: TaskStatus.DOING },
      { id: 4, title: 'Task 4', status: TaskStatus.DONE },
    ];

    const { getByTestId } = render(<MultipleContainers tasks={tasks} />);
    const todoBoardElement = getByTestId('multi-container-board');
    const todoContainer = getByTestId(`container-${TaskStatus.TODO}`);
    const doingContainer = getByTestId(`container-${TaskStatus.DOING}`);
    const doneContainer = getByTestId(`container-${TaskStatus.DONE}`);

    expect(todoBoardElement).toBeInTheDocument();
    expect(todoContainer).toBeInTheDocument();
    expect(doingContainer).toBeInTheDocument();
    expect(doneContainer).toBeInTheDocument();

    const todoTasks = todoContainer.querySelectorAll(
      `[data-testid="task-item-${TaskStatus.TODO}"]`,
    );
    const doingTasks = doingContainer.querySelectorAll(
      `[data-testid="task-item-${TaskStatus.DOING}"]`,
    );
    const doneTasks = doneContainer.querySelectorAll(
      `[data-testid="task-item-${TaskStatus.DONE}"]`,
    );

    expect(todoTasks.length).toBe(2);
    expect(doingTasks.length).toBe(1);
    expect(doneTasks.length).toBe(1);
  });
});
