import { createBrowserRouter, Navigate } from 'react-router';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useAuth } from './contexts/AuthContext';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Propiedades from './pages/Propiedades';
import PropiedadDetalle from './pages/PropiedadDetalle';
import DesignDocs from './pages/DesignDocs';
import AceptarInvitacion from './pages/AceptarInvitacion';
import RecuperarContrasena from './pages/RecuperarContrasena';
import { CentroAyuda } from './pages/CentroAyuda';
import { Terminos } from './pages/Terminos';
import { Privacidad } from './pages/Privacidad';
import { Cookies } from './pages/Cookies';
import NotFound from './pages/NotFound';

// Dashboard pages
import DuenoDashboard from './pages/dashboard/DuenoDashboard';
import InquilinoDashboard from './pages/dashboard/InquilinoDashboard';
import MisPropiedades from './pages/dashboard/MisPropiedades';
import NuevaPropiedad from './pages/dashboard/NuevaPropiedad';
import EditarPropiedad from './pages/dashboard/EditarPropiedad';
import SubirComprobante from './pages/dashboard/SubirComprobante';
import PagosRecibidos from './pages/dashboard/PagosRecibidos';
import Perfil from './pages/dashboard/Perfil';
import Historial from './pages/dashboard/Historial';
import Invitaciones from './pages/dashboard/Invitaciones';
import NuevaInvitacion from './pages/dashboard/NuevaInvitacion';
import MiContrato from './pages/dashboard/MiContrato';
import Notificaciones from './pages/dashboard/Notificaciones';
import Mensajes from './pages/dashboard/Mensajes';
import DashboardCentroAyuda from './pages/dashboard/DashboardCentroAyuda';
import DashboardTerminos from './pages/dashboard/DashboardTerminos';
import DashboardPrivacidad from './pages/dashboard/DashboardPrivacidad';
import DashboardCookies from './pages/dashboard/DashboardCookies';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">Esta página está en desarrollo</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Dashboard route selector based on user role
const DashboardHome = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return user.rol === 'dueño' ? <DuenoDashboard /> : <InquilinoDashboard />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'propiedades', element: <Propiedades /> },
      { path: 'invitacion/:token', element: <AceptarInvitacion /> },
      { path: 'recuperar-contraseña', element: <RecuperarContrasena /> },
      { path: 'design-docs', element: <DesignDocs /> },
      { path: 'centro-ayuda', element: <DashboardCentroAyuda /> },
      { path: 'terminos', element: <DashboardTerminos /> },
      { path: 'privacidad', element: <DashboardPrivacidad /> },
      { path: 'cookies', element: <DashboardCookies /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'centro-ayuda', element: <DashboardCentroAyuda /> },
      { path: 'terminos', element: <DashboardTerminos /> },
      { path: 'privacidad', element: <DashboardPrivacidad /> },
      { path: 'cookies', element: <DashboardCookies /> },
      { path: 'propiedades', element: <MisPropiedades /> },
      { path: 'propiedades/nueva', element: <NuevaPropiedad /> },
      { path: 'propiedades/:id/editar', element: <EditarPropiedad /> },
      { path: 'invitaciones', element: <Invitaciones /> },
      { path: 'invitaciones/nueva', element: <NuevaInvitacion /> },
      { path: 'pagos', element: <PagosRecibidos /> },
      { path: 'pago', element: <SubirComprobante /> },
      { path: 'contrato', element: <MiContrato /> },
      { path: 'historial', element: <Historial /> },
      { path: 'notificaciones', element: <Notificaciones /> },
      { path: 'mensajes', element: <Mensajes /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
], {
  basename: (import.meta as any).env.BASE_URL,
});