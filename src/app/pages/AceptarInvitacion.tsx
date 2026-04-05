import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AceptarInvitacion() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getInvitationByToken,
    getPropertyById,
    updateInvitation,
    createContract,
    addNotification,
    getUserById,
  } = useData();

  const [invitation, setInvitation] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const inv = getInvitationByToken(token);
    if (inv) {
      setInvitation(inv);
      const prop = getPropertyById(inv.propiedadId);
      const ownerData = getUserById(inv.duenoId);
      setProperty(prop);
      setOwner(ownerData);
    }
    setLoading(false);
  }, [token, getInvitationByToken, getPropertyById, getUserById, navigate]);

  const handleAccept = async () => {
    if (!user || !invitation || !property) return;

    setProcessing(true);

    try {
      // Actualizar estado de la invitación
      updateInvitation(invitation.id, {
        estado: 'aceptada',
        inquilinoId: user.id,
      });

      // Crear el contrato
      createContract({
        invitacionId: invitation.id,
        propiedadId: invitation.propiedadId,
        duenoId: invitation.duenoId,
        inquilinoId: user.id,
        montoMensual: invitation.montoAlquiler,
        moneda: invitation.moneda,
        fechaInicio: new Date(),
        estado: 'activo',
      });

      // Notificar al dueño
      addNotification({
        userId: invitation.duenoId,
        tipo: 'invitacion_aceptada',
        titulo: 'Invitación aceptada',
        mensaje: `${user.nombre} ha aceptado tu invitación para ${property.titulo}`,
        leida: false,
        fecha: new Date(),
        link: '/dashboard/invitaciones',
      });

      toast.success('¡Invitación aceptada exitosamente!', {
        description: 'Tu contrato ha sido creado. Revísalo en tu dashboard.',
      });

      setTimeout(() => {
        navigate('/dashboard/contrato');
      }, 1500);
    } catch (error) {
      toast.error('Error al aceptar la invitación', {
        description: 'Por favor intenta nuevamente.',
      });
      setProcessing(false);
    }
  };

  const handleReject = () => {
    if (!invitation) return;

    updateInvitation(invitation.id, {
      estado: 'cancelada',
    });

    toast.info('Invitación rechazada', {
      description: 'Has rechazado esta invitación de contrato.',
    });

    setTimeout(() => {
      navigate('/propiedades');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <AlertTriangle className="size-6 text-amber-600 dark:text-amber-500" />
            </div>
            <CardTitle>Inicia sesión para continuar</CardTitle>
            <CardDescription>
              Debes iniciar sesión como inquilino para aceptar esta invitación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => navigate('/login', { state: { returnTo: `/invitacion/${token}` } })}
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="size-6 text-destructive" />
            </div>
            <CardTitle>Invitación no encontrada</CardTitle>
            <CardDescription>
              Esta invitación no existe o ha sido eliminada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate('/propiedades')}
            >
              Ver propiedades disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date() > new Date(invitation.fechaExpiracion);
  const isAlreadyAccepted = invitation.estado === 'aceptada';
  const isCanceled = invitation.estado === 'cancelada';

  if (isExpired || isAlreadyAccepted || isCanceled) {
    let icon, title, description, variant;

    if (isExpired) {
      icon = Clock;
      title = 'Invitación expirada';
      description = 'Esta invitación ha expirado. Contacta al dueño para recibir una nueva.';
      variant = 'amber';
    } else if (isAlreadyAccepted) {
      icon = CheckCircle2;
      title = 'Invitación ya aceptada';
      description = 'Esta invitación ya fue aceptada. Puedes ver tu contrato en el dashboard.';
      variant = 'green';
    } else {
      icon = XCircle;
      title = 'Invitación cancelada';
      description = 'Esta invitación ha sido cancelada por el dueño.';
      variant = 'red';
    }

    const IconComponent = icon;
    const bgColor =
      variant === 'amber'
        ? 'bg-amber-100 dark:bg-amber-900/20'
        : variant === 'green'
        ? 'bg-green-100 dark:bg-green-900/20'
        : 'bg-destructive/10';
    const iconColor =
      variant === 'amber'
        ? 'text-amber-600 dark:text-amber-500'
        : variant === 'green'
        ? 'text-green-600 dark:text-green-500'
        : 'text-destructive';

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 size-12 rounded-full ${bgColor} flex items-center justify-center`}>
              <IconComponent className={`size-6 ${iconColor}`} />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAlreadyAccepted && (
              <Button className="w-full" onClick={() => navigate('/dashboard/contrato')}>
                Ver mi contrato
              </Button>
            )}
            <Button
              className="w-full"
              variant={isAlreadyAccepted ? 'outline' : 'default'}
              onClick={() => navigate('/propiedades')}
            >
              Ver propiedades disponibles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'CRC'
      ? `₡${amount.toLocaleString('es-CR')}`
      : `$${amount.toLocaleString('en-US')}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Invitación de contrato de arrendamiento</CardTitle>
                <CardDescription>Revisa los detalles antes de aceptar</CardDescription>
              </div>
            </div>

            <Alert>
              <Calendar className="size-4" />
              <AlertDescription>
                Esta invitación expira el{' '}
                <strong>
                  {format(new Date(invitation.fechaExpiracion), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
                    locale: es,
                  })}
                </strong>
              </AlertDescription>
            </Alert>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Property Details */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Home className="size-5" />
                Detalles de la propiedad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={property.imagenes[0]}
                    alt={property.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg">{property.titulo}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-4" />
                      {property.distrito}, {property.canton}, {property.provincia}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Descripción</p>
                    <p className="text-sm">{property.descripcion}</p>
                  </div>

                  {property.caracteristicas && property.caracteristicas.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Características</p>
                      <div className="flex flex-wrap gap-1.5">
                        {property.caracteristicas.slice(0, 6).map((caracteristica: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {caracteristica}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contract Details */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="size-5" />
                Detalles del contrato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Monto mensual</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(invitation.montoAlquiler, invitation.moneda)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Propietario</p>
                    <p className="font-semibold">{owner?.nombre || 'No disponible'}</p>
                    <p className="text-sm text-muted-foreground">{owner?.correo || ''}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="size-4" />
              <AlertDescription>
                Al aceptar esta invitación, se creará un contrato de arrendamiento activo. Asegúrate de haber
                leído y entendido todos los términos antes de continuar.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAccept}
                disabled={processing}
              >
                <CheckCircle2 className="size-5 mr-2" />
                {processing ? 'Procesando...' : 'Aceptar invitación'}
              </Button>
              <Button
                className="flex-1"
                size="lg"
                variant="outline"
                onClick={handleReject}
                disabled={processing}
              >
                <XCircle className="size-5 mr-2" />
                Rechazar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
