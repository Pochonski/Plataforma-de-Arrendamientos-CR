import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Home, 
  User, 
  Building2, 
  FileText, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogIn,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Search,
  BarChart3,
  CreditCard,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Shield,
  Phone,
  Eye,
  Calendar,
  DollarSign,
  FileCheck,
  Clock,
  Send,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Filter,
  X,
  Check,
  ChevronRight,
  Star,
  BedDouble,
  Bath,
  Maximize,
  Wifi,
  Car,
  Sofa,
  Wind,
  Share2,
} from 'lucide-react';

type ViewMode = 'wireframe' | 'mockup';

export default function DesignDocs() {
  const [viewMode, setViewMode] = useState<ViewMode>('wireframe');

  const isWireframe = viewMode === 'wireframe';

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fijo */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Documentación de Diseño</h1>
              <p className="text-muted-foreground">
                Sistema de Gestión de Arrendamientos - Costa Rica
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'wireframe' ? 'default' : 'outline'}
                onClick={() => setViewMode('wireframe')}
              >
                Wireframes
              </Button>
              <Button
                variant={viewMode === 'mockup' ? 'default' : 'outline'}
                onClick={() => setViewMode('mockup')}
              >
                Mockups
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 h-auto mb-8">
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Autenticación</span>
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Público</span>
            </TabsTrigger>
            <TabsTrigger value="dueno" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard Dueño</span>
            </TabsTrigger>
            <TabsTrigger value="inquilino" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard Inquilino</span>
            </TabsTrigger>
            <TabsTrigger value="comunicacion" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comunicación</span>
            </TabsTrigger>
            <TabsTrigger value="usuario" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Usuario</span>
            </TabsTrigger>
            <TabsTrigger value="otros" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Otros</span>
            </TabsTrigger>
          </TabsList>

          {/* MÓDULO: AUTENTICACIÓN */}
          <TabsContent value="auth" className="space-y-8">
            {/* Login */}
            <ScreenCard
              title="Login"
              description="Pantalla de inicio de sesión con email y contraseña. Incluye opción de 'Recordarme', recuperación de contraseña y autenticación con Google."
              viewMode={viewMode}
            >
              {isWireframe ? <LoginWireframe /> : <LoginMockup />}
            </ScreenCard>

            {/* Registro */}
            <ScreenCard
              title="Registro"
              description="Formulario de registro con validación de contraseña (mínimo 8 caracteres, mayúscula y número). Incluye modal de selección de rol después del registro."
              viewMode={viewMode}
            >
              {isWireframe ? <RegistroWireframe /> : <RegistroMockup />}
            </ScreenCard>

            {/* Recuperar Contraseña */}
            <ScreenCard
              title="Recuperar Contraseña"
              description="Formulario para solicitar el restablecimiento de contraseña vía email."
              viewMode={viewMode}
            >
              {isWireframe ? <RecuperarPasswordWireframe /> : <RecuperarPasswordMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: PÚBLICO */}
          <TabsContent value="public" className="space-y-8">
            {/* Landing */}
            <ScreenCard
              title="Landing Page"
              description="Página principal con hero section, buscador, características principales, pasos de uso y beneficios del sistema."
              viewMode={viewMode}
            >
              {isWireframe ? <LandingWireframe /> : <LandingMockup />}
            </ScreenCard>

            {/* Catálogo de Propiedades */}
            <ScreenCard
              title="Catálogo de Propiedades"
              description="Exploración pública de propiedades con filtros por precio, ubicación y tipo. Grid de tarjetas con información básica."
              viewMode={viewMode}
            >
              {isWireframe ? <PropiedadesWireframe /> : <PropiedadesMockup />}
            </ScreenCard>

            {/* Detalle de Propiedad */}
            <ScreenCard
              title="Detalle de Propiedad"
              description="Vista detallada con galería de imágenes, descripción completa, amenidades, mapa de ubicación e información del dueño."
              viewMode={viewMode}
            >
              {isWireframe ? <PropiedadDetalleWireframe /> : <PropiedadDetalleMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: DASHBOARD DUEÑO */}
          <TabsContent value="dueno" className="space-y-8">
            {/* Dashboard Dueño */}
            <ScreenCard
              title="Dashboard Dueño"
              description="Panel principal con métricas (propiedades activas, contratos activos, ingresos mensuales), gráfico de ingresos y actividad reciente."
              viewMode={viewMode}
            >
              {isWireframe ? <DuenoDashboardWireframe /> : <DuenoDashboardMockup />}
            </ScreenCard>

            {/* Mis Propiedades */}
            <ScreenCard
              title="Mis Propiedades"
              description="Lista de propiedades del dueño con estados (disponible/ocupada), acciones de editar/eliminar y botón para nueva propiedad."
              viewMode={viewMode}
            >
              {isWireframe ? <MisPropiedadesWireframe /> : <MisPropiedadesMockup />}
            </ScreenCard>

            {/* Nueva Propiedad */}
            <ScreenCard
              title="Publicar Nueva Propiedad"
              description="Formulario completo con información básica, detalles, amenidades y carga de imágenes."
              viewMode={viewMode}
            >
              {isWireframe ? <NuevaPropiedadWireframe /> : <NuevaPropiedadMockup />}
            </ScreenCard>

            {/* Editar Propiedad */}
            <ScreenCard
              title="Editar Propiedad"
              description="Formulario pre-cargado idéntico a nueva propiedad pero con datos existentes."
              viewMode={viewMode}
            >
              {isWireframe ? <EditarPropiedadWireframe /> : <EditarPropiedadMockup />}
            </ScreenCard>

            {/* Invitaciones */}
            <ScreenCard
              title="Gestionar Invitaciones"
              description="Lista de invitaciones enviadas con estados (pendiente/aceptada/expirada) y opciones para crear nueva invitación."
              viewMode={viewMode}
            >
              {isWireframe ? <InvitacionesWireframe /> : <InvitacionesMockup />}
            </ScreenCard>

            {/* Nueva Invitación */}
            <ScreenCard
              title="Crear Invitación de Contrato"
              description="Formulario para generar invitación con selección de propiedad, datos del inquilino, precio mensual y fechas."
              viewMode={viewMode}
            >
              {isWireframe ? <NuevaInvitacionWireframe /> : <NuevaInvitacionMockup />}
            </ScreenCard>

            {/* Pagos Recibidos */}
            <ScreenCard
              title="Pagos Recibidos"
              description="Lista de comprobantes subidos por inquilinos con estados (pendiente/aprobado/rechazado) y opción de ver imagen."
              viewMode={viewMode}
            >
              {isWireframe ? <PagosRecibidosWireframe /> : <PagosRecibidosMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: DASHBOARD INQUILINO */}
          <TabsContent value="inquilino" className="space-y-8">
            {/* Dashboard Inquilino */}
            <ScreenCard
              title="Dashboard Inquilino"
              description="Panel con información del contrato activo, próximo pago, historial de pagos reciente y accesos rápidos."
              viewMode={viewMode}
            >
              {isWireframe ? <InquilinoDashboardWireframe /> : <InquilinoDashboardMockup />}
            </ScreenCard>

            {/* Subir Comprobante */}
            <ScreenCard
              title="Subir Comprobante de Pago"
              description="Formulario para cargar imagen de comprobante SINPE o transferencia con mes correspondiente y notas opcionales."
              viewMode={viewMode}
            >
              {isWireframe ? <SubirComprobanteWireframe /> : <SubirComprobanteMockup />}
            </ScreenCard>

            {/* Mi Contrato */}
            <ScreenCard
              title="Mi Contrato"
              description="Visualización completa del contrato activo con detalles de la propiedad, términos, duración y monto mensual."
              viewMode={viewMode}
            >
              {isWireframe ? <MiContratoWireframe /> : <MiContratoMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: COMUNICACIÓN */}
          <TabsContent value="comunicacion" className="space-y-8">
            {/* Mensajes */}
            <ScreenCard
              title="Mensajes"
              description="Sistema de chat con lista de conversaciones (sidebar) y área de mensajes. Comunicación directa entre dueños e inquilinos."
              viewMode={viewMode}
            >
              {isWireframe ? <MensajesWireframe /> : <MensajesMockup />}
            </ScreenCard>

            {/* Notificaciones */}
            <ScreenCard
              title="Centro de Notificaciones"
              description="Lista cronológica de notificaciones del sistema con indicadores de leído/no leído y tipos (pago, mensaje, contrato)."
              viewMode={viewMode}
            >
              {isWireframe ? <NotificacionesWireframe /> : <NotificacionesMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: USUARIO */}
          <TabsContent value="usuario" className="space-y-8">
            {/* Perfil */}
            <ScreenCard
              title="Mi Perfil"
              description="Edición de información personal: avatar, nombre, email, teléfono y contraseña."
              viewMode={viewMode}
            >
              {isWireframe ? <PerfilWireframe /> : <PerfilMockup />}
            </ScreenCard>

            {/* Historial */}
            <ScreenCard
              title="Historial de Transacciones"
              description="Registro completo de todas las actividades: pagos, contratos, propiedades con filtros y exportación."
              viewMode={viewMode}
            >
              {isWireframe ? <HistorialWireframe /> : <HistorialMockup />}
            </ScreenCard>
          </TabsContent>

          {/* MÓDULO: OTROS */}
          <TabsContent value="otros" className="space-y-8">
            {/* Aceptar Invitación */}
            <ScreenCard
              title="Aceptar Invitación"
              description="Página de aceptación de invitación de contrato vía link único con detalles de la propiedad y términos."
              viewMode={viewMode}
            >
              {isWireframe ? <AceptarInvitacionWireframe /> : <AceptarInvitacionMockup />}
            </ScreenCard>

            {/* Página no encontrada */}
            <ScreenCard
              title="Página No Encontrada (404)"
              description="Pantalla de error amigable con opción de volver al inicio."
              viewMode={viewMode}
            >
              {isWireframe ? <NotFoundWireframe /> : <NotFoundMockup />}
            </ScreenCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente wrapper para cada pantalla
