import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/lib/hooks/useProperties', () => ({
  useProperties: vi.fn().mockReturnValue({
    data: {
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
    },
    isLoading: false,
  }),
}));

vi.mock('@/lib/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

import Propiedades from '../Propiedades';

describe('Propiedades', () => {
  it('should render page heading', () => {
    render(<Propiedades />, { wrapper: TestWrapper });
    expect(screen.getByText(/encuentra tu hogar ideal/i)).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<Propiedades />, { wrapper: TestWrapper });
    expect(screen.getByPlaceholderText(/busca por ubicación/i)).toBeInTheDocument();
  });

  it('should show empty state when no results', () => {
    render(<Propiedades />, { wrapper: TestWrapper });
    expect(screen.getByText(/no se encontraron propiedades/i)).toBeInTheDocument();
  });
});
