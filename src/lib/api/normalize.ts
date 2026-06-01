import type {
  Property, PropertyType, PropertyStatus, Currency,
  Contract, ContractStatus, DepositStatus,
  Invitation, InvitationStatus,
  Payment, PaymentType, PaymentStatus,
  Message, MessageType, MessageStatus,
  Notification,
  Conversation,
} from '@/app/types';

// ---------------------------------------------------------------------------
// APIM raw types — field names as the backend returns them
// ---------------------------------------------------------------------------

interface APIMProperty {
  id?: string;
  titulo?: string;
  descripcion?: string;
  precio?: number | string;
  moneda?: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
  tipo?: string;
  estado?: string;
  imagenes?: string[];
  duenoId?: string;
  idDueno?: string;
  caracteristicas?: string[];
  amenidades?: string[];
  createdAt?: string;
  fechaCreacion?: string;
}

interface APIMContract {
  id?: string;
  invitacionId?: string;
  idInvitacion?: string;
  propiedadId?: string;
  idPropiedad?: string;
  duenoId?: string;
  idDueno?: string;
  inquilinoId?: string;
  idInquilino?: string;
  montoMensual?: number;
  montoDeposito?: number;
  deposito?: number;
  moneda?: string;
  fechaInicio?: string;
  estado?: string;
  estadoDeposito?: string;
}

interface APIMInvitation {
  id?: string;
  token?: string;
  propiedadId?: string;
  idPropiedad?: string;
  duenoId?: string;
  idDueno?: string;
  inquilinoCorreo?: string;
  correoInvitado?: string;
  inquilinoId?: string;
  idInquilino?: string;
  estado?: string;
  fechaEmision?: string;
  fechaEnvio?: string;
  fechaExpiracion?: string;
  montoAlquiler?: number;
  montoMensual?: number;
  montoDeposito?: number;
  deposito?: number;
  moneda?: string;
}

interface APIMPayment {
  id?: string;
  tipo?: string;
  contratoId?: string;
  idContrato?: string;
  propiedadId?: string;
  idPropiedad?: string;
  duenoId?: string;
  idDueno?: string;
  inquilinoId?: string;
  idInquilino?: string;
  mes?: number;
  año?: number;
  monto?: number;
  moneda?: string;
  comprobante?: string;
  estado?: string;
  fechaSubida?: string;
  fechaRevision?: string;
  motivoRechazo?: string;
}

