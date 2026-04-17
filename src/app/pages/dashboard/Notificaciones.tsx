import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Bell,
  Mail,
  CreditCard,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  Trash2,
} from 'lucide-react';

export default function Notificaciones() {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, getUnreadCount, fetchNotifications } = useData();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchNotifications]);

  const myNotifications = notifications.filter((n) => n.userId === user?.id);
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas');

  const filteredNotifications = myNotifications.filter((n) => {
    if (filter === 'no-leidas') return !n.leida;
    return true;
  });

  const unreadCount = getUnreadCount(user?.id || '');

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'invitacion_enviada':
      case 'invitacion_aceptada':
      case 'invitacion_expirada':
        return <Mail className="size-5" />;
      case 'pago_recibido':
      case 'pago_aprobado':
      case 'pago_rechazado':
        return <CreditCard className="size-5" />;
      case 'contrato_proximo_vencer':
        return <FileText className="size-5" />;
      default:
        return <Bell className="size-5" />;
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case 'invitacion_aceptada':
      case 'pago_aprobado':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
      case 'pago_rechazado':
      case 'invitacion_expirada':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
      case 'pago_recibido':
      case 'invitacion_enviada':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
      case 'contrato_proximo_vencer':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    myNotifications.forEach((n) => {
      if (!n.leida) {
        markNotificationAsRead(n.id);
      }
    });
  };

  const getTimeAgo = (fecha: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(fecha).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Hace un momento';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        <p className="text-muted-foreground mt-1">
          Mantente al día con todas tus actualizaciones
        </p>
      </div>

      {/* Stats and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={filter === 'todas' ? 'default' : 'outline'}
            onClick={() => setFilter('todas')}
          >
            Todas
            <Badge variant="secondary" className="ml-2">
              {myNotifications.length}
            </Badge>
          </Button>
          <Button
            variant={filter === 'no-leidas' ? 'default' : 'outline'}
            onClick={() => setFilter('no-leidas')}
          >
            No leídas
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="size-4 mr-2" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all ${
                !notification.leida ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.tipo)}`}>
                    {getNotificationIcon(notification.tipo)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{notification.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{notification.mensaje}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {getTimeAgo(notification.fecha)}
                        </p>
                      </div>
                      {!notification.leida && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Nuevo
                        </Badge>
                      )}
                    </div>

                    {notification.link && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-8 px-3"
                        asChild
                      >
                        <a href={notification.link}>Ver detalles</a>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.leida && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <Bell className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filter === 'no-leidas' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'no-leidas'
                ? 'Todas tus notificaciones están al día'
                : 'Cuando recibas actualizaciones, aparecerán aquí'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
