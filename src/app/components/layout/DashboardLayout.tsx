import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Logo } from '../shared/Logo';
import { ThemeToggle } from '../shared/ThemeToggle';
import { DashboardFooter } from '../shared/DashboardFooter';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { getUnreadCount, getUnreadMessagesCount, fetchPayments, fetchNotifications, fetchMessages, fetchConversations } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Refresh context for the specific user upon entering the dashboard
      fetchPayments(user.id);
      fetchNotifications(user.id);
      fetchConversations(user.id);
      fetchMessages(user.id);
    }
  }, [user?.id, fetchPayments, fetchNotifications, fetchConversations, fetchMessages]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const unreadCount = user ? getUnreadCount(user.id) : 0;
  const unreadMessagesCount = user ? getUnreadMessagesCount(user.id) : 0;

  const duenoMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Mis propiedades', path: '/dashboard/propiedades' },
    { icon: Mail, label: 'Invitaciones', path: '/dashboard/invitaciones' },
    { icon: CreditCard, label: 'Pagos recibidos', path: '/dashboard/pagos' },
    { icon: MessageSquare, label: 'Mensajes', path: '/dashboard/mensajes', badge: unreadMessagesCount },
    { icon: History, label: 'Historial', path: '/dashboard/historial' },
    { icon: Bell, label: 'Notificaciones', path: '/dashboard/notificaciones', badge: unreadCount },
    { icon: User, label: 'Perfil', path: '/dashboard/perfil' },
  ];

  const inquilinoMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Mi contrato', path: '/dashboard/contrato' },
    { icon: CreditCard, label: 'Pago mensual', path: '/dashboard/pago' },
    { icon: MessageSquare, label: 'Mensajes', path: '/dashboard/mensajes', badge: unreadMessagesCount },
    { icon: History, label: 'Historial de pagos', path: '/dashboard/historial' },
    { icon: Bell, label: 'Notificaciones', path: '/dashboard/notificaciones', badge: unreadCount },
    { icon: User, label: 'Perfil', path: '/dashboard/perfil' },
  ];

  const menuItems = user?.rol === 'dueño' ? duenoMenuItems : inquilinoMenuItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate(item.path);
                }
              }}
              role="button"
              tabIndex={0}
              className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="size-5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto flex-shrink-0">
                  {item.badge}
                </Badge>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="size-5 mr-3" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-background">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-16 px-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <Logo />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.nombre}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate('/dashboard/perfil')}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-16 px-6 flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">
                {user?.rol === 'dueño' ? 'Panel del Dueño' : 'Panel del Inquilino'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="size-5" />
                    <span className="hidden xl:inline">{user?.nombre}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate('/dashboard/perfil')}>
                    <User className="size-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
