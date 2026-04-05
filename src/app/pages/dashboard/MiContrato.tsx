import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router';
import {
  FileText,
  Home,
  Calendar,
  CreditCard,
  Download,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function MiContrato() {
  const { user } = useAuth();
  const { getContractByInquilinoId, properties } = useData();

  const myContract = getContractByInquilinoId(user?.id || '');
  const property = myContract ? properties.find((p) => p.id === myContract.propiedadId) : null;

  if (!myContract || !property) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Contrato</h1>
          <p className="text-muted-foreground mt-1">
            Detalles de tu contrato de alquiler
          </p>
        </div>

        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <FileText className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No tienes un contrato activo</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Para ver tu contrato, necesitas aceptar una invitación enviada por un dueño
          </p>
          <Button asChild size="lg">
            <Link to="/propiedades">Explorar propiedades</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="size-3 mr-1" />
            Activo
          </Badge>
        );
      case 'finalizado':
        return <Badge variant="secondary">Finalizado</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Contrato</h1>
        <p className="text-muted-foreground mt-1">
          Información detallada de tu contrato de alquiler
        </p>
      </div>

      {/* Status Banner */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Contrato activo</h3>
                <p className="text-muted-foreground text-sm">
                  Desde {new Date(myContract.fechaInicio).toLocaleDateString('es-CR')}
                </p>
              </div>
            </div>
            {getStatusBadge(myContract.estado)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información de la propiedad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              {property.imagenes[0] && (
                <img
                  src={property.imagenes[0]}
                  alt={property.titulo}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{property.titulo}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="size-4" />
                  <span>
                    {property.distrito}, {property.canton}, {property.provincia}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground">{property.descripcion}</p>

              {property.caracteristicas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Características</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {property.caracteristicas.map((car, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
                        <span>{car}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto mensual</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(myContract.montoMensual, myContract.moneda)}
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de inicio</p>
                  <p className="font-semibold">
                    {new Date(myContract.fechaInicio).toLocaleDateString('es-CR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estado</p>
                  <div className="mt-1">{getStatusBadge(myContract.estado)}</div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID del contrato</p>
                  <p className="font-mono text-xs">{myContract.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/dashboard/pago">
                  <CreditCard className="size-4 mr-2" />
                  Subir pago
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard/historial">
                  <Calendar className="size-4 mr-2" />
                  Ver historial
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="size-4 mr-2" />
                Descargar contrato
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Términos y condiciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4>Obligaciones del inquilino:</h4>
            <ul>
              <li>Pagar el monto de alquiler mensual dentro de los primeros 5 días de cada mes</li>
              <li>Mantener la propiedad en buen estado</li>
              <li>Cumplir con las normas del edificio o comunidad</li>
              <li>Notificar cualquier daño o reparación necesaria</li>
            </ul>

            <h4>Derechos del inquilino:</h4>
            <ul>
              <li>Uso exclusivo de la propiedad durante el periodo de alquiler</li>
              <li>Privacidad y notificación previa para visitas del dueño</li>
              <li>Mantenimiento básico por parte del propietario</li>
              <li>Devolución del depósito al finalizar el contrato (si aplica)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
