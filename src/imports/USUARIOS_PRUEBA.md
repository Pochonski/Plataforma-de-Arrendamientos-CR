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

## Flujo de Prueba Recomendado

### Para Dueños:
1. Iniciar sesión con carlos@example.com
2. Explorar el dashboard (ya tiene 3 propiedades pre-cargadas)
3. Ir a "Mis propiedades" para ver el listado completo
4. Crear una nueva propiedad (opcional)
5. Editar o eliminar propiedades existentes
6. Ver el sistema de invitaciones
7. Revisar pagos pendientes

### Para Inquilinos:
1. Crear una nueva cuenta o usar maria@example.com
2. Explorar el catálogo de propiedades
3. Ver detalles de una propiedad
4. Una vez en el dashboard, subir un comprobante de pago
5. Ver historial de pagos
6. Actualizar perfil

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

## Características Destacadas

### Diseño y UX
- ✅ Modo claro y oscuro
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Navegación intuitiva
- ✅ Feedback visual en todas las acciones
- ✅ Mensajes de validación claros
- ✅ Estados de carga y vacío

### Funcionalidades Implementadas
- ✅ Sistema de autenticación con roles
- ✅ Catálogo de propiedades con filtros
- ✅ CRUD completo de propiedades
- ✅ Sistema de invitaciones (UI lista)
- ✅ Carga de comprobantes con validación
- ✅ Dashboards diferenciados por rol
- ✅ Gestión de perfil
- ✅ Notificaciones (estructura lista)

### Tecnologías Utilizadas
- React 18.3
- React Router 7 (Data Mode)
- Tailwind CSS v4
- TypeScript
- Lucide React (iconos)
- Shadcn/ui components
- next-themes (modo oscuro)
- Sonner (toasts)

## Notas Importantes

- Esta es una versión MVP con datos simulados (localStorage)
- El sistema de invitaciones y contratos está estructurado pero usa placeholders
- Los comprobantes se guardan como base64 en memoria (no hay backend real)
- Las validaciones de contraseña son funcionales en el registro
- El sistema está listo para conectarse a una API backend

## Próximos Pasos Sugeridos

1. Implementar backend con API REST
2. Conectar base de datos para persistencia real
3. Sistema de envío de emails para invitaciones
4. Generación de PDFs para contratos e historial
5. Sistema de chat entre dueño e inquilino
6. Pasarela de pagos integrada
7. Verificación de identidad
8. Sistema de calificaciones y reviews
