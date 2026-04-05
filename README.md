# 🏠 Plataforma de Arrendamientos - Costa Rica

Una solución completa y moderna para la gestión de alquileres en Costa Rica, diseñada para facilitar la interacción entre propietarios e inquilinos de manera profesional, segura y transparente.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![React Router](https://img.shields.io/badge/React_Router-7-red)

## 📋 Descripción

Esta plataforma web permite a propietarios publicar y gestionar sus propiedades en alquiler, mientras que los inquilinos pueden buscar, visualizar propiedades y gestionar sus contratos y pagos de forma centralizada. Todo el proceso desde la búsqueda hasta la gestión mensual de pagos está optimizado para el mercado costarricense.

## ✨ Características Principales

### Para Propietarios (Dueños)
- 📊 Dashboard con estadísticas en tiempo real
- 🏢 Gestión completa de propiedades (CRUD)
- 📧 Sistema de invitaciones con enlaces únicos
- 💰 Revisión y aprobación de comprobantes de pago
- 📱 Notificaciones automáticas
- 💬 Sistema de mensajería con inquilinos
- 📈 Historial completo de transacciones

### Para Inquilinos
- 🔍 Catálogo de propiedades con filtros avanzados
- 📄 Visualización detallada de propiedades
- ✉️ Aceptación de invitaciones de contrato
- 💳 Subida de comprobantes (SINPE/transferencia)
- 📋 Gestión de contrato activo
- 💬 Comunicación directa con propietarios
- 📊 Historial de pagos realizados

### Funcionalidades Generales
- 🌓 Modo claro/oscuro persistente
- 📱 Diseño 100% responsive
- 🔐 Sistema de autenticación por roles
- 🔔 Notificaciones en tiempo real
- 🎨 UI moderna y consistente (Shadcn/ui)
- ♿ Accesibilidad mejorada
- ⚡ Rendimiento optimizado
- 🎯 UX intuitiva y fluida

## 🛠️ Tecnologías

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript** - Type safety
- **React Router 7** - Routing (Data Mode)
- **Tailwind CSS v4** - Estilos utility-first

### UI Components
- **Shadcn/ui** - Componentes base
- **Material UI** - Componentes complementarios
- **Lucide React** - Sistema de iconos
- **Motion** - Animaciones fluidas

### Utilidades
- **next-themes** - Gestión de temas
- **Sonner** - Toast notifications
- **date-fns** - Manejo de fechas
- **react-hook-form** - Gestión de formularios

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install
# o
pnpm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 👥 Usuarios de Prueba

### Dueño
- **Correo:** carlos@example.com
- **Contraseña:** cualquier texto (modo demo)

### Inquilino
- **Correo:** maria@example.com  
- **Contraseña:** cualquier texto (modo demo)

## 📁 Estructura del Proyecto

```
/
├── src/
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── layout/      # Layouts (Public, Dashboard)
│   │   │   ├── shared/      # Componentes compartidos
│   │   │   └── ui/          # Componentes UI (Shadcn)
│   │   ├── contexts/        # Context providers (Auth, Data)
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   └── dashboard/   # Páginas del dashboard
│   │   ├── types/           # Definiciones TypeScript
│   │   ├── App.tsx          # Componente raíz
│   │   └── routes.tsx       # Configuración de rutas
│   └── styles/              # Estilos globales
├── package.json
└── README.md
```

## 📄 Páginas Implementadas (25)

### Páginas Públicas (9)
- ✅ Landing page
- ✅ Login
- ✅ Registro
- ✅ Catálogo de propiedades
- ✅ Detalle de propiedad
- ✅ Aceptar invitación
- ✅ Recuperar contraseña
- ✅ Página 404
- ✅ Documentación de diseño

### Dashboard Dueño (11)
- ✅ Dashboard principal
- ✅ Mis propiedades
- ✅ Nueva propiedad
- ✅ Editar propiedad
- ✅ Invitaciones
- ✅ Nueva invitación
- ✅ Pagos recibidos
- ✅ Mensajes
- ✅ Historial
- ✅ Notificaciones
- ✅ Perfil

### Dashboard Inquilino (7)
- ✅ Dashboard principal
- ✅ Mi contrato
- ✅ Subir comprobante
- ✅ Mensajes
- ✅ Historial de pagos
- ✅ Notificaciones
- ✅ Perfil

## 🔄 Flujo de Uso Completo

1. **Dueño** crea y publica una propiedad
2. **Dueño** genera una invitación de contrato con enlace único
3. **Inquilino** recibe y accede al enlace de invitación
4. **Inquilino** revisa detalles y acepta la invitación
5. **Sistema** crea automáticamente el contrato
6. **Inquilino** sube comprobante de pago mensual
7. **Dueño** recibe notificación y revisa el comprobante
8. **Dueño** aprueba o rechaza el pago con feedback
9. **Inquilino** recibe notificación del resultado
10. **Ambos** pueden comunicarse vía mensajes internos

## 🎨 Diseño

El proyecto incluye documentación visual completa accesible en `/design-docs` con:
- Wireframes de todas las páginas
- Mockups finales implementados
- Guías de user flows
- Matriz de evaluación de diseño
- Plantillas visuales para Figma

## 🔐 Autenticación

El sistema implementa autenticación basada en roles:
- **Dueño**: Acceso completo a gestión de propiedades
- **Inquilino**: Acceso a búsqueda y gestión de contrato

*Nota: En producción se recomienda JWT + backend seguro*

## 💾 Persistencia de Datos

Actualmente utiliza **localStorage** para simular persistencia. Los datos incluyen:
- Usuarios y sesiones
- Propiedades
- Invitaciones y contratos
- Pagos y comprobantes (base64)
- Mensajes y conversaciones
- Notificaciones

## 🚧 Próximos Pasos para Producción

- [ ] Backend con API REST (Node.js/Express)
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Almacenamiento cloud para imágenes (S3/Cloudinary)
- [ ] Sistema de emails (SendGrid/Mailgun)
- [ ] Generación de PDFs para contratos
- [ ] Pasarela de pagos (Stripe/PayPal)
- [ ] Verificación de identidad
- [ ] 2FA y seguridad avanzada
- [ ] App móvil (React Native)
- [ ] Analytics y reportes

## 📚 Documentación Adicional

- [USUARIOS_PRUEBA.md](./USUARIOS_PRUEBA.md) - Guía de usuarios y flujos de prueba
- [DOCUMENTACION_UX_UI.md](./DOCUMENTACION_UX_UI.md) - Documentación de diseño UX/UI
- [GUIA_FIGMA_USER_FLOWS.md](./GUIA_FIGMA_USER_FLOWS.md) - User flows y wireframes
- [MATRIZ_EVALUACION_DISENO.md](./MATRIZ_EVALUACION_DISENO.md) - Evaluación de diseño
- [PLANTILLAS_VISUALES_FIGMA.md](./PLANTILLAS_VISUALES_FIGMA.md) - Templates visuales

## 🤝 Contribución

Este es un proyecto demo/portfolio. Para contribuciones:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 👨‍💻 Autor

Desarrollado con ❤️ para el mercado de arrendamientos en Costa Rica.

## 🙏 Agradecimientos

- Shadcn/ui por los componentes base
- Lucide por el sistema de iconos
- Unsplash por las imágenes de demostración
- La comunidad de React por las excelentes herramientas

---

**Nota:** Esta es una versión demo con datos simulados. Para uso en producción, se requiere implementar un backend completo con medidas de seguridad apropiadas.
