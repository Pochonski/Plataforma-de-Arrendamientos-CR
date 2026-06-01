import { describe, it, expect } from 'vitest';
import {
  normalizeProperty, denormalizeProperty,
  normalizeContract, denormalizeContract,
  normalizePayment, denormalizePayment,
  normalizeInvitation, denormalizeInvitation,
  normalizeNotification, denormalizeNotification,
  normalizeMessage, denormalizeMessage,
  normalizeConversation,
} from '../normalize';

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------

describe('normalizeProperty', () => {
  it('should map idDueno to duenoId', () => {
    const raw = { idDueno: '123', id: '456', titulo: 'Casa bonita' };
    const result = normalizeProperty(raw);
    expect(result.duenoId).toBe('123');
  });

  it('should prefer duenoId over idDueno', () => {
    const raw = { duenoId: 'aaa', idDueno: 'bbb' };
    const result = normalizeProperty(raw);
    expect(result.duenoId).toBe('aaa');
  });

  it('should map amenidades to caracteristicas as fallback', () => {
    const raw = { amenidades: ['wifi', 'piscina'] };
    const result = normalizeProperty(raw);
    expect(result.caracteristicas).toEqual(['wifi', 'piscina']);
  });

  it('should prefer caracteristicas over amenidades', () => {
    const raw = { caracteristicas: ['a', 'b'], amenidades: ['c'] };
    const result = normalizeProperty(raw);
    expect(result.caracteristicas).toEqual(['a', 'b']);
  });

  it('should handle "string" placeholder titulo', () => {
    const raw = { titulo: 'string' };
    const result = normalizeProperty(raw);
    expect(result.titulo).toBe('Propiedad Nueva');
  });

  it('should handle "string" placeholder descripcion', () => {
    const raw = { descripcion: 'string' };
    const result = normalizeProperty(raw);
    expect(result.descripcion).toBe('');
  });

  it('should handle "string" placeholder provincia', () => {
    const raw = { provincia: 'string' };
    const result = normalizeProperty(raw);
    expect(result.provincia).toBe('');
  });

  it('should handle empty ID with mock prefix', () => {
    const raw = { id: '' };
    const result = normalizeProperty(raw);
    expect(result.id).toMatch(/^mock-/);
  });

  it('should handle "string" ID with mock prefix', () => {
    const raw = { id: 'string' };
    const result = normalizeProperty(raw);
    expect(result.id).toMatch(/^mock-/);
  });

  it('should keep valid ID as-is', () => {
    const raw = { id: 'abc-123' };
    const result = normalizeProperty(raw);
    expect(result.id).toBe('abc-123');
  });

  it('should parse precio from string to number', () => {
    const raw = { precio: '150000' };
    const result = normalizeProperty(raw);
    expect(result.precio).toBe(150000);
  });

  it('should pass through numeric precio', () => {
    const raw = { precio: 150000 };
    const result = normalizeProperty(raw);
    expect(result.precio).toBe(150000);
  });

  it('should default NaN precio to 0', () => {
    const raw = { precio: 'no-es-numero' };
    const result = normalizeProperty(raw);
    expect(result.precio).toBe(0);
  });

  it('should normalize "alquilado" estado to "alquilada"', () => {
    const raw = { estado: 'alquilado' };
    const result = normalizeProperty(raw);
    expect(result.estado).toBe('alquilada');
  });

  it('should pass through "disponible" estado', () => {
    const raw = { estado: 'disponible' };
    const result = normalizeProperty(raw);
    expect(result.estado).toBe('disponible');
  });

  it('should pass through "mantenimiento" estado', () => {
    const raw = { estado: 'mantenimiento' };
    const result = normalizeProperty(raw);
    expect(result.estado).toBe('mantenimiento');
  });

  it('should default unknown estado to "disponible"', () => {
    const raw = { estado: 'xyz' };
    const result = normalizeProperty(raw);
    expect(result.estado).toBe('disponible');
  });

  it('should handle imagenes as array', () => {
    const raw = { imagenes: ['url1.jpg', 'url2.jpg'] };
    const result = normalizeProperty(raw);
    expect(result.imagenes).toEqual(['url1.jpg', 'url2.jpg']);
  });

  it('should filter "string" placeholder from imagenes', () => {
    const raw = { imagenes: ['url1.jpg', 'string'] };
    const result = normalizeProperty(raw);
    expect(result.imagenes).toEqual(['url1.jpg']);
  });

  it('should default imagenes to empty array', () => {
    const result = normalizeProperty({});
    expect(result.imagenes).toEqual([]);
  });

  it('should parse moneda as Currency', () => {
    expect(normalizeProperty({ moneda: 'USD' }).moneda).toBe('USD');
    expect(normalizeProperty({ moneda: 'CRC' }).moneda).toBe('CRC');
  });

  it('should default moneda to CRC for unknown values', () => {
    expect(normalizeProperty({ moneda: 'EUR' }).moneda).toBe('CRC');
    expect(normalizeProperty({}).moneda).toBe('CRC');
  });

  it('should parse createdAt from string', () => {
    const raw = { createdAt: '2024-01-15T00:00:00.000Z' };
    const result = normalizeProperty(raw);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });

  it('should fall back to fechaCreacion for createdAt', () => {
    const raw = { fechaCreacion: '2024-01-15T00:00:00.000Z' };
    const result = normalizeProperty(raw);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });

  it('should prefer createdAt over fechaCreacion', () => {
    const raw = { createdAt: '2024-06-01T00:00:00.000Z', fechaCreacion: '2024-01-01T00:00:00.000Z' };
    const result = normalizeProperty(raw);
    expect(result.createdAt.toISOString()).toBe('2024-06-01T00:00:00.000Z');
  });

  it('should filter "string" placeholders from caracteristicas', () => {
    const raw = { caracteristicas: ['wifi', 'string'] };
    const result = normalizeProperty(raw);
    expect(result.caracteristicas).toEqual(['wifi']);
  });
});

