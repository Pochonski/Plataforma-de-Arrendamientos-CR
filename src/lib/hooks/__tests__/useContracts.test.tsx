import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContracts, useContract, useCreateContract, useUpdateContract } from '../useContracts';
import { TestWrapper } from '@/test/test-utils';
import type { Contract } from '@/app/types';

vi.mock('@/lib/api/contracts', () => ({
  fetchContracts: vi.fn(),
  fetchContract: vi.fn(),
  createContract: vi.fn(),
  updateContract: vi.fn(),
}));

import * as contractsApi from '@/lib/api/contracts';

const mockContract: Contract = {
  id: '1',
  invitacionId: 'inv1',
  propiedadId: 'prop1',
  duenoId: 'user1',
  inquilinoId: 'user2',
  montoMensual: 500,
  montoDeposito: 1000,
  moneda: 'CRC' as const,
  fechaInicio: new Date('2024-06-01'),
  estado: 'activo' as const,
  estadoDeposito: 'pendiente' as const,
};

describe('useContracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch contracts and return data', async () => {
    const mockData = [mockContract];
    vi.mocked(contractsApi.fetchContracts).mockResolvedValue(mockData);

    const { result } = renderHook(() => useContracts(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(contractsApi.fetchContracts).toHaveBeenCalledOnce();
  });

  it('should pass userId to fetchContracts', async () => {
    vi.mocked(contractsApi.fetchContracts).mockResolvedValue([]);

    renderHook(() => useContracts('user1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(contractsApi.fetchContracts).toHaveBeenCalledWith('user1');
    });
  });

  it('should call fetchContracts without userId when not provided', async () => {
    vi.mocked(contractsApi.fetchContracts).mockResolvedValue([]);

    renderHook(() => useContracts(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(contractsApi.fetchContracts).toHaveBeenCalledWith(undefined);
    });
  });

  it('should handle empty contract list', async () => {
    vi.mocked(contractsApi.fetchContracts).mockResolvedValue([]);

    const { result } = renderHook(() => useContracts(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });
});

describe('useContract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single contract by id', async () => {
    vi.mocked(contractsApi.fetchContract).mockResolvedValue(mockContract);

    const { result } = renderHook(() => useContract('1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockContract);
    });

    expect(contractsApi.fetchContract).toHaveBeenCalledWith('1');
  });

  it('should not fetch when id is empty', () => {
    renderHook(() => useContract(''), { wrapper: TestWrapper });

    expect(contractsApi.fetchContract).not.toHaveBeenCalled();
  });
});

describe('useCreateContract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call createContract and return success', async () => {
    const newContract: Omit<Contract, 'id'> = {
      invitacionId: 'inv1',
      propiedadId: 'prop1',
      duenoId: 'user1',
      inquilinoId: 'user2',
      montoMensual: 600,
      montoDeposito: 1200,
      moneda: 'CRC',
      fechaInicio: new Date('2024-07-01'),
      estado: 'activo' as const,
      estadoDeposito: 'pendiente' as const,
    };
    const created: Contract = { id: '2', ...newContract };
    vi.mocked(contractsApi.createContract).mockResolvedValue(created);

    const { result } = renderHook(() => useCreateContract(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(newContract);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(created);
    expect(contractsApi.createContract).toHaveBeenCalledWith(newContract);
  });
});

describe('useUpdateContract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call updateContract with id and data', async () => {
    const updated: Contract = { ...mockContract, estado: 'finalizado' as const };
    vi.mocked(contractsApi.updateContract).mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateContract(), {
      wrapper: TestWrapper,
    });

    result.current.mutate({ id: '1', data: { estado: 'finalizado' } });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(contractsApi.updateContract).toHaveBeenCalledWith('1', { estado: 'finalizado' });
    expect(result.current.data).toEqual(updated);
  });
});
