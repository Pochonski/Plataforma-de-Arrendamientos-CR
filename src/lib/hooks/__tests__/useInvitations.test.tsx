import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useInvitations,
  useInvitation,
  useInvitationByToken,
  useCreateInvitation,
  useUpdateInvitation,
} from '../useInvitations';
import { TestWrapper } from '@/test/test-utils';
import type { Invitation } from '@/app/types';

vi.mock('@/lib/api/invitations', () => ({
  fetchInvitations: vi.fn(),
  fetchInvitation: vi.fn(),
  fetchInvitationByToken: vi.fn(),
  createInvitation: vi.fn(),
  updateInvitation: vi.fn(),
}));

import * as invitationsApi from '@/lib/api/invitations';

const mockInvitation: Invitation = {
  id: '1',
  token: 'tok123',
  propiedadId: 'prop1',
  duenoId: 'user1',
  inquilinoCorreo: 'tenant@test.com',
  inquilinoId: 'user2',
  estado: 'pendiente' as const,
  fechaEmision: new Date('2024-05-01'),
  fechaExpiracion: new Date('2024-05-08'),
  montoAlquiler: 500,
  montoDeposito: 1000,
  moneda: 'CRC' as const,
};

describe('useInvitations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch invitations for a user and return data', async () => {
    const mockData = [mockInvitation];
    vi.mocked(invitationsApi.fetchInvitations).mockResolvedValue(mockData);

    const { result } = renderHook(() => useInvitations('user1'), {
      wrapper: TestWrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(invitationsApi.fetchInvitations).toHaveBeenCalledWith('user1');
  });

  it('should not fetch when userId is empty', () => {
    renderHook(() => useInvitations(''), { wrapper: TestWrapper });

    expect(invitationsApi.fetchInvitations).not.toHaveBeenCalled();
  });

  it('should handle empty invitation list', async () => {
    vi.mocked(invitationsApi.fetchInvitations).mockResolvedValue([]);

    const { result } = renderHook(() => useInvitations('user1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });
});

describe('useInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single invitation by id', async () => {
    vi.mocked(invitationsApi.fetchInvitation).mockResolvedValue(mockInvitation);

    const { result } = renderHook(() => useInvitation('1'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockInvitation);
    });

    expect(invitationsApi.fetchInvitation).toHaveBeenCalledWith('1');
  });

  it('should not fetch when id is empty', () => {
    renderHook(() => useInvitation(''), { wrapper: TestWrapper });

    expect(invitationsApi.fetchInvitation).not.toHaveBeenCalled();
  });
});

describe('useInvitationByToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch invitation by token', async () => {
    vi.mocked(invitationsApi.fetchInvitationByToken).mockResolvedValue(mockInvitation);

    const { result } = renderHook(() => useInvitationByToken('tok123'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockInvitation);
    });

    expect(invitationsApi.fetchInvitationByToken).toHaveBeenCalledWith('tok123');
  });

  it('should not fetch when token is empty', () => {
    renderHook(() => useInvitationByToken(''), { wrapper: TestWrapper });

    expect(invitationsApi.fetchInvitationByToken).not.toHaveBeenCalled();
  });

  it('should return undefined when token not found', async () => {
    vi.mocked(invitationsApi.fetchInvitationByToken).mockResolvedValue(undefined);

    const { result } = renderHook(() => useInvitationByToken('bad-token'), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
  });
});

describe('useCreateInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call createInvitation and return success', async () => {
    const newInvitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'> = {
      propiedadId: 'prop1',
      duenoId: 'user1',
      inquilinoCorreo: 'new-tenant@test.com',
      montoAlquiler: 600,
      montoDeposito: 1200,
      moneda: 'CRC',
    };
    const created: Invitation = {
      id: '2',
      token: 'tok456',
      estado: 'pendiente' as const,
      fechaEmision: new Date('2024-06-01'),
      fechaExpiracion: new Date('2024-06-08'),
      ...newInvitation,
    };
    vi.mocked(invitationsApi.createInvitation).mockResolvedValue(created);

    const { result } = renderHook(() => useCreateInvitation(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(newInvitation);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(created);
    expect(invitationsApi.createInvitation).toHaveBeenCalledWith(newInvitation);
  });
});

describe('useUpdateInvitation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call updateInvitation with id and data', async () => {
    const updated: Invitation = { ...mockInvitation, estado: 'aceptada' as const };
    vi.mocked(invitationsApi.updateInvitation).mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateInvitation(), {
      wrapper: TestWrapper,
    });

    result.current.mutate({ id: '1', data: { estado: 'aceptada' } });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invitationsApi.updateInvitation).toHaveBeenCalledWith('1', { estado: 'aceptada' });
    expect(result.current.data).toEqual(updated);
  });
});