describe('denormalizeProperty', () => {
  it('should map duenoId back to idDueno', () => {
    const input = { duenoId: '123', id: '456' };
    const result = denormalizeProperty(input);
    expect(result.idDueno).toBe('123');
    expect(result.duenoId).toBeUndefined();
  });

  it('should map caracteristicas back to amenidades', () => {
    const input = { caracteristicas: ['wifi', 'piscina'] };
    const result = denormalizeProperty(input);
    expect(result.amenidades).toEqual(['wifi', 'piscina']);
    expect(result.caracteristicas).toBeUndefined();
  });

  it('should convert createdAt Date to fechaCreacion ISO string', () => {
    const date = new Date('2024-01-15T00:00:00.000Z');
    const input = { createdAt: date };
    const result = denormalizeProperty(input);
    expect(result.fechaCreacion).toBe(date.toISOString());
    expect(result.createdAt).toBeUndefined();
  });

  it('should pass through non-mapped fields', () => {
    const input = { titulo: 'test', precio: 150000 };
    const result = denormalizeProperty(input);
    expect(result.titulo).toBe('test');
    expect(result.precio).toBe(150000);
  });

  it('should skip undefined optional fields', () => {
    const input = { titulo: 'test' };
    const result = denormalizeProperty(input);
    expect(result).not.toHaveProperty('precio');
    expect(result).not.toHaveProperty('duenoId');
  });
});

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

describe('normalizeContract', () => {
  it('should map idInvitacion to invitacionId', () => {
    const raw = { idInvitacion: 'inv-123' };
    const result = normalizeContract(raw);
    expect(result.invitacionId).toBe('inv-123');
  });

  it('should prefer invitacionId over idInvitacion', () => {
    const raw = { invitacionId: 'aaa', idInvitacion: 'bbb' };
    const result = normalizeContract(raw);
    expect(result.invitacionId).toBe('aaa');
  });

  it('should map idPropiedad to propiedadId', () => {
    const raw = { idPropiedad: 'prop-456' };
    const result = normalizeContract(raw);
    expect(result.propiedadId).toBe('prop-456');
  });

  it('should map idDueno to duenoId', () => {
    const raw = { idDueno: 'dueno-789' };
    const result = normalizeContract(raw);
    expect(result.duenoId).toBe('dueno-789');
  });

  it('should map idInquilino to inquilinoId', () => {
    const raw = { idInquilino: 'inq-012' };
    const result = normalizeContract(raw);
    expect(result.inquilinoId).toBe('inq-012');
  });

  it('should map deposito to montoDeposito', () => {
    const raw = { deposito: 50000 };
    const result = normalizeContract(raw);
    expect(result.montoDeposito).toBe(50000);
  });

  it('should prefer montoDeposito over deposito', () => {
    const raw = { montoDeposito: 100000, deposito: 50000 };
    const result = normalizeContract(raw);
    expect(result.montoDeposito).toBe(100000);
  });

  it('should parse fechaInicio to Date', () => {
    const raw = { fechaInicio: '2024-03-01T00:00:00.000Z' };
    const result = normalizeContract(raw);
    expect(result.fechaInicio).toBeInstanceOf(Date);
    expect(result.fechaInicio.toISOString()).toBe('2024-03-01T00:00:00.000Z');
  });

  it('should default estado to "activo"', () => {
    expect(normalizeContract({}).estado).toBe('activo');
  });

  it('should default estadoDeposito to "pendiente"', () => {
    expect(normalizeContract({}).estadoDeposito).toBe('pendiente');
  });

  it('should parse moneda', () => {
    expect(normalizeContract({ moneda: 'USD' }).moneda).toBe('USD');
  });

  it('should default empty id to ""', () => {
    expect(normalizeContract({}).id).toBe('');
  });
});

