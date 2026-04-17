import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Property, Invitation, Payment, Contract, Notification, User, Conversation, Message, ConversationType, PropertyStatus, PropertyType, Currency, ContractStatus, DepositStatus } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_URL || '';
const APIM_KEY = (import.meta as any).env.VITE_APIM_SUBSCRIPTION_KEY || '';
const PAGE_SIZE = 6;

// ---------------------------------------------------------------------------
// Normalization helpers — map APIM field names → frontend type field names
// ---------------------------------------------------------------------------

const normalizeProperty = (raw: any): Property => ({
  id: raw.id ?? '',
  titulo: raw.titulo ?? '',
  descripcion: raw.descripcion ?? '',
  precio: raw.precio ?? 0,
  moneda: (raw.moneda ?? 'CRC') as Currency,
  provincia: raw.provincia ?? '',
  canton: raw.canton ?? '',
  distrito: raw.distrito ?? '',
  tipo: (raw.tipo ?? 'apartamento') as PropertyType,
  // APIM may return 'alquilado' (without 'a'), normalize it
  estado: (['disponible', 'alquilada', 'mantenimiento'].includes(raw.estado)
    ? raw.estado
    : raw.estado === 'alquilado' ? 'alquilada' : 'disponible') as PropertyStatus,
  imagenes: Array.isArray(raw.imagenes) ? raw.imagenes : [],
  // APIM uses idDueno; frontend uses duenoId
  duenoId: raw.duenoId ?? raw.idDueno ?? '',
  // APIM uses amenidades; frontend uses caracteristicas
  caracteristicas: Array.isArray(raw.caracteristicas)
    ? raw.caracteristicas
    : Array.isArray(raw.amenidades) ? raw.amenidades : [],
  createdAt: new Date(raw.createdAt ?? raw.fechaCreacion ?? Date.now()),
});

const normalizeContract = (raw: any): Contract => ({
  id: raw.id ?? '',
  invitacionId: raw.invitacionId ?? raw.idInvitacion ?? '',
  // APIM uses idPropiedad; frontend uses propiedadId
  propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
  // APIM uses idDueno; frontend uses duenoId
  duenoId: raw.duenoId ?? raw.idDueno ?? '',
  // APIM uses idInquilino; frontend uses inquilinoId
  inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? '',
  montoMensual: raw.montoMensual ?? 0,
  // APIM uses 'deposito'; frontend uses montoDeposito
  montoDeposito: raw.montoDeposito ?? raw.deposito ?? 0,
  moneda: (raw.moneda ?? 'CRC') as Currency,
  fechaInicio: new Date(raw.fechaInicio ?? Date.now()),
  estado: (raw.estado ?? 'activo') as ContractStatus,
  estadoDeposito: (raw.estadoDeposito ?? 'pendiente') as DepositStatus,
});

