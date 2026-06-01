import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ErrorBoundary } from '../ErrorBoundary';

function BrokenComponent() {
  throw new Error('Test error');
}

const originalError = console.error;
beforeAll(() => { console.error = vi.fn(); });
afterAll(() => { console.error = originalError; });

describe('ErrorBoundary', () => {
  it('should render fallback UI when child throws', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('should show the error message', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should render children when no error', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <div>Todo bien</div>
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });
});
