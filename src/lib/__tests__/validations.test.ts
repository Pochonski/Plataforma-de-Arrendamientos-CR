import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registroSchema,
  propiedadSchema,
  invitacionSchema,
  perfilSchema,
  comprobanteSchema,
} from '../validations';

// ─── Login ────────────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('should accept valid login data', () => {
    const result = loginSchema.safeParse({ correo: 'test@example.com', contraseña: 'password123' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({ correo: 'not-an-email', contraseña: 'password123' });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({ correo: 'test@example.com', contraseña: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing correo', () => {
    const result = loginSchema.safeParse({ contraseña: 'password123' });
    expect(result.success).toBe(false);
  });
});

// ─── Registro ─────────────────────────────────────────────────────────────────

describe('registroSchema', () => {
  it('should accept valid registration data', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password1',
      confirmarContraseña: 'Password1',
      rol: 'dueño',
    });
    expect(result.success).toBe(true);
  });

  it('should reject short password (less than 8 chars)', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Ab1',
      confirmarContraseña: 'Ab1',
      rol: 'dueño',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password without uppercase', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'password123',
      confirmarContraseña: 'password123',
      rol: 'dueño',
    });
    expect(result.success).toBe(false);
  });

  it('should reject password without number', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password',
      confirmarContraseña: 'Password',
      rol: 'dueño',
    });
    expect(result.success).toBe(false);
  });

  it('should reject mismatched passwords', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password1',
      confirmarContraseña: 'Password2',
      rol: 'dueño',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short nombre', () => {
    const result = registroSchema.safeParse({
      nombre: 'J',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password1',
      confirmarContraseña: 'Password1',
      rol: 'dueño',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid rol', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password1',
      confirmarContraseña: 'Password1',
      rol: 'admin',
    });
    expect(result.success).toBe(false);
  });

  it('should accept "inquilino" rol', () => {
    const result = registroSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
      contraseña: 'Password1',
      confirmarContraseña: 'Password1',
      rol: 'inquilino',
    });
    expect(result.success).toBe(true);
  });
});

// ─── Propiedad ────────────────────────────────────────────────────────────────

describe('propiedadSchema', () => {
  it('should accept valid property data', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa hermosa en la playa',
      descripcion: 'Una casa muy bonita con vista al mar',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(true);
  });

  it('should coerce string precio to number', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa hermosa',
      descripcion: 'Una descripción larga suficiente',
      precio: '150000',
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.precio).toBe(150000);
  });

  it('should reject short titulo (less than 5 chars)', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa',
      descripcion: 'Una descripción larga suficiente',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject short descripcion (less than 10 chars)', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Corta',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject precio 0 or less', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 0,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid moneda', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 150000,
      moneda: 'EUR',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid tipo', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'hotel',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty imagenes', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: [],
    });
    expect(result.success).toBe(false);
  });

  it('should default caracteristicas to empty array', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.caracteristicas).toEqual([]);
  });

  it('should accept optional estado', () => {
    const result = propiedadSchema.safeParse({
      titulo: 'Casa bonita',
      descripcion: 'Descripción suficiente',
      precio: 150000,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: 'Guanacaste',
      canton: 'Santa Cruz',
      distrito: 'Tamarindo',
      imagenes: ['url1.jpg'],
      estado: 'disponible',
    });
    expect(result.success).toBe(true);
  });
});

// ─── Invitación ───────────────────────────────────────────────────────────────

describe('invitacionSchema', () => {
  it('should accept valid invitation data', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'inquilino@example.com',
      propiedadId: 'prop123',
      montoAlquiler: 200000,
      montoDeposito: 200000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty email (literal "")', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: '',
      propiedadId: 'prop123',
      montoAlquiler: 200000,
      montoDeposito: 200000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'invalid-email',
      propiedadId: 'prop123',
      montoAlquiler: 200000,
      montoDeposito: 200000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty propiedadId', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'test@example.com',
      propiedadId: '',
      montoAlquiler: 200000,
      montoDeposito: 200000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(false);
  });

  it('should coerce string montoAlquiler to number', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'test@example.com',
      propiedadId: 'prop123',
      montoAlquiler: '200000',
      montoDeposito: 50000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.montoAlquiler).toBe(200000);
  });

  it('should reject montoAlquiler 0 or less', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'test@example.com',
      propiedadId: 'prop123',
      montoAlquiler: 0,
      montoDeposito: 50000,
      moneda: 'CRC',
    });
    expect(result.success).toBe(false);
  });

  it('should accept montoDeposito 0', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'test@example.com',
      propiedadId: 'prop123',
      montoAlquiler: 200000,
      montoDeposito: 0,
      moneda: 'CRC',
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative montoDeposito', () => {
    const result = invitacionSchema.safeParse({
      inquilinoCorreo: 'test@example.com',
      propiedadId: 'prop123',
      montoAlquiler: 200000,
      montoDeposito: -1,
      moneda: 'CRC',
    });
    expect(result.success).toBe(false);
  });
});

// ─── Perfil ───────────────────────────────────────────────────────────────────

describe('perfilSchema', () => {
  it('should accept valid profile data', () => {
    const result = perfilSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should accept profile with optional telefono', () => {
    const result = perfilSchema.safeParse({
      nombre: 'Juan',
      correo: 'juan@example.com',
      telefono: '88888888',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = perfilSchema.safeParse({
      nombre: 'Juan',
      correo: 'not-email',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short nombre', () => {
    const result = perfilSchema.safeParse({
      nombre: 'A',
      correo: 'juan@example.com',
    });
    expect(result.success).toBe(false);
  });
});

// ─── Comprobante ──────────────────────────────────────────────────────────────

describe('comprobanteSchema', () => {
  it('should accept valid comprobante data', () => {
    const result = comprobanteSchema.safeParse({
      mes: '6',
      año: '2024',
      tipoPago: 'mensualidad',
    });
    expect(result.success).toBe(true);
  });

  it('should accept deposito tipoPago', () => {
    const result = comprobanteSchema.safeParse({
      mes: '6',
      año: '2024',
      tipoPago: 'deposito',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid tipoPago', () => {
    const result = comprobanteSchema.safeParse({
      mes: '6',
      año: '2024',
      tipoPago: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const result = comprobanteSchema.safeParse({ mes: '6' });
    expect(result.success).toBe(false);
  });
});
