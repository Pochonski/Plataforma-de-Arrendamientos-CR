# Usuarios de Prueba - Plataforma de Arrendamientos CR

## Credenciales de Acceso

### Dueño / Arrendador
- **Correo:** carlos@example.com
- **Contraseña:** cualquier contraseña (demo)
- **Rol:** Dueño
- **Funcionalidades:**
  - Publicar y gestionar propiedades
  - Crear invitaciones de contrato
  - Revisar y aprobar comprobantes de pago
  - Ver historial de pagos recibidos
  - Dashboard con estadísticas
  - Sistema de mensajería con inquilinos

### Inquilino
- **Correo:** maria@example.com
- **Contraseña:** cualquier contraseña (demo)
- **Rol:** Inquilino
- **Funcionalidades:**
  - Ver y buscar propiedades
  - Aceptar invitaciones de contrato
  - Subir comprobantes de pago
  - Ver historial de pagos
  - Dashboard personalizado
  - Sistema de mensajería con dueños

## Flujo de Prueba Recomendado

### Para Dueños:
1. Iniciar sesión con carlos@example.com
2. Explorar el dashboard (ya tiene 3 propiedades pre-cargadas)
3. Ir a "Mis propiedades" para ver el listado completo
4. Crear una nueva propiedad con el formulario completo
5. Editar o eliminar propiedades existentes
6. Crear una invitación de contrato y copiar el enlace
7. Ver y gestionar invitaciones enviadas
8. Revisar comprobantes de pago pendientes
9. Aprobar o rechazar pagos
10. Comunicarse con inquilinos vía mensajes

### Para Inquilinos:
1. Crear una nueva cuenta o usar maria@example.com
2. Explorar el catálogo de propiedades con filtros
3. Ver detalles completos de una propiedad
4. Aceptar una invitación de contrato (usando enlace del dueño)
5. Subir comprobantes de pago mensual (SINPE o transferencia)
6. Ver historial completo de pagos
7. Revisar el estado del contrato activo
8. Comunicarse con el dueño vía mensajes
9. Actualizar perfil y preferencias

### Flujo Completo E2E:
1. **Dueño**: Crear una nueva propiedad
2. **Dueño**: Crear invitación de contrato para esa propiedad
3. **Dueño**: Copiar enlace de invitación
4. **Inquilino**: Acceder al enlace e iniciar sesión (si es necesario)
5. **Inquilino**: Revisar detalles y aceptar la invitación
6. **Sistema**: Se crea automáticamente el contrato
7. **Inquilino**: Subir primer comprobante de pago
8. **Dueño**: Recibir notificación de pago pendiente
9. **Dueño**: Revisar y aprobar/rechazar el comprobante
10. **Inquilino**: Recibir notificación del resultado
11. **Ambos**: Comunicarse vía sistema de mensajes

## Propiedades Pre-cargadas

1. **Apartamento moderno en Escazú**
   - Precio: ₡650,000/mes
   - Ubicación: San Rafael, Escazú, San José
   - 2 habitaciones, 2 baños

2. **Casa amplia en Heredia Centro**
   - Precio: ₡850,000/mes
   - Ubicación: Mercedes, Heredia
   - 3 habitaciones, 2.5 baños

3. **Estudio en Sabana**
   - Precio: ₡450,000/mes
   - Ubicación: Mata Redonda, San José
   - 1 habitación, 1 baño

## Páginas Implementadas (25 totales)

### Públicas (7):
- ✅ Landing page con secciones completas
- ✅ Login con validación
- ✅ Registro de usuarios
- ✅ Catálogo de propiedades con filtros
- ✅ Detalle de propiedad
- ✅ Aceptar invitación (nueva)
- ✅ Recuperar contraseña (nueva)
- ✅ Página 404 personalizada (nueva)
- ✅ Documentación de diseño visual

### Dashboard Dueño (8):
- ✅ Dashboard principal con KPIs
- ✅ Mis propiedades (listado)
- ✅ Nueva propiedad (formulario completo)
- ✅ Editar propiedad
- ✅ Invitaciones (gestión completa)
- ✅ Nueva invitación
- ✅ Pagos recibidos (aprobar/rechazar)
- ✅ Mensajes (conversaciones con inquilinos)
- ✅ Historial completo
- ✅ Notificaciones
- ✅ Perfil

