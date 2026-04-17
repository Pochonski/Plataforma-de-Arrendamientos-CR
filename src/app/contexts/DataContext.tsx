import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Property, Invitation, Payment, Contract, Notification, User, Conversation, Message, ConversationType, PropertyStatus, PropertyType, Currency, ContractStatus, DepositStatus } from '../types';

const API_BASE = (import.meta as any).env.VITE_API_URL || '';
const APIM_KEY = (import.meta as any).env.VITE_APIM_SUBSCRIPTION_KEY || '';
const PAGE_SIZE = 6;

// ---------------------------------------------------------------------------
// Normalization helpers — map APIM field names → frontend type field names
// ---------------------------------------------------------------------------

const normalizeProperty = (raw: any): Property => {
  // Handle price conversion (especially for APIM mocks that send "string" or actual strings)
  let precio = 0;
  if (typeof raw.precio === 'number') {
    precio = raw.precio;
  } else if (typeof raw.precio === 'string') {
    precio = parseFloat(raw.precio);
    if (isNaN(precio)) precio = 0;
  }

  return {
    // If ID is generic "string", use a random one for local UI stability
    id: !raw.id || raw.id === 'string' ? `mock-${Math.random().toString(36).substr(2, 9)}` : raw.id,
    titulo: raw.titulo === 'string' ? 'Propiedad Nueva' : (raw.titulo ?? ''),
    descripcion: raw.descripcion === 'string' ? '' : (raw.descripcion ?? ''),
    precio: precio,
    moneda: (raw.moneda === 'string' ? 'CRC' : (raw.moneda ?? 'CRC')) as Currency,
    provincia: raw.provincia === 'string' ? '' : (raw.provincia ?? ''),
    canton: raw.canton === 'string' ? '' : (raw.canton ?? ''),
    distrito: raw.distrito === 'string' ? '' : (raw.distrito ?? ''),
    tipo: (raw.tipo === 'string' ? 'apartamento' : (raw.tipo ?? 'apartamento')) as PropertyType,
    // APIM may return 'alquilado' (without 'a'), normalize it
    estado: (['disponible', 'alquilada', 'mantenimiento'].includes(raw.estado)
      ? raw.estado
      : raw.estado === 'alquilado' ? 'alquilada' : 'disponible') as PropertyStatus,
    imagenes: Array.isArray(raw.imagenes) ? raw.imagenes.filter((i: string) => i !== 'string') : [],
    // APIM uses idDueno; frontend uses duenoId
    duenoId: raw.duenoId ?? raw.idDueno ?? '',
    // APIM uses amenidades; frontend uses caracteristicas
    caracteristicas: Array.isArray(raw.caracteristicas)
      ? raw.caracteristicas.filter((c: string) => c !== 'string')
      : Array.isArray(raw.amenidades) ? raw.amenidades.filter((a: string) => a !== 'string') : [],
    createdAt: new Date(raw.createdAt ?? raw.fechaCreacion ?? Date.now()),
  };
};

const denormalizeProperty = (p: Partial<Property>): any => {
  const raw: any = { ...p };
  // Map duenoId -> idDueno (APIM expects idDueno)
  if (p.duenoId) {
    raw.idDueno = p.duenoId;
    delete (raw as any).duenoId;
  }
  
  // Map caracteristicas -> amenidades (Matches your current APIM response)
  if (p.caracteristicas) {
    raw.amenidades = p.caracteristicas;
    delete (raw as any).caracteristicas;
  }
  
  // Ensure we don't send Date objects to APIM
  if (p.createdAt instanceof Date) {
    raw.fechaCreacion = p.createdAt.toISOString();
    delete (raw as any).createdAt;
  }
  return raw;
};

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

const normalizePayment = (raw: any): Payment => ({
  id: raw.id ?? '',
  tipo: raw.tipo ?? 'mensualidad',
  // APIM uses idContrato; frontend uses contratoId
  contratoId: raw.contratoId ?? raw.idContrato ?? '',
  // APIM uses idPropiedad; frontend uses propiedadId
  propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
  // APIM uses idDueno; frontend uses duenoId
  duenoId: raw.duenoId ?? raw.idDueno ?? '',
  // APIM uses idInquilino; frontend uses inquilinoId
  inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? '',
  mes: raw.mes ?? new Date().getMonth() + 1,
  año: raw.año ?? new Date().getFullYear(),
  monto: raw.monto ?? 0,
  moneda: (raw.moneda ?? 'CRC') as Currency,
  comprobante: raw.comprobante ?? '',
  estado: raw.estado ?? 'pendiente',
  fechaSubida: raw.fechaSubida ? new Date(raw.fechaSubida) : new Date(),
  fechaRevision: raw.fechaRevision ? new Date(raw.fechaRevision) : undefined,
  motivoRechazo: raw.motivoRechazo,
});

const denormalizePayment = (p: Partial<Payment>): any => {
  const raw: any = { ...p };
  if (p.contratoId) { raw.idContrato = p.contratoId; delete raw.contratoId; }
  if (p.propiedadId) { raw.idPropiedad = p.propiedadId; delete raw.propiedadId; }
  if (p.inquilinoId) { raw.idInquilino = p.inquilinoId; delete raw.inquilinoId; }
  if (p.duenoId) { raw.idDueno = p.duenoId; delete raw.duenoId; }
  
  // Formatear fechas para el JSON
  if (p.fechaSubida instanceof Date) raw.fechaSubida = p.fechaSubida.toISOString();
  if (p.fechaRevision instanceof Date) raw.fechaRevision = p.fechaRevision.toISOString();
  
  return raw;
};

