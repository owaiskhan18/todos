import { render, screen } from '@testing-library/react';
import Home from '@/app/page'; // Assuming you have a Home page at src/app/page.tsx

describe('Home Page', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