### Dashboard Inquilino (5):
- ✅ Dashboard principal personalizado
- ✅ Mi contrato (detalles completos)
- ✅ Subir comprobante de pago
- ✅ Mensajes (conversaciones con dueños)
- ✅ Historial de pagos
- ✅ Notificaciones
- ✅ Perfil

## Características Destacadas

### Diseño y UX
- ✅ Modo claro y oscuro con persistencia
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Navegación intuitiva con breadcrumbs
- ✅ Feedback visual en todas las acciones
- ✅ Mensajes de validación claros y descriptivos
- ✅ Estados de carga, vacío y error
- ✅ Animaciones sutiles y transiciones
- ✅ Componentes UI consistentes (Shadcn/ui)
- ✅ Accesibilidad mejorada (ARIA labels)

### Funcionalidades Implementadas
- ✅ Sistema de autenticación con roles diferenciados
- ✅ Catálogo de propiedades con filtros avanzados
- ✅ CRUD completo de propiedades con imágenes
- ✅ Sistema de invitaciones con tokens únicos
- ✅ Flujo completo de aceptación de invitaciones
- ✅ Creación automática de contratos
- ✅ Carga de comprobantes (SINPE/transferencia)
- ✅ Aprobación/rechazo de pagos
- ✅ Sistema de mensajería completo
- ✅ Conversaciones contextuales (por propiedad, contrato)
- ✅ Notificaciones en tiempo real
- ✅ Dashboards diferenciados por rol
- ✅ Gestión completa de perfil
- ✅ Historial de transacciones
- ✅ Recuperación de contraseña
- ✅ Página 404 personalizada

### Tecnologías Utilizadas
- React 18.3 + TypeScript
- React Router 7 (Data Mode)
- Tailwind CSS v4
- Shadcn/ui Components
- Material UI (complementario)
- Lucide React (iconos)
- next-themes (modo oscuro)
- Sonner (toast notifications)
- date-fns (manejo de fechas)
- Motion (animaciones)

## Notas Importantes

- Esta es una versión completa con datos simulados (localStorage)
- El sistema de invitaciones, contratos y mensajes está completamente funcional
- Los comprobantes se guardan como base64 en memoria (no hay backend real)
- Las validaciones están implementadas en formularios
- El sistema está listo para conectarse a una API backend real
- Todos los flujos E2E están probados y funcionan correctamente

## Próximos Pasos Sugeridos para Producción

1. **Backend y API**
   - Implementar API REST con Node.js/Express o similar
   - Conectar base de datos PostgreSQL/MongoDB
   - Sistema de autenticación JWT
   - Validaciones del lado del servidor

2. **Almacenamiento**
   - Servicio de almacenamiento para imágenes (S3, Cloudinary)
   - CDN para archivos estáticos
   - Backup automatizado de datos

3. **Comunicación**
   - Sistema de envío de emails (SendGrid, Mailgun)
   - Notificaciones push
   - SMS para alertas importantes

4. **Documentos**
   - Generación de PDFs para contratos
   - Firma electrónica de documentos
   - Templates personalizables

5. **Pagos**
   - Integración con pasarela de pagos (Stripe, PayPal)
   - SINPE Móvil API (si disponible)
   - Automatización de cobros recurrentes

6. **Seguridad**
   - Verificación de identidad (cédula CR)
   - 2FA (autenticación de dos factores)
   - Encriptación end-to-end para mensajes
   - Rate limiting y DDOS protection

7. **Características Avanzadas**
   - Sistema de calificaciones y reviews
   - Búsqueda avanzada con geolocalización
   - Recomendaciones personalizadas
   - Analytics y reportes exportables
   - App móvil nativa (React Native)

8. **Compliance**
   - Cumplimiento GDPR y protección de datos
   - Términos y condiciones específicos para CR
   - Política de privacidad actualizada
   - Respaldo legal para contratos digitales