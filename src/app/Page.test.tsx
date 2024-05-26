import { render } from '@testing-library/react';
import Page from './Page';

describe('Page component', () => {
  it('test if todo-board is on the page', () => {
    render(<Page />);
  });

  it('renders TodoBoard component', () => {
    const { getByTestId } = render(<Page />);
    const todoBoardElement = getByTestId('todo-board');
    expect(todoBoardElement).toBeInTheDocument();
  });
});
