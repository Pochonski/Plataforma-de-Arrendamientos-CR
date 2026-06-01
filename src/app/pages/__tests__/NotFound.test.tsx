import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from '@/test/test-utils';
import NotFound from '../NotFound';

describe('NotFound', () => {
  it('should render 404 message', () => {
    render(<NotFound />, { wrapper: TestWrapper });
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<NotFound />, { wrapper: TestWrapper });
    expect(screen.getByRole('link', { name: /ir al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver propiedades/i })).toBeInTheDocument();
  });

  it('should render a back button', () => {
    render(<NotFound />, { wrapper: TestWrapper });
    expect(screen.getByRole('button', { name: /volver atrás/i })).toBeInTheDocument();
  });
});