interface APIMMessage {
  id?: string;
  idMensaje?: string;
  conversationId?: string;
  idConversacion?: string;
  conversacionId?: string;
  senderId?: string;
  idRemitente?: string;
  remitenteId?: string;
  receiverId?: string;
  idDestinatario?: string;
  destinatarioId?: string;
  content?: string;
  contenido?: string;
  mensaje?: string;
  type?: string;
  tipo?: string;
  status?: string;
  estado?: string;
  timestamp?: string;
  fecha?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMPTY = 'string';

const isGeneric = (v: unknown): boolean => typeof v === 'string' && v === EMPTY;

function parseCurrency(v: unknown): Currency {
  return (typeof v === 'string' && ['CRC', 'USD'].includes(v)) ? (v as Currency) : 'CRC';
}

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------

export function normalizeProperty(raw: APIMProperty): Property {
  let precio = 0;
  if (typeof raw.precio === 'number') {
    precio = raw.precio;
  } else if (typeof raw.precio === 'string') {
    precio = parseFloat(raw.precio);
    if (isNaN(precio)) precio = 0;
  }

  return {
    id: !raw.id || isGeneric(raw.id) ? `mock-${Math.random().toString(36).substr(2, 9)}` : raw.id,
    titulo: isGeneric(raw.titulo) ? 'Propiedad Nueva' : (raw.titulo ?? ''),
    descripcion: isGeneric(raw.descripcion) ? '' : (raw.descripcion ?? ''),
    precio,
    moneda: parseCurrency(raw.moneda),
    provincia: isGeneric(raw.provincia) ? '' : (raw.provincia ?? ''),
    canton: isGeneric(raw.canton) ? '' : (raw.canton ?? ''),
    distrito: isGeneric(raw.distrito) ? '' : (raw.distrito ?? ''),
    tipo: (isGeneric(raw.tipo) ? 'apartamento' : (raw.tipo ?? 'apartamento')) as PropertyType,
    estado: (['disponible', 'alquilada', 'mantenimiento'].includes(raw.estado ?? '')
      ? raw.estado
      : raw.estado === 'alquilado' ? 'alquilada' : 'disponible') as PropertyStatus,
    imagenes: Array.isArray(raw.imagenes) ? raw.imagenes.filter((i: string) => !isGeneric(i)) : [],
    duenoId: raw.duenoId ?? raw.idDueno ?? '',
    caracteristicas: Array.isArray(raw.caracteristicas)
      ? raw.caracteristicas.filter((c: string) => !isGeneric(c))
      : Array.isArray(raw.amenidades) ? raw.amenidades.filter((a: string) => !isGeneric(a)) : [],
    createdAt: new Date(raw.createdAt ?? raw.fechaCreacion ?? Date.now()),
  };
}

export function denormalizeProperty(p: Partial<Property>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...p };
  if (p.duenoId) { raw['idDueno'] = p.duenoId; delete raw['duenoId']; }
  if (p.caracteristicas) { raw['amenidades'] = p.caracteristicas; delete raw['caracteristicas']; }
  if (p.createdAt instanceof Date) { raw['fechaCreacion'] = p.createdAt.toISOString(); delete raw['createdAt']; }
  return raw;
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

export function normalizeContract(raw: APIMContract): Contract {
  return {
    id: raw.id ?? '',
    invitacionId: raw.invitacionId ?? raw.idInvitacion ?? '',
    propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
    duenoId: raw.duenoId ?? raw.idDueno ?? '',
    inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? '',
    montoMensual: raw.montoMensual ?? 0,
    montoDeposito: raw.montoDeposito ?? raw.deposito ?? 0,
    moneda: parseCurrency(raw.moneda),
    fechaInicio: new Date(raw.fechaInicio ?? Date.now()),
    estado: (raw.estado ?? 'activo') as ContractStatus,
    estadoDeposito: (raw.estadoDeposito ?? 'pendiente') as DepositStatus,
  };
}

export function denormalizeContract(c: Partial<Contract>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...c };
  if (c.invitacionId) { raw['idInvitacion'] = c.invitacionId; delete raw['invitacionId']; }
  if (c.propiedadId) { raw['idPropiedad'] = c.propiedadId; delete raw['propiedadId']; }
  if (c.duenoId) { raw['idDueno'] = c.duenoId; delete raw['duenoId']; }
  if (c.inquilinoId) { raw['idInquilino'] = c.inquilinoId; delete raw['inquilinoId']; }
  if (c.fechaInicio instanceof Date) { raw['fechaInicio'] = c.fechaInicio.toISOString(); }
  return raw;
}

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

export function normalizeInvitation(raw: APIMInvitation): Invitation {
  return {
    id: raw.id ?? '',
    token: raw.token ?? '',
    propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
    duenoId: raw.duenoId ?? raw.idDueno ?? '',
    inquilinoCorreo: raw.inquilinoCorreo ?? raw.correoInvitado ?? undefined,
    inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? undefined,
    estado: (raw.estado ?? 'pendiente') as InvitationStatus,
    fechaEmision: new Date(raw.fechaEmision ?? raw.fechaEnvio ?? Date.now()),
    fechaExpiracion: new Date(raw.fechaExpiracion ?? raw.fechaEnvio ?? Date.now()),
    montoAlquiler: raw.montoAlquiler ?? raw.montoMensual ?? 0,
    montoDeposito: raw.montoDeposito ?? raw.deposito ?? 0,
    moneda: parseCurrency(raw.moneda),
  };
}

export function denormalizeInvitation(inv: Partial<Invitation>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...inv };
  if (inv.propiedadId) { raw['idPropiedad'] = inv.propiedadId; delete raw['propiedadId']; }
  if (inv.duenoId) { raw['idDueno'] = inv.duenoId; delete raw['duenoId']; }
  if (inv.inquilinoId) { raw['idInquilino'] = inv.inquilinoId; delete raw['inquilinoId']; }
  if (inv.fechaEmision instanceof Date) { raw['fechaEmision'] = inv.fechaEmision.toISOString(); }
  if (inv.fechaExpiracion instanceof Date) { raw['fechaExpiracion'] = inv.fechaExpiracion.toISOString(); }
  return raw;
}

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------

