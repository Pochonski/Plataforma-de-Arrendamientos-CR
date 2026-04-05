import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Building2,
  Mail,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function DuenoDashboard() {
  const { user } = useAuth();
  const { properties, invitations, payments } = useData();

  const myProperties = properties.filter((p) => p.duenoId === user?.id);
  const myInvitations = invitations.filter((inv) => inv.duenoId === user?.id);
  const myPayments = payments.filter((p) => p.duenoId === user?.id);

  const pendingPayments = myPayments.filter((p) => p.estado === 'pendiente');
  const approvedPayments = myPayments.filter((p) => p.estado === 'aprobado');
  const activeInvitations = myInvitations.filter((inv) => inv.estado === 'pendiente');

  const stats = [
    {
      title: 'Mis propiedades',
      value: myProperties.length,
      icon: Building2,
      description: `${myProperties.filter((p) => p.estado === 'disponible').length} disponibles`,
      href: '/dashboard/propiedades',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Invitaciones activas',
      value: activeInvitations.length,
      icon: Mail,
      description: 'Pendientes de aceptar',
      href: '/dashboard/invitaciones',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
    {
      title: 'Pagos pendientes',
      value: pendingPayments.length,
      icon: Clock,
      description: 'Por revisar',
      href: '/dashboard/pagos',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-950',
    },
    {
      title: 'Pagos aprobados',
      value: approvedPayments.length,
      icon: CheckCircle2,
      description: 'Este mes',
      href: '/dashboard/historial',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
  ];

  const quickActions = [
    {
      title: 'Publicar propiedad',
      description: 'Añade una nueva propiedad al catálogo',
      icon: Building2,
      href: '/dashboard/propiedades/nueva',
      variant: 'default' as const,
    },
    {
      title: 'Generar invitación',
      description: 'Crea un contrato de alquiler',
      icon: Mail,
      href: '/dashboard/invitaciones/nueva',
      variant: 'outline' as const,
    },
    {
      title: 'Revisar pagos',
      description: 'Ver comprobantes pendientes',
      icon: CreditCard,
      href: '/dashboard/pagos',
      variant: 'outline' as const,
    },
  ];

  const recentPayments = myPayments.slice(0, 5);

  const getPaymentStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"><Clock className="size-3 mr-1" />Pendiente</Badge>;
      case 'aprobado':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"><CheckCircle2 className="size-3 mr-1" />Aprobado</Badge>;
      case 'rechazado':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"><XCircle className="size-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getMonthName = (mes: number) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[mes - 1];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.nombre}!</h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu actividad reciente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`size-5 ${stat.color}`} />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <action.icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimos pagos recibidos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/pagos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment) => {
                  const property = properties.find((p) => p.id === payment.propiedadId);
                  return (
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{property?.titulo || 'Propiedad'}</p>
                        <p className="text-sm text-muted-foreground">
                          {getMonthName(payment.mes)} {payment.año}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatPrice(payment.monto, payment.moneda)}</span>
                        {getPaymentStatusBadge(payment.estado)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="size-12 mx-auto mb-2 opacity-50" />
                <p>Aún no has recibido pagos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Invitations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invitaciones activas</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/invitaciones">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeInvitations.length > 0 ? (
              <div className="space-y-4">
                {activeInvitations.slice(0, 5).map((invitation) => {
                  const property = properties.find((p) => p.id === invitation.propiedadId);
                  const daysLeft = Math.ceil(
                    (invitation.fechaExpiracion.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={invitation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{property?.titulo || 'Propiedad'}</p>
                        <p className="text-sm text-muted-foreground">
                          {invitation.inquilinoCorreo || 'Sin asignar'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="whitespace-nowrap">
                          <Clock className="size-3 mr-1" />
                          {daysLeft}d restantes
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="size-12 mx-auto mb-2 opacity-50" />
                <p className="mb-4">No tienes invitaciones activas</p>
                <Button asChild size="sm">
                  <Link to="/dashboard/invitaciones/nueva">
                    <Plus className="size-4 mr-2" />
                    Crear invitación
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Properties Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mis propiedades</CardTitle>
          <Button asChild>
            <Link to="/dashboard/propiedades/nueva">
              <Plus className="size-4 mr-2" />
              Nueva propiedad
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {myProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProperties.slice(0, 3).map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {property.imagenes[0] && (
                      <img
                        src={property.imagenes[0]}
                        alt={property.titulo}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge className="absolute top-2 right-2">
                      {property.estado}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{property.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{property.provincia}</p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.precio, property.moneda)}
                      <span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aún no has publicado propiedades</h3>
              <p className="text-muted-foreground mb-6">
                Comienza publicando tu primera propiedad en alquiler
              </p>
              <Button asChild size="lg">
                <Link to="/dashboard/propiedades/nueva">
                  <Plus className="size-4 mr-2" />
                  Publicar primera propiedad
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
