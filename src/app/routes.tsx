import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LazyRoute } from './components/shared/LazyRoute';
import { useAuth } from './contexts/AuthContext';

// Public pages (eager)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Propiedades from './pages/Propiedades';
import PropiedadDetalle from './pages/PropiedadDetalle';
import DesignDocs from './pages/DesignDocs';
import AceptarInvitacion from './pages/AceptarInvitacion';
import RecuperarContrasena from './pages/RecuperarContrasena';
import NotFound from './pages/NotFound';
import GitHubCallback from './pages/GitHubCallback';

// Dashboard landing pages (eager)
import DuenoDashboard from './pages/dashboard/DuenoDashboard';
import InquilinoDashboard from './pages/dashboard/InquilinoDashboard';

// Dashboard sub-pages (lazy)
const MisPropiedades = lazy(() => import('./pages/dashboard/MisPropiedades'));
const NuevaPropiedad = lazy(() => import('./pages/dashboard/NuevaPropiedad'));
const EditarPropiedad = lazy(() => import('./pages/dashboard/EditarPropiedad'));
const SubirComprobante = lazy(() => import('./pages/dashboard/SubirComprobante'));
const PagosRecibidos = lazy(() => import('./pages/dashboard/PagosRecibidos'));
const Perfil = lazy(() => import('./pages/dashboard/Perfil'));
const Historial = lazy(() => import('./pages/dashboard/Historial'));
const Invitaciones = lazy(() => import('./pages/dashboard/Invitaciones'));
const NuevaInvitacion = lazy(() => import('./pages/dashboard/NuevaInvitacion'));
const MiContrato = lazy(() => import('./pages/dashboard/MiContrato'));
const Notificaciones = lazy(() => import('./pages/dashboard/Notificaciones'));
const Mensajes = lazy(() => import('./pages/dashboard/Mensajes'));
const DashboardCentroAyuda = lazy(() => import('./pages/dashboard/DashboardCentroAyuda'));
const DashboardTerminos = lazy(() => import('./pages/dashboard/DashboardTerminos'));
const DashboardPrivacidad = lazy(() => import('./pages/dashboard/DashboardPrivacidad'));
const DashboardCookies = lazy(() => import('./pages/dashboard/DashboardCookies'));

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
      { path: 'registro', element: <Registro /> },
      { path: 'propiedades', element: <Propiedades /> },
      { path: 'propiedades/:id', element: <PropiedadDetalle /> },
      { path: 'invitacion/:token', element: <AceptarInvitacion /> },
      { path: 'recuperar-contraseña', element: <RecuperarContrasena /> },
      { path: 'auth/github/callback', element: <GitHubCallback /> },
      { path: 'design-docs', element: <DesignDocs /> },
      { path: 'centro-ayuda', element: <LazyRoute component={DashboardCentroAyuda} /> },
      { path: 'terminos', element: <LazyRoute component={DashboardTerminos} /> },
      { path: 'privacidad', element: <LazyRoute component={DashboardPrivacidad} /> },
      { path: 'cookies', element: <LazyRoute component={DashboardCookies} /> },
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
      { path: 'centro-ayuda', element: <LazyRoute component={DashboardCentroAyuda} /> },
      { path: 'terminos', element: <LazyRoute component={DashboardTerminos} /> },
      { path: 'privacidad', element: <LazyRoute component={DashboardPrivacidad} /> },
      { path: 'cookies', element: <LazyRoute component={DashboardCookies} /> },
      { path: 'propiedades', element: <LazyRoute component={MisPropiedades} /> },
      { path: 'propiedades/nueva', element: <LazyRoute component={NuevaPropiedad} /> },
      { path: 'propiedades/:id/editar', element: <LazyRoute component={EditarPropiedad} /> },
      { path: 'invitaciones', element: <LazyRoute component={Invitaciones} /> },
      { path: 'invitaciones/nueva', element: <LazyRoute component={NuevaInvitacion} /> },
      { path: 'pagos', element: <LazyRoute component={PagosRecibidos} /> },
      { path: 'pago', element: <LazyRoute component={SubirComprobante} /> },
      { path: 'contrato', element: <LazyRoute component={MiContrato} /> },
      { path: 'historial', element: <LazyRoute component={Historial} /> },
      { path: 'notificaciones', element: <LazyRoute component={Notificaciones} /> },
      { path: 'mensajes', element: <LazyRoute component={Mensajes} /> },
      { path: 'perfil', element: <LazyRoute component={Perfil} /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
], {
  basename: import.meta.env.BASE_URL,
});