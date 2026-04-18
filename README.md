# 🏠 Plataforma de Arrendamientos - Costa Rica

Una solución completa y moderna para la gestión de alquileres en Costa Rica, diseñada para facilitar la interacción entre propietarios e inquilinos de manera profesional, segura y transparente.

![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![React Router](https://img.shields.io/badge/React_Router-7-ca4245?style=for-the-badge&logo=react-router)
![Azure APIM](https://img.shields.io/badge/Azure_APIM-0078D4?style=for-the-badge&logo=microsoft-azure)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google)

## 📋 Descripción

Esta plataforma web permite a propietarios publicar y gestionar sus propiedades en alquiler, mientras que los inquilinos pueden buscar, visualizar propiedades y gestionar sus contratos y pagos de forma centralizada. Todo el proceso, desde la búsqueda hasta la gestión mensual de pagos, está optimizado para el mercado costarricense.

## ✨ Características Principales

### Para Propietarios (Dueños)
- 📊 **Dashboard** con estadísticas en tiempo real y vista unificada.
- 🏢 **Gestión completa de propiedades** (CRUD integral).
- 📧 **Sistema de invitaciones** para arrendamientos con enlaces únicos.
- 💰 **Revisión y aprobación** fluida de comprobantes de pago recibidos.
- 📱 **Notificaciones automáticas** de alertas y actualizaciones.
- 💬 **Mensajería** directa con inquilinos.
- 📈 **Historial completo** transaccional con opción de exportación a Excel.

### Para Inquilinos
- 🔍 **Catálogo de propiedades** apoyado por filtros avanzados y búsqueda optimizada.
- 📄 **Visualización detallada** de unidades y comodidades.
- ✉️ **Acceso simplificado** vía aceptación de invitaciones de contrato.
- 💳 **Registro de pagos** cargando comprobantes de SINPE/transferencia.
- 📋 **Control de contratos** activos y estatus de mensualidades.
- 💬 **Canal de comunicación** rápido con propietarios.

### Funcionalidades Generales
- 🌓 **Modo claro/oscuro persistente** y diseño visual avanzado y premium.
- 📱 **100% Responsive**, adaptado a móviles y escritorio.
- 🔐 **Autenticación por roles** soportando tanto credenciales como **Google OAuth**.
- ☁️ **Integración de servicios** con un Backend simulado ágil soportado por **Azure API Management**.
- 🎨 **Interfaz de usuario consistente** estructurada mediante `Shadcn/ui` y `Tailwind CSS`.
- ⚡ **Rendimiento superior** y UX intuitiva.

## 🛠️ Tecnologías

### Core
- **React 18.3** - Arquitectura de componentes 
- **TypeScript** - Tipado estático y robustez
- **React Router 7** - Enrutamiento dinámico tipo SPA
- **Tailwind CSS v4** - Sistema principal de estilos

### Componentes y UI
- **Shadcn/ui** - Elementos accesibles y consistentes
- **Material UI** - Componentes selectos para utilidades extra
- **Lucide React** - Sistema icónico
- **Motion (Framer)** - Animaciones avanzadas y transiciones continuas.

### Utilidades y Servicios Mapeados
- **Azure API Management** - Middleware proxy y mock para validación de endpoints.
- **Google OAuth 2.0 (`@react-oauth/google`)** - Integración de autenticación con cuentas de Google.
- **jsPDF y xlsx** - Procesamiento documental exportando contratos en PDF y finanzas en hojas de cálculo.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- Gestor de paquetes: `npm`, `yarn` o `pnpm`

### Instalación y Configuración

```bash
# 1. Clonar el repositorio
git clone [url-del-repositorio]
cd Plataforma-de-Arrendamientos-CR

# 2. Instalar dependencias
npm install
# o con pnpm
pnpm install

# 3. Configurar Entorno
# Copia el archivo de ejemplo para configurar tus accesos de Google y Azure.
cp .env.example .env

# Abre `.env` y agrega tus credenciales: VITE_GOOGLE_CLIENT_ID, VITE_API_URL, etc.

# 4. Iniciar servidor de desarrollo en modo local
npm run dev
```

La aplicación estará disponible localmente en `http://localhost:5173`.

### Despliegue de Producción
El proyecto incluye un flujo de trabajo (`.github/workflows/deploy.yml`) para realizar el despliegue automático hacia **GitHub Pages**.

1. Sube tu código a GitHub.
2. En la pestaña **Settings** del repositorio, ve a la sección **Pages**.
3. Selecciona **GitHub Actions** en *Source*.
4. Ante cada push en rama `main`, la UI se desplegará de forma transparente.

## 👥 Usuarios de Prueba (Mock APIs)

### Dueño
- **Correo:** carlos@example.com
- **Contraseña:** cualquier texto (modo de desarrollo)

### Inquilino
- **Correo:** maria@example.com  
- **Contraseña:** cualquier texto (modo de desarrollo)

## 📁 Estructura del Proyecto

```text
/
├── docs/                # Múltiples guías de iniciación, diseño, UX y diagramas Figma
├── src/
│   ├── app/
│   │   ├── components/      # Componentes fragmentados y reutilizables
│   │   │   ├── layout/      # Estructuras principales 
│   │   │   ├── shared/      # Fragmentos transversales y Shadcn components
│   │   ├── contexts/        # Auth Context & Data Context centralizado (Conexión APIM)
│   │   ├── pages/           # Vistas core (Dashboard, Auth, Landing)
│   │   ├── types/           # Entidades genéricas TypeScript
│   │   ├── App.tsx          # Wrapper principal Auth&Theming
│   │   └── routes.tsx       # Mapeo universal de rutas
│   └── styles/              # Capa de estilos base y globals
├── .env.example             # Plantilla de variables de entorno (Oauth, APIM)
├── package.json
└── README.md
```

## 📄 Páginas Implementadas (25+)

### Públicas (9)
✅ Landing page | ✅ Login | ✅ Registro | ✅ Catálogo | ✅ Detalle propiedad | ✅ Invitación | ✅ Recuperación | ✅ Pág. 404 | ✅ Documentación de Diseño Visual

### Dashboard Propietario (11)
✅ Dashboard central | ✅ Gestión Propiedades (Crear/Editar/Ver) | ✅ Gestión Invitaciones | ✅ Pagos recibidos | ✅ Mensajería | ✅ Historial | ✅ Notificaciones | ✅ Perfil

### Dashboard Inquilino (7)
✅ Dashboard inquilino | ✅ Mi contrato (Detalle) | ✅ Envío de comprobantes | ✅ Mensajería | ✅ Historial | ✅ Notificaciones | ✅ Perfil

## 🔄 Flujo Completo

1. **Dueño** publica una propiedad tras crear un perfil.
2. **Dueño** genera invitación con enlace único que remite vía canal externo.
3. **Inquilino** ingresa o crea cuenta a partir del enlace brindado.
4. **Sistema** procesa la invitación y sella un contrato validado.
5. **Inquilino** reporta su pago SINPE o transferencia en la plataforma.
6. **Dueño** notificado, aprueba o rechaza el pago validando saldo reflejado.
7. **Información continua**, notificaciones y exportabilidad se habilitan para ambas partes.

## 💾 Persistencia de Datos

Para operar los flujos sin depender estrictamente de una Base de Datos rígida en fases preliminares, el sistema está estructurado sobre **Azure API Management** actuando de mock y proxy (con `fetch` points sobre una Cloud URL asignada en el archivo `.env`). 
Esta configuración expone respuestas reales asíncronas para autenticación de usuarios, retención de tickets y notificaciones. 

## 🚧 Próximos Pasos para Producción

- [X] Configuración y validaciones completas Azure APIM y Front CORS. 
- [X] Autenticación básica multi-rol e interceptores con AuthContext.
- [X] Google OAuth implementation.
- [X] Generación integral de KPIs, reportes y PDFs (jsPDF).
- [X] Exportaciones Excel con SheetJS.
- [ ] Backend productivo permanente (por ej. Node.js/Estuctura Serverless y DB PostgreSQL).
- [ ] Sistema transaccional pasarela de pagos integradas (Stripe/Nacionales).
- [ ] Implementación de WebSockets paralelos para mensajería síncrona.

## 🤝 Contribución

Este proyecto aplica bajo metodologías ágiles a modo de portfolio.
1. Haz un Fork del proyecto.
2. Crea una rama `feature/` y comprométete (`git commit`).
3. Empuja tus cambios a la rama en origin.
4. Abre el Pull Request con detalle de tus alcances en código e interfaz.

## 📝 Licencia

Distribuido bajo licencia **MIT**. Para más detalles, por favor consultar el archivo [LICENSE](LICENSE). Desarrollado con ❤️ para el mercado de arrendamientos en Costa Rica.