describe('denormalizeContract', () => {
  it('should map invitacionId back to idInvitacion', () => {
    const result = denormalizeContract({ invitacionId: 'inv-123' });
    expect(result.idInvitacion).toBe('inv-123');
    expect(result.invitacionId).toBeUndefined();
  });

  it('should map propiedadId back to idPropiedad', () => {
    const result = denormalizeContract({ propiedadId: 'prop-456' });
    expect(result.idPropiedad).toBe('prop-456');
  });

  it('should map duenoId back to idDueno', () => {
    const result = denormalizeContract({ duenoId: 'd-1' });
    expect(result.idDueno).toBe('d-1');
  });

  it('should map inquilinoId back to idInquilino', () => {
    const result = denormalizeContract({ inquilinoId: 'i-1' });
    expect(result.idInquilino).toBe('i-1');
  });

  it('should convert fechaInicio Date to ISO string', () => {
    const d = new Date('2024-03-01T00:00:00.000Z');
    const result = denormalizeContract({ fechaInicio: d });
    expect(result.fechaInicio).toBe(d.toISOString());
  });
});

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

describe('normalizeInvitation', () => {
  it('should map idPropiedad to propiedadId', () => {
    const raw = { idPropiedad: 'prop-1' };
    const result = normalizeInvitation(raw);
    expect(result.propiedadId).toBe('prop-1');
  });

  it('should map idDueno to duenoId', () => {
    const raw = { idDueno: 'd-1' };
    const result = normalizeInvitation(raw);
    expect(result.duenoId).toBe('d-1');
  });

  it('should map correoInvitado to inquilinoCorreo', () => {
    const raw = { correoInvitado: 'test@test.com' };
    const result = normalizeInvitation(raw);
    expect(result.inquilinoCorreo).toBe('test@test.com');
  });

  it('should prefer inquilinoCorreo over correoInvitado', () => {
    const raw = { inquilinoCorreo: 'a@a.com', correoInvitado: 'b@b.com' };
    const result = normalizeInvitation(raw);
    expect(result.inquilinoCorreo).toBe('a@a.com');
  });

  it('should map idInquilino to inquilinoId', () => {
    const raw = { idInquilino: 'inq-1' };
    const result = normalizeInvitation(raw);
    expect(result.inquilinoId).toBe('inq-1');
  });

  it('should default estado to "pendiente"', () => {
    expect(normalizeInvitation({}).estado).toBe('pendiente');
  });

  it('should parse fechaEmision from string', () => {
    const raw = { fechaEmision: '2024-05-01T00:00:00.000Z' };
    const result = normalizeInvitation(raw);
    expect(result.fechaEmision).toBeInstanceOf(Date);
  });

  it('should fall back fechaEmision to fechaEnvio', () => {
    const raw = { fechaEnvio: '2024-05-01T00:00:00.000Z' };
    const result = normalizeInvitation(raw);
    expect(result.fechaEmision.toISOString()).toBe('2024-05-01T00:00:00.000Z');
  });

  it('should parse fechaExpiracion from string', () => {
    const raw = { fechaExpiracion: '2024-06-01T00:00:00.000Z' };
    const result = normalizeInvitation(raw);
    expect(result.fechaExpiracion).toBeInstanceOf(Date);
  });

  it('should map montoMensual to montoAlquiler as fallback', () => {
    const raw = { montoMensual: 150000 };
    const result = normalizeInvitation(raw);
    expect(result.montoAlquiler).toBe(150000);
  });

  it('should prefer montoAlquiler over montoMensual', () => {
    const raw = { montoAlquiler: 200000, montoMensual: 150000 };
    const result = normalizeInvitation(raw);
    expect(result.montoAlquiler).toBe(200000);
  });

  it('should map deposito to montoDeposito', () => {
    const raw = { deposito: 50000 };
    const result = normalizeInvitation(raw);
    expect(result.montoDeposito).toBe(50000);
  });

  it('should parse moneda', () => {
    expect(normalizeInvitation({ moneda: 'USD' }).moneda).toBe('USD');
  });
});

