import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';

vi.mock('@/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    isAuthenticated: false,
    user: null,
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/app/components/shared/GoogleSignInButton', () => ({
  GoogleSignInButton: () => null,
}));

import Login from '../Login';

describe('Login', () => {
  it('should render login heading', () => {
    render(<Login />, { wrapper: TestWrapper });
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should have email input', () => {
    render(<Login />, { wrapper: TestWrapper });
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  it('should have password input', () => {
    render(<Login />, { wrapper: TestWrapper });
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('should have a submit button', () => {
    render(<Login />, { wrapper: TestWrapper });
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should link to registro', () => {
    render(<Login />, { wrapper: TestWrapper });
    expect(screen.getByText(/regístrate gratis/i)).toBeInTheDocument();
  });
});
