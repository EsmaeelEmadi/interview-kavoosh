import { render, screen } from '@testing-library/react';
import Page from './Page';

test('renders learn react link', () => {
    render(<Page />);
    const linkElement = screen.getByText(/Kavoosh/i);
    expect(linkElement).toBeInTheDocument();
});