describe('denormalizeInvitation', () => {
  it('should map propiedadId back to idPropiedad', () => {
    const result = denormalizeInvitation({ propiedadId: 'p-1' });
    expect(result.idPropiedad).toBe('p-1');
  });

  it('should map duenoId back to idDueno', () => {
    const result = denormalizeInvitation({ duenoId: 'd-1' });
    expect(result.idDueno).toBe('d-1');
  });

  it('should map inquilinoId back to idInquilino', () => {
    const result = denormalizeInvitation({ inquilinoId: 'i-1' });
    expect(result.idInquilino).toBe('i-1');
  });

  it('should convert fechaEmision Date to ISO string', () => {
    const d = new Date('2024-05-01T00:00:00.000Z');
    const result = denormalizeInvitation({ fechaEmision: d });
    expect(result.fechaEmision).toBe(d.toISOString());
  });

  it('should convert fechaExpiracion Date to ISO string', () => {
    const d = new Date('2024-06-01T00:00:00.000Z');
    const result = denormalizeInvitation({ fechaExpiracion: d });
    expect(result.fechaExpiracion).toBe(d.toISOString());
  });
});

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------

describe('normalizePayment', () => {
  it('should map idContrato to contratoId', () => {
    const raw = { idContrato: 'c-1' };
    const result = normalizePayment(raw);
    expect(result.contratoId).toBe('c-1');
  });

  it('should map idPropiedad to propiedadId', () => {
    const raw = { idPropiedad: 'p-1' };
    const result = normalizePayment(raw);
    expect(result.propiedadId).toBe('p-1');
  });

  it('should map idDueno to duenoId', () => {
    const raw = { idDueno: 'd-1' };
    const result = normalizePayment(raw);
    expect(result.duenoId).toBe('d-1');
  });

  it('should map idInquilino to inquilinoId', () => {
    const raw = { idInquilino: 'i-1' };
    const result = normalizePayment(raw);
    expect(result.inquilinoId).toBe('i-1');
  });

  it('should default tipo to "mensualidad"', () => {
    expect(normalizePayment({}).tipo).toBe('mensualidad');
  });

  it('should default estado to "pendiente"', () => {
    expect(normalizePayment({}).estado).toBe('pendiente');
  });

  it('should default monto to 0', () => {
    expect(normalizePayment({}).monto).toBe(0);
  });

  it('should default mes to current month', () => {
    const result = normalizePayment({});
    expect(result.mes).toBe(new Date().getMonth() + 1);
  });

  it('should default año to current year', () => {
    const result = normalizePayment({});
    expect(result.año).toBe(new Date().getFullYear());
  });

  it('should parse fechaSubida to Date', () => {
    const raw = { fechaSubida: '2024-07-01T00:00:00.000Z' };
    const result = normalizePayment(raw);
    expect(result.fechaSubida).toBeInstanceOf(Date);
  });

  it('should parse fechaRevision to Date', () => {
    const raw = { fechaRevision: '2024-07-15T00:00:00.000Z' };
    const result = normalizePayment(raw);
    expect(result.fechaRevision).toBeInstanceOf(Date);
  });

  it('should pass through motivoRechazo', () => {
    const raw = { motivoRechazo: 'Comprobante no válido' };
    const result = normalizePayment(raw);
    expect(result.motivoRechazo).toBe('Comprobante no válido');
  });

  it('should parse moneda', () => {
    expect(normalizePayment({ moneda: 'USD' }).moneda).toBe('USD');
  });
});