export function normalizePayment(raw: APIMPayment): Payment {
  return {
    id: raw.id ?? '',
    tipo: (raw.tipo ?? 'mensualidad') as PaymentType,
    contratoId: raw.contratoId ?? raw.idContrato ?? '',
    propiedadId: raw.propiedadId ?? raw.idPropiedad ?? '',
    duenoId: raw.duenoId ?? raw.idDueno ?? '',
    inquilinoId: raw.inquilinoId ?? raw.idInquilino ?? '',
    mes: raw.mes ?? new Date().getMonth() + 1,
    año: raw.año ?? new Date().getFullYear(),
    monto: raw.monto ?? 0,
    moneda: parseCurrency(raw.moneda),
    comprobante: raw.comprobante ?? '',
    estado: (raw.estado ?? 'pendiente') as PaymentStatus,
    fechaSubida: raw.fechaSubida ? new Date(raw.fechaSubida) : new Date(),
    fechaRevision: raw.fechaRevision ? new Date(raw.fechaRevision) : undefined,
    motivoRechazo: raw.motivoRechazo,
  };
}

export function denormalizePayment(p: Partial<Payment>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...p };
  if (p.contratoId) { raw['idContrato'] = p.contratoId; delete raw['contratoId']; }
  if (p.propiedadId) { raw['idPropiedad'] = p.propiedadId; delete raw['propiedadId']; }
  if (p.inquilinoId) { raw['idInquilino'] = p.inquilinoId; delete raw['inquilinoId']; }
  if (p.duenoId) { raw['idDueno'] = p.duenoId; delete raw['duenoId']; }
  if (p.fechaSubida instanceof Date) raw['fechaSubida'] = p.fechaSubida.toISOString();
  if (p.fechaRevision instanceof Date) raw['fechaRevision'] = p.fechaRevision.toISOString();
  return raw;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export function normalizeMessage(m: APIMMessage): Message {
  return {
    id: m.id ?? m.idMensaje ?? Math.random().toString(),
    conversationId: m.conversationId ?? m.idConversacion ?? m.conversacionId ?? '',
    senderId: m.senderId ?? m.idRemitente ?? m.remitenteId ?? '',
    receiverId: m.receiverId ?? m.idDestinatario ?? m.destinatarioId ?? '',
    content: m.content ?? m.contenido ?? m.mensaje ?? '',
    type: (m.type ?? m.tipo ?? 'text') as MessageType,
    status: (m.status ?? m.estado ?? 'delivered') as MessageStatus,
    timestamp: new Date(m.timestamp ?? m.fecha ?? Date.now()),
  };
}

export function denormalizeMessage(msg: Partial<Message>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...msg };
  if (msg.conversationId) { raw['idConversacion'] = msg.conversationId; delete raw['conversationId']; }
  if (msg.senderId) { raw['idRemitente'] = msg.senderId; delete raw['senderId']; }
  if (msg.receiverId) { raw['idDestinatario'] = msg.receiverId; delete raw['receiverId']; }
  if (msg.content !== undefined) { raw['contenido'] = msg.content; delete raw['content']; }
  if (msg.type !== undefined) { raw['tipo'] = msg.type; delete raw['type']; }
  if (msg.status !== undefined) { raw['estado'] = msg.status; delete raw['status']; }
  if (msg.timestamp instanceof Date) { raw['fecha'] = msg.timestamp.toISOString(); delete raw['timestamp']; }
  return raw;
}

// ---------------------------------------------------------------------------
// Conversation (lightweight — just date parsing)
// ---------------------------------------------------------------------------

export function normalizeConversation(raw: Record<string, unknown>): Conversation {
  return {
    ...raw,
    lastMessageAt: raw.lastMessageAt ? new Date(raw.lastMessageAt as string) : undefined,
    createdAt: new Date((raw.createdAt as string) ?? Date.now()),
  } as unknown as Conversation;
}

// ---------------------------------------------------------------------------
// Notification (lightweight — just date parsing)
// ---------------------------------------------------------------------------

export function normalizeNotification(raw: Record<string, unknown>): Notification {
  return {
    ...raw,
    fecha: new Date((raw.fecha as string) ?? Date.now()),
  } as Notification;
}

export function denormalizeNotification(n: Partial<Notification>): Record<string, unknown> {
  const raw: Record<string, unknown> = { ...n };
  if (n.fecha instanceof Date) { raw['fecha'] = n.fecha.toISOString(); }
  return raw;
}
