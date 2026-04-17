import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Property, Invitation, Payment, Contract, Notification, User } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_URL || '';
const APIM_KEY = (import.meta as any).env.VITE_APIM_SUBSCRIPTION_KEY || '';
const PAGE_SIZE = 6;

const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  ...(APIM_KEY && { 'Ocp-Apim-Subscription-Key': APIM_KEY }),
});

interface DataContextType {
  // Properties with pagination
  properties: Property[];
  propertiesTotal: number;
  propertiesPage: number;
  propertiesTotalPages: number;
  isLoadingProperties: boolean;
  fetchProperties: (page?: number) => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Promise<Property | undefined>;

  // Invitations
  invitations: Invitation[];
  isLoadingInvitations: boolean;
  fetchInvitations: () => Promise<void>;
  createInvitation: (invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>) => Promise<Invitation>;
  updateInvitation: (id: string, updates: Partial<Invitation>) => Promise<void>;
  getInvitationByToken: (token: string) => Promise<Invitation | undefined>;

  // Contracts
  contracts: Contract[];
  isLoadingContracts: boolean;
  fetchContracts: () => Promise<void>;
  createContract: (contract: Omit<Contract, 'id'>) => Promise<Contract>;
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>;
  getContractByInquilinoId: (inquilinoId: string) => Promise<Contract | undefined>;

  // Payments
  payments: Payment[];
  isLoadingPayments: boolean;
  fetchPayments: () => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<Payment>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;

  // Notifications
  notifications: Notification[];
  isLoadingNotifications: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  getUnreadCount: (userId: string) => number;
  getUnreadMessagesCount: (userId: string) => number;

  // Users
  getUserById: (id: string) => Promise<User | undefined>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Properties state with pagination
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [propertiesTotalPages, setPropertiesTotalPages] = useState(0);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  // Other entities state
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Properties with pagination
  const fetchProperties = useCallback(async (page: number = 1) => {
    setIsLoadingProperties(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      });
      const res = await fetch(`${API_BASE}/propiedades?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Handle both paginated {data, total, page, pageSize, totalPages} and plain array responses
      if (Array.isArray(data)) {
        // Plain array from mock - simulate pagination locally
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedData = data.slice(start, end);

        setProperties(paginatedData);
        setPropertiesTotal(data.length);
        setPropertiesPage(page);
        setPropertiesTotalPages(Math.ceil(data.length / PAGE_SIZE));
      } else if (data.data && Array.isArray(data.data)) {
        // Paginated response from real API
        setProperties(data.data);
        setPropertiesTotal(data.total || 0);
        setPropertiesPage(data.page || page);
        setPropertiesTotalPages(data.totalPages || 0);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    } finally {
      setIsLoadingProperties(false);
    }
  }, []);

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    const res = await fetch(`${API_BASE}/propiedades`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(property),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newProperty: Property = await res.json();
    await fetchProperties(1); // Refresh first page
    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const res = await fetch(`${API_BASE}/propiedades/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setProperties(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteProperty = async (id: string) => {
    const res = await fetch(`${API_BASE}/propiedades/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setProperties(prev => prev.filter(p => p.id !== id));
    setPropertiesTotal(prev => prev - 1);
  };

  const getPropertyById = async (id: string): Promise<Property | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/propiedades/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  // Invitations
  const fetchInvitations = useCallback(async () => {
    setIsLoadingInvitations(true);
    try {
      const res = await fetch(`${API_BASE}/invitaciones`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setInvitations([]);
    } finally {
      setIsLoadingInvitations(false);
    }
  }, []);

  const createInvitation = async (invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>): Promise<Invitation> => {
    const res = await fetch(`${API_BASE}/invitaciones`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(invitation),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newInvitation: Invitation = await res.json();
    await fetchInvitations();
    return newInvitation;
  };

  const updateInvitation = async (id: string, updates: Partial<Invitation>) => {
    const res = await fetch(`${API_BASE}/invitaciones/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setInvitations(prev =>
      prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv)
    );
  };

  const getInvitationByToken = async (token: string): Promise<Invitation | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/invitaciones/token/${token}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  // Contracts
  const fetchContracts = useCallback(async () => {
    setIsLoadingContracts(true);
    try {
      const res = await fetch(`${API_BASE}/contratos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setContracts([]);
    } finally {
      setIsLoadingContracts(false);
    }
  }, []);

  const createContract = async (contract: Omit<Contract, 'id'>): Promise<Contract> => {
    const res = await fetch(`${API_BASE}/contratos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contract),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newContract: Contract = await res.json();
    await fetchContracts();
    return newContract;
  };

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    const res = await fetch(`${API_BASE}/contratos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setContracts(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const getContractByInquilinoId = async (inquilinoId: string): Promise<Contract | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/contratos/inquilino/${inquilinoId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  // Payments
  const fetchPayments = useCallback(async () => {
    setIsLoadingPayments(true);
    try {
      const res = await fetch(`${API_BASE}/pagos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  }, []);

  const addPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    const res = await fetch(`${API_BASE}/pagos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payment),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newPayment: Payment = await res.json();
    await fetchPayments();
    return newPayment;
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const res = await fetch(`${API_BASE}/pagos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setPayments(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  // Notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await fetch(`${API_BASE}/notificaciones`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  const addNotification = async (notification: Omit<Notification, 'id'>) => {
    const res = await fetch(`${API_BASE}/notificaciones`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(notification),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newNotification: Notification = await res.json();
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = async (id: string) => {
    const res = await fetch(`${API_BASE}/notificaciones/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ leida: true }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(n => n.userId === userId && !n.leida).length;
  };

  const getUnreadMessagesCount = (_userId: string) => {
    // Message reading state is tracked per conversation in the Mensajes component
    // This is a placeholder - messages are managed locally in the component
    return 0;
  };

  // Users
  const getUserById = async (id: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/usuarios/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProperties(1);
    fetchInvitations();
    fetchContracts();
    fetchPayments();
    fetchNotifications();
  }, []);

  return (
    <DataContext.Provider
      value={{
        properties,
        propertiesTotal,
        propertiesPage,
        propertiesTotalPages,
        isLoadingProperties,
        fetchProperties,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        invitations,
        isLoadingInvitations,
        fetchInvitations,
        createInvitation,
        updateInvitation,
        getInvitationByToken,
        contracts,
        isLoadingContracts,
        fetchContracts,
        createContract,
        updateContract,
        getContractByInquilinoId,
        payments,
        isLoadingPayments,
        fetchPayments,
        addPayment,
        updatePayment,
        notifications,
        isLoadingNotifications,
        fetchNotifications,
        addNotification,
        markNotificationAsRead,
        getUnreadCount,
        getUnreadMessagesCount,
        getUserById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