function ScreenCard({
  title,
  description,
  viewMode,
  children,
}: {
  title: string;
  description: string;
  viewMode: ViewMode;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
          <Badge variant={viewMode === 'wireframe' ? 'secondary' : 'default'} className="ml-4">
            {viewMode === 'wireframe' ? 'Wireframe' : 'Mockup'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ==================== WIREFRAMES ====================

function LoginWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b-2 border-gray-400 flex items-center justify-between px-6">
          <div className="h-8 w-40 bg-gray-300 border-2 border-gray-400" />
          <div className="h-8 w-8 bg-gray-300 border-2 border-gray-400 rounded" />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-10 w-56 bg-gray-300 border-2 border-gray-400" />
              <div className="h-5 w-80 bg-gray-300 border-2 border-gray-400" />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-300 border-2 border-gray-400" />
                  <div className="h-4 w-20 bg-gray-300 border-2 border-gray-400" />
                </div>
                <div className="h-4 w-36 bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-40 bg-gray-300 border-2 border-gray-400 mx-auto" />
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
            </div>

            {/* Footer */}
            <div className="h-4 w-56 bg-gray-300 border-2 border-gray-400 mx-auto" />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-300 border-l-2 border-gray-400 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="space-y-4 text-center">
            <div className="h-12 w-96 bg-gray-400 border-2 border-gray-500 mx-auto" />
            <div className="h-6 w-80 bg-gray-400 border-2 border-gray-500 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginMockup() {
  return (
    <div className="rounded-lg overflow-hidden bg-white min-h-[600px] flex shadow-xl">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <span className="font-semibold text-lg">Arrendamientos CR</span>
          </div>
          <button className="size-9 rounded-lg border flex items-center justify-center hover:bg-accent">
            🌙
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Iniciar sesión</h1>
              <p className="text-muted-foreground">
                Ingresa a tu cuenta para gestionar tus alquileres
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="size-4" disabled />
                  <label className="text-sm">Recordarme</label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Olvidé mi contraseña
                </a>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button className="h-10 w-full bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
                <LogIn className="size-4" />
                Iniciar sesión
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>

              <button className="h-10 w-full border rounded-md font-medium flex items-center justify-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Regístrate gratis
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center p-12">
          <div className="max-w-md text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Gestiona tus alquileres de forma profesional
            </h2>
            <p className="text-lg opacity-90">
              La plataforma más completa para dueños e inquilinos en Costa Rica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistroWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b-2 border-gray-400 flex items-center justify-between px-6">
          <div className="h-8 w-40 bg-gray-300 border-2 border-gray-400" />
          <div className="h-8 w-8 bg-gray-300 border-2 border-gray-400 rounded" />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-10 w-48 bg-gray-300 border-2 border-gray-400" />
              <div className="h-5 w-72 bg-gray-300 border-2 border-gray-400" />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Nombre completo */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
                {/* Password requirements */}
                <div className="space-y-1">
                  <div className="h-3 w-40 bg-gray-300 border border-gray-400" />
                  <div className="h-3 w-44 bg-gray-300 border border-gray-400" />
                  <div className="h-3 w-36 bg-gray-300 border border-gray-400" />
                </div>
              </div>

              {/* Confirmar Password */}
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-40 bg-gray-300 border-2 border-gray-400 mx-auto" />
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
            </div>

            {/* Footer */}
            <div className="h-4 w-56 bg-gray-300 border-2 border-gray-400 mx-auto" />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-300 border-l-2 border-gray-400 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="space-y-4 text-center">
            <div className="h-12 w-96 bg-gray-400 border-2 border-gray-500 mx-auto" />
            <div className="h-6 w-80 bg-gray-400 border-2 border-gray-500 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RegistroMockup() {
  return (
    <div className="rounded-lg overflow-hidden bg-white min-h-[700px] flex shadow-xl">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <span className="font-semibold text-lg">Arrendamientos CR</span>
          </div>
          <button className="size-9 rounded-lg border flex items-center justify-center hover:bg-accent">
            🌙
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Crear cuenta</h1>
              <p className="text-muted-foreground">
                Comienza a gestionar tus alquileres hoy mismo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Nombre completo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
                {/* Password requirements */}
                <div className="space-y-1 text-xs">
                  <div className="text-green-600">✓ Mínimo 8 caracteres</div>
                  <div className="text-green-600">✓ Al menos una mayúscula</div>
                  <div className="text-green-600">✓ Al menos un número</div>
                </div>
              </div>

              {/* Confirmar Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full pl-10 pr-3 border rounded-md"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button className="h-10 w-full bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
                <UserPlus className="size-4" />
                Crear cuenta
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>

              <button className="h-10 w-full border rounded-md font-medium flex items-center justify-center gap-2">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center p-12">
          <div className="max-w-md text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Únete a la comunidad de arrendamientos
            </h2>
            <p className="text-lg opacity-90">
              Miles de dueños e inquilinos ya confían en nuestra plataforma para gestionar sus alquileres
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecuperarPasswordWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[500px] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="space-y-2 text-center">
          <div className="h-10 w-64 bg-gray-300 mx-auto border-2 border-gray-400" />
          <div className="h-6 w-80 bg-gray-300 mx-auto border-2 border-gray-400" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
          </div>
          <div className="h-11 w-full bg-gray-300 border-2 border-gray-400" />
          <div className="h-4 w-32 bg-gray-300 mx-auto border-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
}

function RecuperarPasswordMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[500px] flex items-center justify-center p-8 shadow-xl">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Recuperar contraseña</h2>
          <p className="text-muted-foreground">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="h-10 w-full pl-10 pr-3 border rounded-md"
                disabled
              />
            </div>
          </div>
          <button className="h-11 w-full bg-primary text-primary-foreground rounded-md font-medium">
            Enviar enlace
          </button>
          <p className="text-center text-sm">
            <a href="#" className="text-primary hover:underline">
              Volver al login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LandingWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[800px]">
      {/* Hero */}
      <div className="p-16 text-center space-y-6 border-b-2 border-gray-400">
        <div className="h-6 w-48 bg-gray-300 mx-auto border-2 border-gray-400" />
        <div className="h-16 w-3/4 bg-gray-300 mx-auto border-2 border-gray-400" />
        <div className="h-6 w-2/3 bg-gray-300 mx-auto border-2 border-gray-400" />
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="h-12 w-full bg-gray-300 border-2 border-gray-400" />
          <div className="flex gap-3">
            <div className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-32 bg-gray-300 border-2 border-gray-400" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-16 space-y-8">
        <div className="h-10 w-64 bg-gray-300 mx-auto border-2 border-gray-400" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3 text-center">
              <div className="h-12 w-12 bg-gray-300 border-2 border-gray-400 mx-auto rounded-full" />
              <div className="h-6 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-3/4 bg-gray-300 border-2 border-gray-400 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="p-16 bg-gray-200 border-t-2 border-gray-400 space-y-8">
        <div className="h-10 w-56 bg-gray-300 mx-auto border-2 border-gray-400" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-16 w-16 bg-gray-300 border-2 border-gray-400 mx-auto rounded-full" />
              <div className="h-6 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingMockup() {
  return (
    <div className="rounded-lg overflow-hidden bg-white min-h-[800px] shadow-xl">
      {/* Hero */}
      <div className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto text-center space-y-8 px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-sm">
            <TrendingUp className="size-3" />
            Plataforma moderna de arrendamientos
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight">
            Encuentra propiedades, formaliza tu alquiler y controla tus pagos{' '}
            <span className="text-primary">en un solo lugar</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            La solución completa para gestionar arrendamientos en Costa Rica de forma segura, transparente y profesional.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por ubicación o tipo de propiedad..."
                className="h-14 w-full pl-12 pr-4 border-2 rounded-lg text-lg"
                disabled
              />
            </div>
            <div className="flex gap-3">
              <select className="h-10 flex-1 px-3 border rounded-md" disabled>
                <option>Precio máximo</option>
              </select>
              <select className="h-10 flex-1 px-3 border rounded-md" disabled>
                <option>Tipo de propiedad</option>
              </select>
              <button className="h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Search, title: 'Busca propiedades', desc: 'Encuentra el lugar perfecto con nuestro catálogo actualizado de propiedades en alquiler.' },
            { icon: FileText, title: 'Formaliza contratos', desc: 'Gestiona invitaciones y contratos de forma segura y trazable.' },
            { icon: CreditCard, title: 'Registra pagos', desc: 'Sube comprobantes de SINPE o transferencia y lleva control total.' },
            { icon: BarChart3, title: 'Historial ordenado', desc: 'Accede a todo tu historial de pagos y documentos en un solo lugar.' },
          ].map((feature, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
                <feature.icon className="size-6" />
              </div>
              <h3 className="font-bold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="py-16 px-8 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { num: '1', title: 'Regístrate', desc: 'Crea tu cuenta como dueño o inquilino en menos de un minuto.' },
            { num: '2', title: 'Publica o busca', desc: 'Los dueños publican propiedades, los inquilinos encuentran su hogar ideal.' },
            { num: '3', title: 'Formaliza', desc: 'Genera invitaciones de contrato seguras con un enlace único.' },
            { num: '4', title: 'Gestiona', desc: 'Registra pagos mensuales y mantén todo documentado.' },
          ].map((step, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                {step.num}
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholder components - Implementing detailed wireframes and mockups
function PropiedadesWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] p-8">
      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <div className="h-12 w-full bg-gray-300 border-2 border-gray-400" />
        <div className="flex gap-4">
          <div className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-10 w-24 bg-gray-300 border-2 border-gray-400" />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border-2 border-gray-400 bg-white">
            <div className="h-48 bg-gray-300 border-b-2 border-gray-400" />
            <div className="p-4 space-y-3">
              <div className="h-6 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
              <div className="h-8 w-24 bg-gray-300 border-2 border-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropiedadesMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[700px] p-8 shadow-xl">
      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar propiedades por ubicación..."
            className="h-12 w-full pl-12 pr-4 border rounded-lg"
            disabled
          />
        </div>
        <div className="flex gap-4">
          <select className="h-10 flex-1 px-3 border rounded-md" disabled>
            <option>Todas las provincias</option>
          </select>
          <select className="h-10 flex-1 px-3 border rounded-md" disabled>
            <option>Todos los tipos</option>
          </select>
          <select className="h-10 flex-1 px-3 border rounded-md" disabled>
            <option>Todos los precios</option>
          </select>
          <button className="h-10 px-4 flex items-center gap-2 border rounded-md">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Casa moderna en Escazú', location: 'San José, Escazú', price: '₡850,000' },
          { title: 'Apartamento céntrico', location: 'San José, Centro', price: '₡450,000' },
          { title: 'Casa de playa Puntarenas', location: 'Puntarenas', price: '₡1,200,000' },
        ].map((prop, i) => (
          <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100" />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{prop.title}</h3>
                <Badge>Disponible</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="size-4" />
                {prop.location}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{prop.price}</span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropiedadDetalleWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[800px] p-8">
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="h-96 bg-gray-300 border-2 border-gray-400" />
          
          {/* Title & Location */}
          <div className="space-y-3">
            <div className="h-10 w-2/3 bg-gray-300 border-2 border-gray-400" />
            <div className="h-5 w-1/2 bg-gray-300 border-2 border-gray-400" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-3/4 bg-gray-300 border-2 border-gray-400" />
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <div className="h-6 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-12 bg-gray-300 border-2 border-gray-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
            <div className="h-12 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
          </div>

          {/* Owner Info */}
          <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="flex items-center gap-3">
              <div className="size-16 rounded-full bg-gray-300 border-2 border-gray-400" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropiedadDetalleMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[800px] p-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200 relative">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="size-2 rounded-full bg-white w-6" />
              <div className="size-2 rounded-full bg-white/50" />
              <div className="size-2 rounded-full bg-white/50" />
            </div>
          </div>
          
          {/* Title & Location */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">Casa moderna en Escazú</h1>
              <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-5" />
              <span>Escazú, San José, Costa Rica</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex gap-6 py-4 border-y">
            <div className="flex items-center gap-2">
              <BedDouble className="size-5 text-muted-foreground" />
              <span className="font-medium">3 habitaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="size-5 text-muted-foreground" />
              <span className="font-medium">2 baños</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="size-5 text-muted-foreground" />
              <span className="font-medium">180 m²</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hermosa casa de 3 habitaciones en una de las zonas más exclusivas de Escazú. 
              Cuenta con cocina moderna, sala amplia, jardín privado y 2 parqueos techados.
              Cerca de centros comerciales, escuelas y servicios.
            </p>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Amenidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Wifi, label: 'WiFi' },
                { icon: Car, label: 'Parqueo' },
                { icon: Sofa, label: 'Amueblado' },
                { icon: Wind, label: 'A/C' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 border rounded-lg">
                  <item.icon className="size-5 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="border rounded-lg p-6 space-y-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">₡850,000</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <p className="text-sm text-muted-foreground">Depósito: ₡850,000</p>
            </div>
            <button className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
              <Mail className="size-4" />
              Contactar dueño
            </button>
            <button className="w-full h-10 border rounded-md font-medium flex items-center justify-center gap-2">
              <Share2 className="size-4" />
              Compartir
            </button>
          </div>

          {/* Owner Info */}
          <div className="border rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="font-bold">Información del dueño</h3>
            <div className="flex items-center gap-3">
              <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                CG
              </div>
              <div>
                <p className="font-medium">Carlos González</p>
                <p className="text-sm text-muted-foreground">Dueño verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DuenoDashboardWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-gray-400 bg-white p-6 space-y-3">
            <div className="size-12 bg-gray-300 border-2 border-gray-400 rounded" />
            <div className="h-8 w-16 bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-gray-400 bg-white p-6 space-y-3">
              <div className="size-10 bg-gray-300 border-2 border-gray-400 rounded" />
              <div className="h-5 w-full bg-gray-300 border-2 border-gray-400" />
              <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div>
        <div className="h-6 w-40 bg-gray-300 border-2 border-gray-400 mb-4" />
        <div className="border-2 border-gray-400 bg-white">
          <div className="grid grid-cols-4 gap-4 p-4 border-b-2 border-gray-400">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-300 border-2 border-gray-400" />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-300">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-gray-200 border border-gray-300" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuenoDashboardMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[700px] p-8 shadow-xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Building2, value: '3', label: 'Mis propiedades', desc: '2 disponibles', color: 'text-blue-600', bg: 'bg-blue-100' },
          { icon: Mail, value: '1', label: 'Invitaciones activas', desc: 'Pendientes', color: 'text-purple-600', bg: 'bg-purple-100' },
          { icon: Clock, value: '2', label: 'Pagos pendientes', desc: 'Por revisar', color: 'text-amber-600', bg: 'bg-amber-100' },
          { icon: CheckCircle2, value: '5', label: 'Pagos aprobados', desc: 'Este mes', color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <div className={`inline-flex size-12 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium mt-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Building2, title: 'Publicar propiedad', desc: 'Añade una nueva propiedad' },
            { icon: Mail, title: 'Generar invitación', desc: 'Crea un contrato de alquiler' },
            { icon: CreditCard, title: 'Revisar pagos', desc: 'Ver comprobantes pendientes' },
          ].map((action, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 space-y-3">
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Actividad reciente</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Actividad</th>
                    <th className="text-left p-4 font-medium">Fecha</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { activity: 'Pago recibido - Casa Escazú', date: '15 Mar 2026', status: 'Pendiente', badge: 'warning' },
                    { activity: 'Nueva invitación enviada', date: '14 Mar 2026', status: 'Enviada', badge: 'info' },
                    { activity: 'Pago aprobado', date: '13 Mar 2026', status: 'Aprobado', badge: 'success' },
                  ].map((item, i) => (
                    <tr key={i}>
                      <td className="p-4">{item.activity}</td>
                      <td className="p-4 text-muted-foreground">{item.date}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{item.status}</Badge>
                      </td>
                      <td className="p-4">
                        <button className="text-primary hover:underline text-sm font-medium">Ver detalles</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MisPropiedadesWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-300 border-2 border-gray-400" />
        <div className="h-10 w-40 bg-gray-300 border-2 border-gray-400" />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-gray-400 bg-white">
            <div className="h-48 bg-gray-300 border-b-2 border-gray-400" />
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400" />
                  <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                </div>
                <div className="h-6 w-20 bg-gray-300 border-2 border-gray-400" />
              </div>
              <div className="h-8 w-28 bg-gray-300 border-2 border-gray-400" />
              <div className="flex gap-2">
                <div className="h-9 flex-1 bg-gray-300 border-2 border-gray-400" />
                <div className="h-9 flex-1 bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MisPropiedadesMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Mis Propiedades</h1>
        <button className="h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2">
          <Plus className="size-4" />
          Nueva propiedad
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Casa moderna en Escazú', location: 'San José, Escazú', price: '₡850,000', status: 'Disponible' },
          { title: 'Apartamento céntrico', location: 'San José, Centro', price: '₡450,000', status: 'Ocupado' },
        ].map((prop, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100" />
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <MapPin className="size-4" />
                    {prop.location}
                  </div>
                </div>
                <Badge variant={prop.status === 'Disponible' ? 'default' : 'secondary'}>
                  {prop.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-primary">{prop.price}/mes</div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 border rounded-md font-medium flex items-center justify-center gap-2 hover:bg-accent">
                  <Edit className="size-4" />
                  Editar
                </button>
                <button className="flex-1 h-9 border border-destructive text-destructive rounded-md font-medium flex items-center justify-center gap-2 hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                  Eliminar
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NuevaPropiedadWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[800px] p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div className="h-8 w-64 bg-gray-300 border-2 border-gray-400" />

        {/* Form Sections */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="border-2 border-gray-400 bg-white p-6 space-y-4">
            <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
                  <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Image Upload */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          <div className="h-6 w-32 bg-gray-300 border-2 border-gray-400" />
          <div className="h-40 w-full bg-gray-300 border-2 border-gray-400 border-dashed" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
}

function NuevaPropiedadMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[800px] p-8 shadow-xl">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">Publicar nueva propiedad</h1>

        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <input type="text" placeholder="Ej: Casa moderna en Escazú" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de propiedad</label>
                <select className="h-10 w-full px-3 border rounded-md" disabled>
                  <option>Seleccionar tipo</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio mensual</label>
                <input type="number" placeholder="450000" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Moneda</label>
                <select className="h-10 w-full px-3 border rounded-md" disabled>
                  <option>CRC (₡)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provincia</label>
                <select className="h-10 w-full px-3 border rounded-md" disabled>
                  <option>Seleccionar provincia</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cantón</label>
                <input type="text" placeholder="Ej: Escazú" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium">Dirección exacta</label>
                <textarea placeholder="Descripción detallada de la ubicación" className="w-full px-3 py-2 border rounded-md min-h-[80px]" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la propiedad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Habitaciones</label>
                <input type="number" placeholder="3" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Baños</label>
                <input type="number" placeholder="2" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Área (m²)</label>
                <input type="number" placeholder="180" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Haz clic para subir o arrastra las imágenes aquí</p>
              <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 h-11 border rounded-md font-medium hover:bg-accent">
            Cancelar
          </button>
          <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium">
            Publicar propiedad
          </button>
        </div>
      </div>
    </div>
  );
}

function EditarPropiedadWireframe() {
  return <NuevaPropiedadWireframe />;
}

function EditarPropiedadMockup() {
  return <NuevaPropiedadMockup />;
}
function InvitacionesWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-56 bg-gray-300 border-2 border-gray-400" />
        <div className="h-10 w-40 bg-gray-300 border-2 border-gray-400" />
      </div>

      {/* Table */}
      <div className="border-2 border-gray-400 bg-white">
        <div className="grid grid-cols-5 gap-4 p-4 border-b-2 border-gray-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-300 border-2 border-gray-400" />
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-300">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 bg-gray-200 border border-gray-300" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function InvitacionesMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Gestionar invitaciones</h1>
        <button className="h-10 px-4 bg-primary text-primary-foreground rounded-md font-medium flex items-center gap-2">
          <Plus className="size-4" />
          Nueva invitación
        </button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Propiedad</th>
                  <th className="text-left p-4 font-medium">Inquilino</th>
                  <th className="text-left p-4 font-medium">Fecha envío</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { prop: 'Casa Escazú', tenant: 'María López', date: '15 Mar 2026', status: 'Pendiente' },
                  { prop: 'Apartamento Centro', tenant: 'Juan Pérez', date: '10 Mar 2026', status: 'Aceptado' },
                  { prop: 'Local Comercial', tenant: 'Ana García', date: '5 Mar 2026', status: 'Expirada' },
                ].map((inv, i) => (
                  <tr key={i}>
                    <td className="p-4 font-medium">{inv.prop}</td>
                    <td className="p-4">{inv.tenant}</td>
                    <td className="p-4 text-muted-foreground">{inv.date}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{inv.status}</Badge>
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:underline text-sm font-medium">Ver detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NuevaInvitacionWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <div className="h-8 w-64 bg-gray-300 border-2 border-gray-400" />

        {/* Form */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
}

function NuevaInvitacionMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">Crear invitación de contrato</h1>

        {/* Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Propiedad</label>
              <select className="h-10 w-full px-3 border rounded-md" disabled>
                <option>Seleccionar propiedad</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Correo del inquilino</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="inquilino@ejemplo.com"
                  className="h-10 w-full pl-10 pr-3 border rounded-md"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del inquilino</label>
              <input type="text" placeholder="Nombre completo" className="h-10 w-full px-3 border rounded-md" disabled />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio mensual</label>
                <input type="number" placeholder="450000" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Depósito</label>
                <input type="number" placeholder="450000" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input type="date" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración (meses)</label>
                <input type="number" placeholder="12" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Términos adicionales</label>
              <textarea
                placeholder="Describe términos especiales del contrato..."
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 h-11 border rounded-md font-medium hover:bg-accent">
            Cancelar
          </button>
          <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
            <Send className="size-4" />
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}

function PagosRecibidosWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      {/* Header */}
      <div className="h-8 w-48 bg-gray-300 border-2 border-gray-400 mb-6" />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-2 border-gray-400 bg-white p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-300 border-2 border-gray-400" />
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
              </div>
              <div className="h-6 w-20 bg-gray-300 border-2 border-gray-400" />
            </div>
            <div className="h-32 w-full bg-gray-300 border-2 border-gray-400" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-gray-300 border-2 border-gray-400" />
              <div className="h-9 flex-1 bg-gray-300 border-2 border-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PagosRecibidosMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Pagos recibidos</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Todos los estados</option>
        </select>
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Todas las propiedades</option>
        </select>
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Último mes</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { prop: 'Casa Escazú', tenant: 'María López', date: '15 Mar 2026', amount: '₡850,000', status: 'Pendiente' },
          { prop: 'Apartamento Centro', tenant: 'Juan Pérez', date: '14 Mar 2026', amount: '₡450,000', status: 'Aprobado' },
        ].map((pago, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{pago.prop}</h3>
                  <p className="text-sm text-muted-foreground">Por {pago.tenant}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pago.date}</p>
                </div>
                <Badge variant={pago.status === 'Pendiente' ? 'secondary' : 'default'}>
                  {pago.status}
                </Badge>
              </div>
              
              <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border">
                <p className="text-sm text-muted-foreground">Comprobante de pago</p>
              </div>

              <div className="text-2xl font-bold">{pago.amount}</div>

              <div className="flex gap-2">
                <button className="flex-1 h-9 bg-green-600 text-white rounded-md font-medium flex items-center justify-center gap-2">
                  <Check className="size-4" />
                  Aprobar
                </button>
                <button className="flex-1 h-9 border border-destructive text-destructive rounded-md font-medium flex items-center justify-center gap-2">
                  <X className="size-4" />
                  Rechazar
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InquilinoDashboardWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] p-8">
      {/* Contract Card */}
      <div className="border-2 border-gray-400 bg-white p-6 mb-6 space-y-4">
        <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
              <div className="h-6 w-full bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-gray-400 bg-white p-6 space-y-3">
            <div className="size-12 bg-gray-300 border-2 border-gray-400 rounded" />
            <div className="h-8 w-20 bg-gray-300 border-2 border-gray-400" />
            <div className="h-4 w-full bg-gray-300 border-2 border-gray-400" />
          </div>
        ))}
      </div>

      {/* Recent Payments */}
      <div>
        <div className="h-6 w-40 bg-gray-300 border-2 border-gray-400 mb-4" />
        <div className="border-2 border-gray-400 bg-white">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 border-b border-gray-300">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-3 w-24 bg-gray-300 border-2 border-gray-400" />
              </div>
              <div className="h-6 w-20 bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InquilinoDashboardMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[700px] p-8 shadow-xl">
      {/* Contract Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mi contrato activo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Propiedad</p>
              <p className="font-bold">Casa Escazú</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precio mensual</p>
              <p className="font-bold text-primary">₡850,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próximo pago</p>
              <p className="font-bold">1 Abr 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: DollarSign, value: '₡850,000', label: 'Próximo pago', desc: 'Vence en 10 días', color: 'text-blue-600', bg: 'bg-blue-100' },
          { icon: CheckCircle2, value: '12', label: 'Pagos realizados', desc: 'Este año', color: 'text-green-600', bg: 'bg-green-100' },
          { icon: Clock, value: '6', label: 'Meses restantes', desc: 'De contrato', color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <div className={`inline-flex size-12 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium mt-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="text-xl font-bold mb-4">Historial de pagos reciente</h2>
        <Card>
          <CardContent className="p-0">
            {[
              { month: 'Marzo 2026', amount: '₡850,000', status: 'Aprobado' },
              { month: 'Febrero 2026', amount: '₡850,000', status: 'Aprobado' },
              { month: 'Enero 2026', amount: '₡850,000', status: 'Aprobado' },
            ].map((payment, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{payment.month}</p>
                  <p className="text-sm text-muted-foreground">{payment.amount}</p>
                </div>
                <Badge variant="default">{payment.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubirComprobanteWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <div className="h-8 w-64 bg-gray-300 border-2 border-gray-400" />

        {/* Form */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
            <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
            <div className="h-40 w-full bg-gray-300 border-2 border-gray-400 border-dashed" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-300 border-2 border-gray-400" />
            <div className="h-20 w-full bg-gray-300 border-2 border-gray-400" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
}

function SubirComprobanteMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">Subir comprobante de pago</h1>

        {/* Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mes de pago</label>
              <select className="h-10 w-full px-3 border rounded-md" disabled>
                <option>Marzo 2026</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Monto pagado</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="850000"
                  className="h-10 w-full pl-10 pr-3 border rounded-md"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen del comprobante</label>
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Haz clic para subir o arrastra la imagen aquí</p>
                <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notas adicionales (opcional)</label>
              <textarea
                placeholder="Información adicional sobre el pago..."
                className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 h-11 border rounded-md font-medium hover:bg-accent">
            Cancelar
          </button>
          <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
            <Upload className="size-4" />
            Subir comprobante
          </button>
        </div>
      </div>
    </div>
  );
}

function MiContratoWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div className="h-8 w-48 bg-gray-300 border-2 border-gray-400" />

        {/* Contract Details */}
        {[1, 2, 3, 4].map((section) => (
          <div key={section} className="border-2 border-gray-400 bg-white p-6 space-y-4">
            <div className="h-6 w-40 bg-gray-300 border-2 border-gray-400" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                  <div className="h-5 w-full bg-gray-300 border-2 border-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiContratoMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[700px] p-8 shadow-xl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">Mi contrato</h1>
          <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>
        </div>

        {/* Property Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la propiedad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Propiedad</p>
                <p className="font-medium">Casa moderna en Escazú</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ubicación</p>
                <p className="font-medium">Escazú, San José</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">Casa</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Área</p>
                <p className="font-medium">180 m²</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Términos del contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Precio mensual</p>
                <p className="font-bold text-primary text-xl">₡850,000</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Depósito</p>
                <p className="font-bold text-xl">₡850,000</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                <p className="font-medium">1 Enero 2026</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de finalización</p>
                <p className="font-medium">31 Diciembre 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información del dueño</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                CG
              </div>
              <div>
                <p className="font-bold">Carlos González</p>
                <p className="text-sm text-muted-foreground">carlos@example.com</p>
              </div>
            </div>
            <button className="h-10 px-4 border rounded-md font-medium flex items-center gap-2 hover:bg-accent">
              <MessageSquare className="size-4" />
              Enviar mensaje
            </button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { month: 'Marzo 2026', status: 'Aprobado', date: '5 Mar 2026' },
                { month: 'Febrero 2026', status: 'Aprobado', date: '5 Feb 2026' },
                { month: 'Enero 2026', status: 'Aprobado', date: '5 Ene 2026' },
              ].map((payment, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <Badge variant="default">{payment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function MensajesWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] flex">
      {/* Sidebar */}
      <div className="w-80 border-r-2 border-gray-400 bg-white">
        <div className="p-4 border-b-2 border-gray-400">
          <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
        </div>
        <div className="divide-y-2 divide-gray-400">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="size-12 rounded-full bg-gray-300 border-2 border-gray-400" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-3 w-full bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b-2 border-gray-400 bg-white flex items-center px-6 gap-3">
          <div className="size-10 rounded-full bg-gray-300 border-2 border-gray-400" />
          <div className="h-5 w-40 bg-gray-300 border-2 border-gray-400" />
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <div className="size-8 rounded-full bg-gray-300 border-2 border-gray-400" />
              <div className="max-w-md">
                <div className={`h-16 w-64 bg-gray-300 border-2 border-gray-400 ${i % 2 === 0 ? 'ml-auto' : ''}`} />
                <div className="h-3 w-32 bg-gray-300 border border-gray-400 mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="h-16 border-t-2 border-gray-400 bg-white flex items-center px-6 gap-3">
          <div className="flex-1 h-10 bg-gray-300 border-2 border-gray-400" />
          <div className="h-10 w-10 bg-gray-300 border-2 border-gray-400 rounded" />
        </div>
      </div>
    </div>
  );
}

function MensajesMockup() {
  return (
    <div className="rounded-lg overflow-hidden bg-white min-h-[600px] flex shadow-xl">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="h-10 w-full pl-10 pr-3 border rounded-md"
              disabled
            />
          </div>
        </div>
        <div className="divide-y">
          {[
            { name: 'Carlos González', message: 'Gracias por el pago', time: '10:30', unread: true },
            { name: 'María López', message: 'Consulta sobre el contrato', time: 'Ayer', unread: false },
            { name: 'Juan Pérez', message: '¿Cuándo puedo visitar?', time: '15 Mar', unread: false },
          ].map((conv, i) => (
            <div key={i} className={`p-4 flex items-center gap-3 hover:bg-accent/50 cursor-pointer ${conv.unread ? 'bg-primary/5' : ''}`}>
              <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                {conv.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p className="font-medium truncate">{conv.name}</p>
                  <span className="text-xs text-muted-foreground ml-2">{conv.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.message}</p>
              </div>
              {conv.unread && <div className="size-2 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b bg-white flex items-center px-6 gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <p className="font-bold">Carlos González</p>
            <p className="text-xs text-muted-foreground">En línea</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 bg-muted/20">
          {[
            { text: 'Hola, ¿cómo estás?', time: '10:25', sent: false },
            { text: 'Todo bien, gracias. ¿Necesitas algo?', time: '10:27', sent: true },
            { text: 'Solo confirmar que el pago fue recibido', time: '10:30', sent: false },
          ].map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.sent ? 'flex-row-reverse' : ''}`}>
              <div className="size-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                {msg.sent ? 'M' : 'C'}
              </div>
              <div className="max-w-md">
                <div className={`p-3 rounded-lg ${msg.sent ? 'bg-primary text-primary-foreground ml-auto' : 'bg-white'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="h-16 border-t bg-white flex items-center px-6 gap-3">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 h-10 px-4 border rounded-full"
            disabled
          />
          <button className="size-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificacionesWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-300 border-2 border-gray-400" />
          <div className="h-8 w-32 bg-gray-300 border-2 border-gray-400" />
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-2 border-gray-400 bg-white p-4 flex items-start gap-3">
              <div className="size-10 bg-gray-300 border-2 border-gray-400 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-full bg-gray-300 border-2 border-gray-400" />
                <div className="h-4 w-3/4 bg-gray-300 border-2 border-gray-400" />
                <div className="h-3 w-32 bg-gray-300 border-2 border-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificacionesMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <button className="text-sm text-primary hover:underline font-medium">
            Marcar todas como leídas
          </button>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {[
            { icon: DollarSign, title: 'Nuevo pago recibido', desc: 'María López ha subido un comprobante de pago', time: 'Hace 5 min', unread: true, color: 'text-green-600', bg: 'bg-green-100' },
            { icon: Mail, title: 'Invitación aceptada', desc: 'Juan Pérez aceptó tu invitación de contrato', time: 'Hace 2 horas', unread: true, color: 'text-blue-600', bg: 'bg-blue-100' },
            { icon: MessageSquare, title: 'Nuevo mensaje', desc: 'Carlos González te envió un mensaje', time: 'Ayer', unread: false, color: 'text-purple-600', bg: 'bg-purple-100' },
            { icon: CheckCircle2, title: 'Pago aprobado', desc: 'Tu pago de Marzo ha sido aprobado', time: '2 días', unread: false, color: 'text-green-600', bg: 'bg-green-100' },
            { icon: Bell, title: 'Recordatorio', desc: 'Tu próximo pago vence en 5 días', time: '3 días', unread: false, color: 'text-amber-600', bg: 'bg-amber-100' },
          ].map((notif, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${notif.unread ? 'bg-primary/5 border-primary/20' : 'bg-background'}`}>
              <div className={`inline-flex size-10 items-center justify-center rounded-lg ${notif.bg} shrink-0`}>
                <notif.icon className={`size-5 ${notif.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{notif.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{notif.desc}</p>
                <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
              </div>
              {notif.unread && <div className="size-2 rounded-full bg-primary mt-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerfilWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[700px] p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div className="h-8 w-32 bg-gray-300 border-2 border-gray-400" />

        {/* Avatar Section */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          <div className="size-24 rounded-full bg-gray-300 border-2 border-gray-400 mx-auto" />
          <div className="h-10 w-40 bg-gray-300 border-2 border-gray-400 mx-auto" />
        </div>

        {/* Personal Info */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 border-2 border-gray-400" />
                <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Password Section */}
        <div className="border-2 border-gray-400 bg-white p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-300 border-2 border-gray-400 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
              <div className="h-10 w-full bg-gray-300 border-2 border-gray-400" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
          <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
        </div>
      </div>
    </div>
  );
}

function PerfilMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[700px] p-8 shadow-xl">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">Mi perfil</h1>

        {/* Avatar Section */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <div className="size-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-3xl">
              ML
            </div>
            <button className="h-10 px-4 border rounded-md font-medium hover:bg-accent">
              Cambiar foto
            </button>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre completo</label>
                <input type="text" placeholder="María López" className="h-10 w-full px-3 border rounded-md" disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input type="email" placeholder="maria@example.com" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input type="tel" placeholder="+506 8888-8888" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <input type="text" value="Inquilino" className="h-10 w-full px-3 border rounded-md bg-muted" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña actual</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="h-10 w-full pl-10 pr-3 border rounded-md" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 h-11 border rounded-md font-medium hover:bg-accent">
            Cancelar
          </button>
          <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function HistorialWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-56 bg-gray-300 border-2 border-gray-400" />
        <div className="h-10 w-32 bg-gray-300 border-2 border-gray-400" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 flex-1 bg-gray-300 border-2 border-gray-400" />
        ))}
      </div>

      {/* Table */}
      <div className="border-2 border-gray-400 bg-white">
        <div className="grid grid-cols-5 gap-4 p-4 border-b-2 border-gray-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-300 border-2 border-gray-400" />
          ))}
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-300">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-4 bg-gray-200 border border-gray-300" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistorialMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Historial de transacciones</h1>
        <button className="h-10 px-4 border rounded-md font-medium flex items-center gap-2 hover:bg-accent">
          <Download className="size-4" />
          Exportar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Todos los tipos</option>
        </select>
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Todos los estados</option>
        </select>
        <select className="h-10 flex-1 px-3 border rounded-md" disabled>
          <option>Últimos 30 días</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Descripción</th>
                  <th className="text-left p-4 font-medium">Monto</th>
                  <th className="text-left p-4 font-medium">Fecha</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { type: 'Pago', desc: 'Pago mensual - Marzo 2026', amount: '₡850,000', date: '15 Mar 2026', status: 'Aprobado' },
                  { type: 'Pago', desc: 'Pago mensual - Febrero 2026', amount: '₡850,000', date: '15 Feb 2026', status: 'Aprobado' },
                  { type: 'Contrato', desc: 'Inicio de contrato', amount: '₡850,000', date: '1 Ene 2026', status: 'Activo' },
                  { type: 'Depósito', desc: 'Depósito de garantía', amount: '₡850,000', date: '1 Ene 2026', status: 'Pagado' },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <Badge variant="secondary">{item.type}</Badge>
                    </td>
                    <td className="p-4">{item.desc}</td>
                    <td className="p-4 font-bold">{item.amount}</td>
                    <td className="p-4 text-muted-foreground">{item.date}</td>
                    <td className="p-4">
                      <Badge variant="default">{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AceptarInvitacionWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[600px] p-8">
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[500px]">
        <div className="border-2 border-gray-400 bg-white p-8 space-y-6 w-full">
          <div className="text-center space-y-4">
            <div className="size-16 bg-gray-300 border-2 border-gray-400 mx-auto rounded-full" />
            <div className="h-8 w-64 bg-gray-300 border-2 border-gray-400 mx-auto" />
            <div className="h-5 w-80 bg-gray-300 border-2 border-gray-400 mx-auto" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b-2 border-gray-400">
                <div className="h-4 w-32 bg-gray-300 border-2 border-gray-400" />
                <div className="h-5 w-40 bg-gray-300 border-2 border-gray-400" />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
            <div className="h-11 flex-1 bg-gray-300 border-2 border-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AceptarInvitacionMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[600px] p-8 shadow-xl">
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[500px]">
        <Card className="w-full">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Invitación de contrato</h1>
                <p className="text-muted-foreground">
                  Carlos González te ha invitado a firmar un contrato de alquiler
                </p>
              </div>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Propiedad</span>
                <span className="font-medium">Casa moderna en Escazú</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Precio mensual</span>
                <span className="font-bold text-primary text-lg">₡850,000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Depósito</span>
                <span className="font-medium">₡850,000</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">Duración</span>
                <span className="font-medium">12 meses</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Inicio</span>
                <span className="font-medium">1 Abril 2026</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 h-11 border rounded-md font-medium hover:bg-accent">
                Rechazar
              </button>
              <button className="flex-1 h-11 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="size-4" />
                Aceptar invitación
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotFoundWireframe() {
  return (
    <div className="border-2 border-gray-400 rounded-lg bg-gray-100 min-h-[500px] flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="size-24 bg-gray-300 border-2 border-gray-400 mx-auto rounded-full" />
        <div className="space-y-3">
          <div className="h-16 w-48 bg-gray-300 border-2 border-gray-400 mx-auto" />
          <div className="h-6 w-64 bg-gray-300 border-2 border-gray-400 mx-auto" />
          <div className="h-5 w-80 bg-gray-300 border-2 border-gray-400 mx-auto" />
        </div>
        <div className="h-11 w-48 bg-gray-300 border-2 border-gray-400 mx-auto" />
      </div>
    </div>
  );
}

function NotFoundMockup() {
  return (
    <div className="rounded-lg bg-white min-h-[500px] flex items-center justify-center p-8 shadow-xl">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex size-24 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="size-12 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold">Página no encontrada</h2>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida
          </p>
        </div>
        <button className="h-11 px-6 bg-primary text-primary-foreground rounded-md font-medium inline-flex items-center gap-2">
          <Home className="size-4" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