describe('denormalizePayment', () => {
  it('should map contratoId back to idContrato', () => {
    const result = denormalizePayment({ contratoId: 'c-1' });
    expect(result.idContrato).toBe('c-1');
    expect(result.contratoId).toBeUndefined();
  });

  it('should map propiedadId back to idPropiedad', () => {
    const result = denormalizePayment({ propiedadId: 'p-1' });
    expect(result.idPropiedad).toBe('p-1');
  });

  it('should map duenoId back to idDueno', () => {
    const result = denormalizePayment({ duenoId: 'd-1' });
    expect(result.idDueno).toBe('d-1');
  });

  it('should map inquilinoId back to idInquilino', () => {
    const result = denormalizePayment({ inquilinoId: 'i-1' });
    expect(result.idInquilino).toBe('i-1');
  });

  it('should convert fechaSubida Date to ISO string', () => {
    const d = new Date('2024-07-01T00:00:00.000Z');
    const result = denormalizePayment({ fechaSubida: d });
    expect(result.fechaSubida).toBe(d.toISOString());
  });

  it('should convert fechaRevision Date to ISO string', () => {
    const d = new Date('2024-07-15T00:00:00.000Z');
    const result = denormalizePayment({ fechaRevision: d });
    expect(result.fechaRevision).toBe(d.toISOString());
  });
});

// ---------------------------------------------------------------------------
// Invitation stands (see above tests)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

