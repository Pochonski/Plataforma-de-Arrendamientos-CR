import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Property, Invitation, Payment, Contract, Notification, Message, Conversation, ConversationType, User } from '../types';

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    nombre: 'Carlos Ramírez',
    correo: 'carlos@example.com',
    rol: 'dueño',
  },
  {
    id: '2',
    nombre: 'María González',
    correo: 'maria@example.com',
    rol: 'inquilino',
  },
];

interface DataContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  
  invitations: Invitation[];
  createInvitation: (invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>) => Promise<Invitation>;
  updateInvitation: (id: string, updates: Partial<Invitation>) => void;
  getInvitationByToken: (token: string) => Invitation | undefined;
  
  contracts: Contract[];
  createContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  getContractByInquilinoId: (inquilinoId: string) => Contract | undefined;
  
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  
  // Messages
  conversations: Conversation[];
  messages: Message[];
  createConversation: (conversation: Omit<Conversation, 'id' | 'createdAt' | 'unreadCount'>) => Conversation;
  getOrCreateConversation: (participants: string[], propertyId?: string, type?: ConversationType) => Conversation;
  getConversationById: (id: string) => Conversation | undefined;
  getConversationsByUserId: (userId: string) => Conversation[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  getMessagesByConversationId: (conversationId: string) => Message[];
  markMessagesAsRead: (conversationId: string, userId: string) => void;
  getUnreadMessagesCount: (userId: string) => number;
  
  // Users
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    titulo: 'Apartamento moderno en Escazú',
    descripcion: 'Hermoso apartamento de 2 habitaciones con vista panorámica, cerca de centros comerciales y transporte público.',
    precio: 650000,
    moneda: 'CRC',
    provincia: 'San José',
    canton: 'Escazú',
    distrito: 'San Rafael',
    tipo: 'apartamento',
    estado: 'disponible',
    imagenes: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    duenoId: '1',
    caracteristicas: ['2 habitaciones', '2 baños', 'Cocina equipada', 'Balcón', 'Parqueo', 'Seguridad 24/7'],
    createdAt: new Date('2026-02-15'),
  },
  {
    id: '2',
    titulo: 'Casa amplia en Heredia Centro',
    descripcion: 'Casa espaciosa de 3 habitaciones, jardín amplio, perfecta para familias.',
    precio: 850000,
    moneda: 'CRC',
    provincia: 'Heredia',
    canton: 'Heredia',
    distrito: 'Mercedes',
    tipo: 'casa',
    estado: 'disponible',
    imagenes: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    duenoId: '1',
    caracteristicas: ['3 habitaciones', '2.5 baños', 'Jardín', 'Garaje doble', 'Sala de estar'],
    createdAt: new Date('2026-03-01'),
  },
  {
    id: '3',
    titulo: 'Estudio en Sabana',
    descripcion: 'Acogedor estudio ideal para profesionales, totalmente amueblado.',
    precio: 450000,
    moneda: 'CRC',
    provincia: 'San José',
    canton: 'San José',
    distrito: 'Mata Redonda',
    tipo: 'apartamento',
    estado: 'disponible',
    imagenes: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    duenoId: '1',
    caracteristicas: ['1 habitación', '1 baño', 'Cocina', 'Amueblado', 'Wi-Fi'],
    createdAt: new Date('2026-03-10'),
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  // Data helper to load from local storage and revive Dates
  const reviveDate = (k: string, v: any) => {
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)) {
      return new Date(v);
    }
    return v;
  };

  // Eliminamos localStorage por requerimiento del proyecto
  // Ahora manejamos el estado en memoria y lo sincronizamos con Azure APIM
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES); 
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Inicializar datos llamando a Azure API Management
  useEffect(() => {
    const API_URL = (import.meta as any).env.VITE_API_URL;

    // Obtener propiedades desde Azure
    fetch(`${API_URL}/propiedades`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
        }
      })
      .catch(err => console.error('Error obteniendo propiedades:', err));

    // Obtener contratos desde Azure
    fetch(`${API_URL}/contratos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setContracts(data);
        }
      })
      .catch(err => console.error('Error obteniendo contratos:', err));

    // Obtener invitaciones desde Azure
    fetch(`${API_URL}/invitaciones`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInvitations(data);
        }
      })
      .catch(err => console.error('Error obteniendo invitaciones:', err));
  }, []);

  // Properties
  const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      const API_URL = (import.meta as any).env.VITE_API_URL;
      // Notificar a Azure API de la creación
      await fetch(`${API_URL}/propiedades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property)
      });
      console.log('Propiedad creada exitosamente en Azure APIM (Mock)');
    } catch (err) {
      console.error('Error creando propiedad en Azure APIM', err);
    }
    
    // Actualizar UI
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getPropertyById = (id: string) => {
    return properties.find(p => p.id === id);
  };

  // Invitations
  const createInvitation = async (invitation: Omit<Invitation, 'id' | 'token' | 'fechaEmision' | 'fechaExpiracion' | 'estado'>) => {
    const token = Math.random().toString(36).substring(2, 15);
    const fechaEmision = new Date();
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 48);

    const newInvitation: Invitation = {
      ...invitation,
      id: Date.now().toString(),
      token,
      fechaEmision,
      fechaExpiracion,
      estado: 'pendiente',
    };

    try {
      const API_URL = (import.meta as any).env.VITE_API_URL;
      await fetch(`${API_URL}/invitaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvitation)
      });
      console.log('Invitación sincronizada con Azure APIM');
    } catch (err) {
      console.error('Error sincronizando invitación con Azure', err);
    }
    
    setInvitations(prev => [newInvitation, ...prev]);
    return newInvitation;
  };

  const updateInvitation = (id: string, updates: Partial<Invitation>) => {
    setInvitations(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const getInvitationByToken = (token: string) => {
    return invitations.find(inv => inv.token === token);
  };

  // Contracts
  const createContract = (contract: Omit<Contract, 'id'>) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
    };
    setContracts(prev => [newContract, ...prev]);
  };

  const getContractByInquilinoId = (inquilinoId: string) => {
    return contracts.find(c => c.inquilinoId === inquilinoId && c.estado === 'activo');
  };

  const updateContract = (id: string, updates: Partial<Contract>) => {
    setContracts(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Payments
  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    try {
      const API_URL = (import.meta as any).env.VITE_API_URL;
      // Notificar a Azure API de la creación del pago
      await fetch(`${API_URL}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      console.log('Pago creado exitosamente en Azure APIM (Mock)');
    } catch (err) {
      console.error('Error enviando pago a Azure APIM', err);
    }

    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
    };
    setPayments(prev => [newPayment, ...prev]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Notifications
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(n => n.userId === userId && !n.leida).length;
  };

  // Messages
  const createConversation = (conversation: Omit<Conversation, 'id' | 'createdAt' | 'unreadCount'>) => {
    const unreadCount: { [userId: string]: number } = {};
    conversation.participants.forEach(userId => {
      unreadCount[userId] = 0;
    });
    
    const newConversation: Conversation = {
      ...conversation,
      id: Date.now().toString(),
      createdAt: new Date(),
      unreadCount,
    };
    setConversations(prev => [newConversation, ...prev]);
    return newConversation;
  };

  const getOrCreateConversation = (participants: string[], propertyId?: string, type?: ConversationType) => {
    const existingConversation = conversations.find(c => 
      c.participants.length === participants.length &&
      c.participants.every(p => participants.includes(p)) &&
      c.propertyId === propertyId &&
      c.type === type
    );
    if (existingConversation) {
      return existingConversation;
    }
    return createConversation({ participants, propertyId, type: type || 'general' });
  };

  const getConversationById = (id: string) => {
    return conversations.find(c => c.id === id);
  };

  const getConversationsByUserId = (userId: string) => {
    return conversations.filter(c => c.participants.includes(userId));
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages(prev => [newMessage, ...prev]);
    
    // Update conversation with last message info and increment unread count
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === message.conversationId) {
          const newUnreadCount = { ...conv.unreadCount };
          // Increment unread count for all participants except the sender
          conv.participants.forEach(userId => {
            if (userId !== message.senderId) {
              newUnreadCount[userId] = (newUnreadCount[userId] || 0) + 1;
            }
          });
          
          return {
            ...conv,
            lastMessage: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
            lastMessageAt: newMessage.timestamp,
            unreadCount: newUnreadCount,
          };
        }
        return conv;
      })
    );
  };

  const getMessagesByConversationId = (conversationId: string) => {
    return messages.filter(m => m.conversationId === conversationId);
  };

  const markMessagesAsRead = useCallback((conversationId: string, userId: string) => {
    setMessages(prev =>
      prev.map(m => 
        m.conversationId === conversationId && m.senderId !== userId
          ? { ...m, status: 'read' }
          : m
      )
    );
    
    // Reset unread count for this user in the conversation
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          const newUnreadCount = { ...conv.unreadCount };
          newUnreadCount[userId] = 0;
          return {
            ...conv,
            unreadCount: newUnreadCount,
          };
        }
        return conv;
      })
    );
  }, []);

  const getUnreadMessagesCount = (userId: string) => {
    return conversations
      .filter(c => c.participants.includes(userId))
      .reduce((total, conv) => total + (conv.unreadCount[userId] || 0), 0);
  };

  // Users
  const getUserById = (id: string) => {
    return MOCK_USERS.find(user => user.id === id);
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        invitations,
        createInvitation,
        updateInvitation,
        getInvitationByToken,
        contracts,
        createContract,
        updateContract,
        getContractByInquilinoId,
        payments,
        addPayment,
        updatePayment,
        notifications,
        addNotification,
        markNotificationAsRead,
        getUnreadCount,
        conversations,
        messages,
        createConversation,
        getOrCreateConversation,
        getConversationById,
        getConversationsByUserId,
        sendMessage,
        getMessagesByConversationId,
        markMessagesAsRead,
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