const getHeaders = () => ({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  ...(APIM_KEY && { 'Ocp-Apim-Subscription-Key': APIM_KEY }),
});

interface FilterParams {
  search?: string;
  provincia?: string;
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
}

interface DataContextType {
  // Properties with pagination and filters
  properties: Property[];
  propertiesTotal: number;
  propertiesPage: number;
  propertiesTotalPages: number;
  isLoadingProperties: boolean;
  fetchProperties: (page?: number, filters?: FilterParams) => Promise<void>;
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
  fetchPayments: (userId?: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<Payment>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;

  // Notifications
  notifications: Notification[];
  isLoadingNotifications: boolean;
  fetchNotifications: (userId?: string) => Promise<void>;
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
  fetchConversations: (userId?: string) => Promise<void>;
  fetchMessages: (userId?: string) => Promise<void>;
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

  // Properties with pagination and filters
  const fetchProperties = useCallback(async (page: number = 1, filters?: FilterParams) => {
    setIsLoadingProperties(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      });

      // Add filter parameters to URL for real API support
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.provincia && filters.provincia !== 'todas') params.append('provincia', filters.provincia);
        if (filters.tipo && filters.tipo !== 'todos') params.append('tipo', filters.tipo);
        if (filters.precioMin !== undefined) params.append('precioMin', filters.precioMin.toString());
        if (filters.precioMax !== undefined) params.append('precioMax', filters.precioMax.toString());
      }

      const res = await fetch(`${API_BASE}/propiedades?${params}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Handle both paginated {data, total, page, pageSize, totalPages} and plain array responses
      if (Array.isArray(data)) {
        // Plain array — show EXACTLY what the API returns (no local slicing)
        const normalized = data.map(normalizeProperty);
        
        setProperties(normalized);
        setPropertiesTotal(normalized.length);
        setPropertiesPage(page);
        // If it's a plain array, we assume it's the full current view
        setPropertiesTotalPages(Math.ceil(normalized.length / PAGE_SIZE) || 1);
      } else if (data.data && Array.isArray(data.data)) {
        // Real paginated response from API (already filtered and paginated)
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
    const raw = denormalizeProperty(property as any);
    const res = await fetch(`${API_BASE}/propiedades`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(raw),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const newProperty = normalizeProperty(data);
    await fetchProperties(1); // Refresh first page
    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    // APIM uses PUT /propiedades/{id}
    // We include the ID in the body as well, just in case the backend requires it
    const raw = denormalizeProperty({ ...updates, id });
    
    const res = await fetch(`${API_BASE}/propiedades/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(raw),
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
    // Calls GET /contratos/{inquilinoId} — APIM returns only this user's contract.
    // Response is a single object (or null), NOT the full list.
    try {
      const res = await fetch(`${API_BASE}/contratos/${inquilinoId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) return undefined;

      const raw = await res.json();
      // APIM may return null or an empty body when no contract exists
      if (!raw || !raw.id) return undefined;

      return normalizeContract(raw);
    } catch {
      return undefined;
    }
  };

  // Payments
  const fetchPayments = useCallback(async (userId?: string) => {
    setIsLoadingPayments(true);
    try {
      const url = userId ? `${API_BASE}/pagos/${userId}` : `${API_BASE}/pagos`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setPayments(Array.isArray(data) ? data.map(normalizePayment) : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  }, []);

  const addPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
    const raw = denormalizePayment(payment as any);
    const res = await fetch(`${API_BASE}/pagos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(raw),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const newPayment: Payment = await res.json();
    await fetchPayments(payment.inquilinoId || payment.duenoId);
    return newPayment;
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const raw = denormalizePayment({ ...updates, id });
    const res = await fetch(`${API_BASE}/pagos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(raw),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setPayments(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  // Notifications
  const fetchNotifications = useCallback(async (userId?: string) => {
    setIsLoadingNotifications(true);
    try {
      const endpoint = userId ? `${API_BASE}/notificaciones/${userId}` : `${API_BASE}/notificaciones`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const normalizedData = Array.isArray(data) ? data.map(n => ({
        ...n,
        fecha: new Date(n.fecha)
      })) : [];
      setNotifications(normalizedData);
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
    return notifications.filter(n => !n.leida).length;
  };

  const getUnreadMessagesCount = (_userId: string) => {
    // Message reading state is tracked per conversation in the Mensajes component
    // This is a placeholder - messages are managed locally in the component
    return 0;
  };

  // Conversations
  const fetchConversations = useCallback(async (userId?: string) => {
    setIsLoadingConversations(true);
    try {
      const endpoint = userId ? `${API_BASE}/conversaciones/${userId}` : `${API_BASE}/conversaciones`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const normalizedData = Array.isArray(data) ? data.map(c => ({
        ...c,
        lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt) : undefined,
        createdAt: new Date(c.createdAt)
      })) : [];
      setConversations(normalizedData);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const getConversationsByUserId = useCallback((userId: string): Conversation[] => {
    return conversations;
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
  const fetchMessages = useCallback(async (userId?: string) => {
    setIsLoadingMessages(true);
    try {
      const endpoint = userId ? `${API_BASE}/mensajes/${userId}` : `${API_BASE}/mensajes`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const normalizedData = Array.isArray(data) ? data.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })) : [];
      setMessages(normalizedData);
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
      try {
        const res = await fetch(`${API_BASE}/mensajes/${msg.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ status: 'read' }),
        });
        if (!res.ok) console.warn(`Mock PUT failed for message ${msg.id}`);
      } catch (e) {
        console.warn(`Mock PUT failed for message ${msg.id}`);
      }
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
  }, [fetchProperties, fetchInvitations, fetchContracts]);

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
