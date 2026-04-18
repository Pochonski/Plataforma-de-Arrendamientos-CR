import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Contract } from '../../types';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  Home,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function InquilinoDashboard() {
  const { user } = useAuth();
  const { contracts, payments, properties, getContractByInquilinoId, fetchPayments, isLoadingPayments } = useData();
  const [myContract, setMyContract] = useState<Contract | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(true);

  const handleRefresh = async () => {
    if (user?.id) {
      try {
        await Promise.all([
          fetchPayments(user.id),
          getContractByInquilinoId(user.id).then(c => setMyContract(c || null))
        ]);
        toast.success('Dashboard actualizado');
      } catch (error) {
        toast.error('Error al actualizar');
      }
    }
  };

  const isRefreshing = isLoadingPayments || isLoadingContract;

  useEffect(() => {
    if (user?.id) {
      fetchPayments(user.id);
    }
  }, [user?.id, fetchPayments]);

  useEffect(() => {
    const loadContract = async () => {
      if (!user?.id) {
        setMyContract(null);
        setIsLoadingContract(false);
        return;
      }
      setIsLoadingContract(true);
      const contract = await getContractByInquilinoId(user.id);
      setMyContract(contract || null);
      setIsLoadingContract(false);
    };
    loadContract();
  }, [user?.id, getContractByInquilinoId]);

  const myPayments = payments;
  const property = myContract ? properties.find((p) => p.id === myContract.propiedadId) : null;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const currentMonthPayment = myPayments.find(
    (p) => p.mes === currentMonth && p.año === currentYear
  );

  const pendingPayments = myPayments.filter((p) => p.estado === 'pendiente').length;
  const approvedPayments = myPayments.filter((p) => p.estado === 'aprobado').length;
  const rejectedPayments = myPayments.filter((p) => p.estado === 'rechazado').length;

  const stats = [
    {
      title: 'Pagos aprobados',
      value: approvedPayments,
      icon: CheckCircle2,
      description: 'Total histórico',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'Pagos pendientes',
      value: pendingPayments,
      icon: Clock,
      description: 'En revisión',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-950',
    },
    {
      title: 'Pagos rechazados',
      value: rejectedPayments,
      icon: XCircle,
      description: 'Requieren acción',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-950',
    },
  ];

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

  const getMonthNameLong = (mes: number) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[mes - 1];
  };

  const recentPayments = myPayments.slice(0, 5);

  if (isLoadingContract) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-muted mb-4">
            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!myContract) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.nombre}!</h1>
          <p className="text-muted-foreground">
            Aún no tienes un contrato activo
          </p>
        </div>

        <Card className="text-center p-12">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <Home className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No tienes un contrato activo</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Para comenzar a gestionar tu alquiler, necesitas aceptar una invitación de contrato enviada por un dueño
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/propiedades">Explorar propiedades</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard/perfil">Ver mi perfil</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.nombre}!</h1>
          <p className="text-muted-foreground">
            Gestiona tu alquiler y mantén todo en orden
          </p>
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Current Month Payment Status */}
      {!currentMonthPayment ? (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                <AlertCircle className="size-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Pago pendiente de {getMonthNameLong(currentMonth)}</h3>
                <p className="text-muted-foreground mb-4">
                  Aún no has subido el comprobante de pago para este mes. Monto: {formatPrice(myContract.montoMensual, myContract.moneda)}
                </p>
                <Button asChild>
                  <Link to="/dashboard/pago">
                    <Upload className="size-4 mr-2" />
                    Subir comprobante ahora
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentMonthPayment.estado === 'pendiente' ? (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Clock className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Comprobante en revisión</h3>
                <p className="text-muted-foreground">
                  Tu comprobante de {getMonthNameLong(currentMonth)} está pendiente de revisión por el dueño
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentMonthPayment.estado === 'aprobado' ? (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Pago de {getMonthNameLong(currentMonth)} aprobado</h3>
                <p className="text-muted-foreground">
                  ¡Todo en orden! Tu pago ha sido verificado y aprobado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                <XCircle className="size-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Pago rechazado</h3>
                <p className="text-muted-foreground mb-2">
                  Tu comprobante de {getMonthNameLong(currentMonth)} fue rechazado. 
                  {currentMonthPayment.motivoRechazo && ` Motivo: ${currentMonthPayment.motivoRechazo}`}
                </p>
                <Button asChild variant="destructive">
                  <Link to="/dashboard/pago">
                    <Upload className="size-4 mr-2" />
                    Subir nuevo comprobante
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract and Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mi contrato activo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {property && (
              <>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {property.imagenes[0] && (
                    <img
                      src={property.imagenes[0]}
                      alt={property.titulo}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{property.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.distrito}, {property.canton}, {property.provincia}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(myContract.montoMensual, myContract.moneda)}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link to="/dashboard/contrato">
                        <FileText className="size-4 mr-2" />
                        Ver contrato
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/dashboard/pago">
                        <Upload className="size-4 mr-2" />
                        Subir pago
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Historial de pagos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/historial">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {getMonthName(payment.mes)} {payment.año}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(payment.monto, payment.moneda)}
                      </p>
                    </div>
                    {getPaymentStatusBadge(payment.estado)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="size-12 mx-auto mb-2 opacity-50" />
                <p>Aún no has realizado pagos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/pago">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Upload className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">Subir comprobante</h3>
                      <p className="text-sm text-muted-foreground">Registra tu pago mensual</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/historial">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">Ver historial</h3>
                      <p className="text-sm text-muted-foreground">Revisa tus pagos anteriores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/contrato">
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">Mi contrato</h3>
                      <p className="text-sm text-muted-foreground">Detalles del alquiler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