const normalizeInvitation = (raw: any): Invitation => ({
  id: raw.id ?? '',
  token: raw.token ?? '',
  // APIM uses idPropiedad; frontend uses propiedadId
  propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
  duenoId: raw.duenoId ?? raw.idDueno ?? '',
  inquilinoCorreo: raw.inquilinoCorreo ?? raw.correoInvitado ?? undefined,
  inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? undefined,
  estado: raw.estado ?? 'pendiente',
  fechaEmision: new Date(raw.fechaEmision ?? raw.fechaEnvio ?? Date.now()),
  fechaExpiracion: new Date(raw.fechaExpiracion ?? raw.fechaEnvio ?? Date.now()),
  montoAlquiler: raw.montoAlquiler ?? raw.montoMensual ?? 0,
  montoDeposito: raw.montoDeposito ?? raw.deposito ?? 0,
  moneda: (raw.moneda ?? 'CRC') as Currency,
});


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

  // Conversations & Messages
  conversations: Conversation[];
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  fetchConversations: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  getConversationsByUserId: (userId: string) => Conversation[];
  getMessagesByConversationId: (conversationId: string) => Message[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => Promise<Message>;
  markMessagesAsRead: (conversationId: string, userId: string) => Promise<void>;
  getOrCreateConversation: (participants: string[], propertyId: string, type: ConversationType) => Promise<Conversation>;
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

  // Conversations & Messages state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

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
        // Plain array — normalize field names and paginate locally
        const normalized = data.map(normalizeProperty);
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedData = normalized.slice(start, end);

        setProperties(paginatedData);
        setPropertiesTotal(normalized.length);
        setPropertiesPage(page);
        setPropertiesTotalPages(Math.ceil(normalized.length / PAGE_SIZE));
      } else if (data.data && Array.isArray(data.data)) {
        // Paginated response from real API
        setProperties(data.data.map(normalizeProperty));
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
      const raw = await res.json();
      return normalizeProperty(raw);
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
      // Normalize APIM field names → frontend types
      setInvitations(Array.isArray(data) ? data.map(normalizeInvitation) : []);
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
    // APIM does NOT have /invitaciones/token/{token}.
    // Fetch all invitations from /invitaciones and filter by token.
    try {
      const res = await fetch(`${API_BASE}/invitaciones`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      const data = await res.json();
      const list: Invitation[] = Array.isArray(data) ? data.map(normalizeInvitation) : [];
      return list.find(inv => inv.token === token);
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
      // Normalize APIM field names → frontend types
      setContracts(Array.isArray(data) ? data.map(normalizeContract) : []);
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
    // APIM does NOT have /contratos/inquilino/{id}.
    // Fetch all contracts from /contratos and filter by inquilinoId.
    try {
      const res = await fetch(`${API_BASE}/contratos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;
      const data = await res.json();
      const list: Contract[] = Array.isArray(data) ? data.map(normalizeContract) : [];
      // Match by normalized inquilinoId OR raw idInquilino
      return list.find(c => c.inquilinoId === inquilinoId);
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

  // Conversations
  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch(`${API_BASE}/conversaciones`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const getConversationsByUserId = useCallback((userId: string): Conversation[] => {
    return conversations.filter(conv => conv.participants.includes(userId));
  }, [conversations]);

  const getOrCreateConversation = async (
    participants: string[],
    propertyId: string,
    type: ConversationType
  ): Promise<Conversation> => {
    const existing = conversations.find(conv => {
      const sameParticipants = conv.participants.length === participants.length &&
        participants.every(p => conv.participants.includes(p));
      return conv.type === type && conv.propertyId === propertyId && sameParticipants;
    });
    if (existing) return existing;

    const res = await fetch(`${API_BASE}/conversaciones`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ participants, propertyId, type }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const newConversation: Conversation = await res.json();
    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };

  // Messages
  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`${API_BASE}/mensajes`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const getMessagesByConversationId = useCallback((conversationId: string): Message[] => {
    return messages.filter(msg => msg.conversationId === conversationId);
  }, [messages]);

  const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> => {
    const res = await fetch(`${API_BASE}/mensajes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const newMessage: Message = await res.json();
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(conv =>
      conv.id === message.conversationId
        ? { ...conv, lastMessage: message.content, lastMessageAt: new Date() }
        : conv
    ));
    return newMessage;
  };

  const markMessagesAsRead = async (conversationId: string, userId: string) => {
    const unreadMessages = messages.filter(
      msg => msg.conversationId === conversationId &&
        msg.receiverId === userId &&
        msg.status !== 'read'
    );
    await Promise.all(unreadMessages.map(async (msg) => {
      const res = await fetch(`${API_BASE}/mensajes/${msg.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: 'read' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }));
    setMessages(prev => prev.map(msg =>
      msg.conversationId === conversationId && msg.receiverId === userId
        ? { ...msg, status: 'read' as const }
        : msg
    ));
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: { ...conv.unreadCount, [userId]: 0 } }
        : conv
    ));
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
    fetchConversations();
    fetchMessages();
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
        conversations,
        isLoadingConversations,
        fetchConversations,
        getConversationsByUserId,
        getOrCreateConversation,
        messages,
        isLoadingMessages,
        fetchMessages,
        getMessagesByConversationId,
        sendMessage,
        markMessagesAsRead,
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
