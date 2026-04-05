export type UserRole = 'dueño' | 'inquilino';

export interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  avatar?: string;
}

export type Currency = 'CRC' | 'USD';

export type PropertyType = 'casa' | 'apartamento' | 'local' | 'bodega' | 'oficina';

export type PropertyStatus = 'disponible' | 'alquilada' | 'mantenimiento';

export interface Property {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  moneda: Currency;
  provincia: string;
  canton: string;
  distrito: string;
  tipo: PropertyType;
  estado: PropertyStatus;
  imagenes: string[];
  duenoId: string;
  caracteristicas: string[];
  createdAt: Date;
}

export type InvitationStatus = 'pendiente' | 'aceptada' | 'expirada' | 'cancelada';

export interface Invitation {
  id: string;
  token: string;
  propiedadId: string;
  duenoId: string;
  inquilinoCorreo?: string;
  inquilinoId?: string;
  estado: InvitationStatus;
  fechaEmision: Date;
  fechaExpiracion: Date;
  montoAlquiler: number;
  moneda: Currency;
}

export type PaymentStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Payment {
  id: string;
  contratoId: string;
  propiedadId: string;
  inquilinoId: string;
  duenoId: string;
  mes: number;
  año: number;
  monto: number;
  moneda: Currency;
  comprobante?: string;
  estado: PaymentStatus;
  fechaSubida?: Date;
  fechaRevision?: Date;
  motivoRechazo?: string;
}

export type ContractStatus = 'activo' | 'finalizado' | 'cancelado';

export interface Contract {
  id: string;
  invitacionId: string;
  propiedadId: string;
  duenoId: string;
  inquilinoId: string;
  montoMensual: number;
  moneda: Currency;
  fechaInicio: Date;
  estado: ContractStatus;
}

export type NotificationType = 
  | 'invitacion_enviada'
  | 'invitacion_aceptada'
  | 'invitacion_expirada'
  | 'pago_recibido'
  | 'pago_aprobado'
  | 'pago_rechazado'
  | 'contrato_proximo_vencer';

export interface Notification {
  id: string;
  userId: string;
  tipo: NotificationType;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: Date;
  link?: string;
}

// Messages types
export type MessageType = 'text' | 'image';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
}

export type ConversationType = 'consulta_propiedad' | 'contrato_activo' | 'pago_comprobante' | 'general';

export interface Conversation {
  id: string;
  participants: string[]; // array of user IDs
  propertyId?: string;
  type: ConversationType;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: { [userId: string]: number }; // unread count per user
  createdAt: Date;
}