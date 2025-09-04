import { render, screen } from '@testing-library/react';
import App from './App';

test('renders all pages', () => {
  render(<App />);
  const linkElement = screen.getByText(/beranda/i);
  expect(linkElement).toBeInTheDocument();
});