describe('normalizeMessage', () => {
  it('should use idMensaje as fallback for id', () => {
    const raw = { idMensaje: 'msg-1' };
    const result = normalizeMessage(raw);
    expect(result.id).toBe('msg-1');
  });

  it('should prefer id over idMensaje', () => {
    const raw = { id: 'aaa', idMensaje: 'bbb' };
    const result = normalizeMessage(raw);
    expect(result.id).toBe('aaa');
  });

  it('should map idConversacion to conversationId', () => {
    const raw = { idConversacion: 'conv-1' };
    const result = normalizeMessage(raw);
    expect(result.conversationId).toBe('conv-1');
  });

  it('should map conversacionId to conversationId as fallback', () => {
    const raw = { conversacionId: 'conv-2' };
    const result = normalizeMessage(raw);
    expect(result.conversationId).toBe('conv-2');
  });

  it('should map idRemitente to senderId', () => {
    const raw = { idRemitente: 'user-1' };
    const result = normalizeMessage(raw);
    expect(result.senderId).toBe('user-1');
  });

  it('should map remitenteId to senderId as fallback', () => {
    const raw = { remitenteId: 'user-2' };
    const result = normalizeMessage(raw);
    expect(result.senderId).toBe('user-2');
  });

  it('should map idDestinatario to receiverId', () => {
    const raw = { idDestinatario: 'user-3' };
    const result = normalizeMessage(raw);
    expect(result.receiverId).toBe('user-3');
  });

  it('should map destinatarioId to receiverId as fallback', () => {
    const raw = { destinatarioId: 'user-4' };
    const result = normalizeMessage(raw);
    expect(result.receiverId).toBe('user-4');
  });

  it('should use contenido as fallback for content', () => {
    const raw = { contenido: 'Hola mundo' };
    const result = normalizeMessage(raw);
    expect(result.content).toBe('Hola mundo');
  });

  it('should use mensaje as fallback for content', () => {
    const raw = { mensaje: 'Hola' };
    const result = normalizeMessage(raw);
    expect(result.content).toBe('Hola');
  });

  it('should prefer content over contenido/mensaje', () => {
    const raw = { content: 'a', contenido: 'b', mensaje: 'c' };
    const result = normalizeMessage(raw);
    expect(result.content).toBe('a');
  });

  it('should map tipo to type', () => {
    const raw = { tipo: 'image' };
    const result = normalizeMessage(raw);
    expect(result.type).toBe('image');
  });

  it('should default type to "text"', () => {
    expect(normalizeMessage({}).type).toBe('text');
  });

  it('should map estado to status', () => {
    const raw = { estado: 'read' };
    const result = normalizeMessage(raw);
    expect(result.status).toBe('read');
  });

  it('should default status to "delivered"', () => {
    expect(normalizeMessage({}).status).toBe('delivered');
  });

  it('should parse timestamp from fecha as fallback', () => {
    const raw = { fecha: '2024-08-01T00:00:00.000Z' };
    const result = normalizeMessage(raw);
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('should prefer timestamp over fecha', () => {
    const raw = { timestamp: '2024-08-01T00:00:00.000Z', fecha: '2023-01-01T00:00:00.000Z' };
    const result = normalizeMessage(raw);
    expect(result.timestamp.toISOString()).toBe('2024-08-01T00:00:00.000Z');
  });

  it('should generate numeric id when no id provided', () => {
    const result = normalizeMessage({});
    expect(result.id).toBeTruthy();
    expect(typeof result.id).toBe('string');
  });
});

describe('denormalizeMessage', () => {
  it('should map conversationId back to idConversacion', () => {
    const result = denormalizeMessage({ conversationId: 'conv-1' });
    expect(result.idConversacion).toBe('conv-1');
    expect(result.conversationId).toBeUndefined();
  });

  it('should map senderId back to idRemitente', () => {
    const result = denormalizeMessage({ senderId: 'u-1' });
    expect(result.idRemitente).toBe('u-1');
  });

  it('should map receiverId back to idDestinatario', () => {
    const result = denormalizeMessage({ receiverId: 'u-2' });
    expect(result.idDestinatario).toBe('u-2');
  });

  it('should map content back to contenido', () => {
    const result = denormalizeMessage({ content: 'Hola' });
    expect(result.contenido).toBe('Hola');
    expect(result.content).toBeUndefined();
  });

  it('should map type back to tipo', () => {
    const result = denormalizeMessage({ type: 'image' });
    expect(result.tipo).toBe('image');
  });

  it('should map status back to estado', () => {
    const result = denormalizeMessage({ status: 'read' });
    expect(result.estado).toBe('read');
  });

  it('should convert timestamp Date to fecha ISO string', () => {
    const d = new Date('2024-08-01T00:00:00.000Z');
    const result = denormalizeMessage({ timestamp: d });
    expect(result.fecha).toBe(d.toISOString());
    expect(result.timestamp).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

describe('normalizeNotification', () => {
  it('should parse fecha to Date', () => {
    const raw = { id: 'n-1', fecha: '2024-09-01T00:00:00.000Z', titulo: 'Test', mensaje: 'Msg' };
    const result = normalizeNotification(raw);
    expect(result.fecha).toBeInstanceOf(Date);
    expect(result.fecha.toISOString()).toBe('2024-09-01T00:00:00.000Z');
  });

  it('should default fecha to now when missing', () => {
    const raw = { id: 'n-2', titulo: 'T' };
    const result = normalizeNotification(raw);
    expect(result.fecha).toBeInstanceOf(Date);
  });

  it('should pass through other fields', () => {
    const raw = { id: 'n-3', titulo: 'Nueva', mensaje: 'Contenido', leida: false };
    const result = normalizeNotification(raw);
    expect(result.id).toBe('n-3');
    expect(result.titulo).toBe('Nueva');
    expect(result.mensaje).toBe('Contenido');
    expect(result.leida).toBe(false);
  });
});

describe('denormalizeNotification', () => {
  it('should convert fecha Date to ISO string', () => {
    const d = new Date('2024-09-01T00:00:00.000Z');
    const result = denormalizeNotification({ fecha: d });
    expect(result.fecha).toBe(d.toISOString());
  });
});

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

describe('normalizeConversation', () => {
  it('should parse createdAt to Date', () => {
    const raw: Record<string, unknown> = { id: 'c-1', createdAt: '2024-01-15T00:00:00.000Z' };
    const result = normalizeConversation(raw);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });

  it('should parse lastMessageAt to Date', () => {
    const raw: Record<string, unknown> = { id: 'c-1', lastMessageAt: '2024-02-01T00:00:00.000Z' };
    const result = normalizeConversation(raw);
    expect(result.lastMessageAt).toBeInstanceOf(Date);
    expect(result.lastMessageAt!.toISOString()).toBe('2024-02-01T00:00:00.000Z');
  });

  it('should default createdAt to now if missing', () => {
    const raw: Record<string, unknown> = { id: 'c-2' };
    const result = normalizeConversation(raw);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
