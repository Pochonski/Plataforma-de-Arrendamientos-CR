import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';

vi.mock('motion/react', () => ({
  motion: new Proxy({}, { get: (_, tag: string) => tag as any }),
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/lib/api/properties', () => ({
  fetchProperties: vi.fn().mockResolvedValue({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  }),
}));

import Landing from '../Landing';

describe('Landing', () => {
  it('should render the hero heading', () => {
    render(<Landing />, { wrapper: TestWrapper });
    expect(screen.getByText(/revoluciona la forma de/i)).toBeInTheDocument();
  });

  it('should render CTA link to registro', () => {
    render(<Landing />, { wrapper: TestWrapper });
    expect(screen.getByRole('link', { name: /registrarse gratis/i })).toBeInTheDocument();
  });

  it('should render the how-it-works section', () => {
    render(<Landing />, { wrapper: TestWrapper });
    expect(screen.getByText(/cómo funciona/i)).toBeInTheDocument();
  });
});
