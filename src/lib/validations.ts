import { z } from 'zod';

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  correo: z.string({ error: 'Por favor completa el correo' }).email('Correo electrónico inválido'),
  contraseña: z.string({ error: 'Por favor completa la contraseña' }).min(1, 'La contraseña es requerida'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Registro ─────────────────────────────────────────────────────────────────
const registroFields = {
  nombre: z.string({ error: 'Por favor completa tu nombre' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string({ error: 'Por favor completa el correo' }).email('Correo electrónico inválido'),
  telefono: z.string({ error: 'Por favor completa el teléfono' }).min(8, 'El teléfono debe tener al menos 8 dígitos'),
  contraseña: z
    .string({ error: 'Por favor completa la contraseña' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  confirmarContraseña: z.string({ error: 'Por favor confirma la contraseña' }),
};

export const registroFormSchema = z.object(registroFields).refine(
  (data) => data.contraseña === data.confirmarContraseña,
  { message: 'Las contraseñas no coinciden', path: ['confirmarContraseña'] },
);

export const registroSchema = z.object({
  ...registroFields,
  rol: z.enum(['dueño', 'inquilino'] as const, { error: 'Selecciona un rol' }),
}).refine(
  (data) => data.contraseña === data.confirmarContraseña,
  { message: 'Las contraseñas no coinciden', path: ['confirmarContraseña'] },
);
export type RegistroFormData = z.infer<typeof registroSchema>;

// ─── Propiedad (crear / editar) ──────────────────────────────────────────────
export const propiedadSchema = z.object({
  titulo: z.string({ error: 'Por favor completa el título' }).min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z
    .string({ error: 'Por favor completa la descripción' })
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z
    .coerce.number({ error: 'Por favor ingresa el precio' })
    .min(1, 'El precio debe ser mayor a 0'),
  moneda: z.enum(['CRC', 'USD'] as const),
  tipo: z.enum(['casa', 'apartamento', 'local', 'bodega', 'oficina'] as const, {
    error: 'Por favor selecciona el tipo',
  }),
  provincia: z.string({ error: 'Por favor selecciona la provincia' }).min(1),
  canton: z.string({ error: 'Por favor ingresa el cantón' }).min(1),
  distrito: z.string({ error: 'Por favor ingresa el distrito' }).min(1),
  caracteristicas: z.array(z.string()).default([]),
  imagenes: z.array(z.string()).min(1, 'Agrega al menos una imagen'),
  estado: z.enum(['disponible', 'alquilada', 'mantenimiento'] as const).optional(),
});
export type PropiedadFormData = z.infer<typeof propiedadSchema>;

// ─── Invitación ───────────────────────────────────────────────────────────────
export const invitacionSchema = z.object({
  inquilinoCorreo: z
    .literal('')
    .or(z.string().email('Correo electrónico inválido')),
  propiedadId: z.string({ error: 'Por favor selecciona la propiedad' }).min(1),
  montoAlquiler: z
    .coerce.number({ error: 'Por favor ingresa el monto de alquiler' })
    .min(1, 'El monto debe ser mayor a 0'),
  montoDeposito: z
    .coerce.number({ error: 'Por favor ingresa el monto del depósito' })
    .min(0, 'El depósito no puede ser negativo'),
  moneda: z.enum(['CRC', 'USD'] as const),
});
export type InvitacionFormData = z.infer<typeof invitacionSchema>;

// ─── Perfil ───────────────────────────────────────────────────────────────────
export const perfilSchema = z.object({
  nombre: z.string({ error: 'Por favor completa tu nombre' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string({ error: 'Por favor completa el correo' }).email('Correo electrónico inválido'),
  telefono: z.string().optional(),
});
export type PerfilFormData = z.infer<typeof perfilSchema>;

// ─── Comprobante de pago ─────────────────────────────────────────────────────
// Este se maneja diferente porque es un file upload, no un formulario tradicional.
// Solo validamos los campos de selección de mes/año/tipo.
export const comprobanteSchema = z.object({
  mes: z.string(),
  año: z.string(),
  tipoPago: z.enum(['mensualidad', 'deposito'] as const),
});
export type ComprobanteFormData = z.infer<typeof comprobanteSchema>;
