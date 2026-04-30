import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../utils/formatters';

export default function NuevaInvitacion() {
  const { user } = useAuth();
  const { properties, createInvitation } = useData();
  const navigate = useNavigate();

  const myProperties = properties.filter((p) => p.duenoId === user?.id);

  const [propiedadId, setPropiedadId] = useState('');
  const [inquilinoCorreo, setInquilinoCorreo] = useState('');
  const [montoAlquiler, setMontoAlquiler] = useState('');
  const [montoDeposito, setMontoDeposito] = useState('');
  const [moneda, setMoneda] = useState<'CRC' | 'USD'>('CRC');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvitation, setCreatedInvitation] = useState<any>(null);

  const selectedProperty = properties.find((p) => p.id === propiedadId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!propiedadId) errors.propiedadId = 'Por favor selecciona la propiedad';
    if (!montoAlquiler) errors.montoAlquiler = 'Por favor ingresa el monto de alquiler';
    if (!montoDeposito) errors.montoDeposito = 'Por favor ingresa el monto del depósito';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (inquilinoCorreo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquilinoCorreo)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      const invitation = createInvitation({
        propiedadId,
        duenoId: user?.id || '',
        inquilinoCorreo: inquilinoCorreo || undefined,
        montoAlquiler: parseFloat(montoAlquiler),
        montoDeposito: parseFloat(montoDeposito),
        moneda,
      });

      setCreatedInvitation(invitation);
      toast.success('Invitación creada exitosamente');
    } catch (err) {
      setError('Error al crear la invitación. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationLink = async () => {
    if (createdInvitation) {
      const link = `${window.location.origin}/invitacion/${createdInvitation.token}`;
      
      try {
        // Try modern clipboard API first
        await navigator.clipboard.writeText(link);
        toast.success('Enlace copiado al portapapeles');
      } catch (err) {
        // Fallback for when clipboard API is blocked
        try {
          const textArea = document.createElement('textarea');
          textArea.value = link;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            toast.success('Enlace copiado al portapapeles');
          } else {
            toast.error('No se pudo copiar el enlace');
          }
        } catch (fallbackErr) {
          toast.error('No se pudo copiar el enlace');
          console.error('Error al copiar:', fallbackErr);
        }
      }
    }
  };

  if (createdInvitation) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/invitaciones')}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invitación Creada</h1>
            <p className="text-muted-foreground">Comparte el enlace con tu inquilino</p>
          </div>
        </div>

        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">¡Invitación creada exitosamente!</h3>
                <p className="text-muted-foreground text-sm">
                  La invitación expirará en 48 horas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la invitación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Propiedad</Label>
                <p className="font-semibold">
                  {properties.find((p) => p.id === createdInvitation.propiedadId)?.titulo}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Monto mensual</Label>
                <p className="font-semibold text-lg text-primary">
                  {formatPrice(createdInvitation.montoAlquiler, createdInvitation.moneda)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Depósito de garantía</Label>
                <p className="font-semibold text-lg text-primary">
                  {formatPrice(createdInvitation.montoDeposito, createdInvitation.moneda)}
                </p>
              </div>
              {createdInvitation.inquilinoCorreo && (
                <div>
                  <Label className="text-muted-foreground">Inquilino</Label>
                  <p className="font-semibold">{createdInvitation.inquilinoCorreo}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Expira</Label>
                <p className="font-semibold">
                  {new Date(createdInvitation.fechaExpiracion).toLocaleString('es-CR')}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block">Enlace de invitación</Label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/invitacion/${createdInvitation.token}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyInvitationLink}>
                  <Copy className="size-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Comparte este enlace con tu inquilino para que pueda aceptar la invitación
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard/invitaciones')}>
            Ver todas las invitaciones
          </Button>
          <Button onClick={() => {
            setCreatedInvitation(null);
            setPropiedadId('');
            setInquilinoCorreo('');
            setMontoAlquiler('');
            setMontoDeposito('');
          }}>
            Crear otra invitación
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nueva Invitación</h1>
          <p className="text-muted-foreground">Crea una invitación de contrato para un inquilino</p>
        </div>
      </div>

      {myProperties.length === 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="size-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">No tienes propiedades</h3>
                <p className="text-sm text-muted-foreground">
                  Necesitas publicar al menos una propiedad antes de crear invitaciones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información de la invitación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propiedad">Propiedad *</Label>
              <Select
                value={propiedadId}
                onValueChange={(value) => {
                  setPropiedadId(value);
                  if (fieldErrors.propiedadId) setFieldErrors(prev => ({ ...prev, propiedadId: '' }));
                  const prop = properties.find((p) => p.id === value);
                  if (prop) {
                    setMontoAlquiler(prop.precio.toString());
                    setMontoDeposito(prop.precio.toString()); // El depósito por defecto es 1 mensualidad
                    setMoneda(prop.moneda);
                  }
                }}
                disabled={isLoading || myProperties.length === 0}
              >
                <SelectTrigger className={fieldErrors.propiedadId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {myProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.titulo} - {formatPrice(property.precio, property.moneda)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.propiedadId && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.propiedadId}
                </p>
              )}
            </div>

            {selectedProperty && (
              <div className="p-4 rounded-lg bg-muted space-y-2">
                <p className="text-sm font-semibold">Información de la propiedad</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.distrito}, {selectedProperty.canton}, {selectedProperty.provincia}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monto">Monto mensual de alquiler *</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="850000"
                  className={fieldErrors.montoAlquiler ? 'border-destructive' : ''}
                  value={montoAlquiler}
                  onChange={(e) => {
                    setMontoAlquiler(e.target.value);
                    if (fieldErrors.montoAlquiler) setFieldErrors(prev => ({ ...prev, montoAlquiler: '' }));
                  }}
                  disabled={isLoading}
                />
                {fieldErrors.montoAlquiler && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.montoAlquiler}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposito">Monto depósito de garantía *</Label>
                <Input
                  id="deposito"
                  type="number"
                  placeholder="850000"
                  className={fieldErrors.montoDeposito ? 'border-destructive' : ''}
                  value={montoDeposito}
                  onChange={(e) => {
                    setMontoDeposito(e.target.value);
                    if (fieldErrors.montoDeposito) setFieldErrors(prev => ({ ...prev, montoDeposito: '' }));
                  }}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Por ley suele ser equivalente a un mes</p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="moneda">Moneda *</Label>
                <Select value={moneda} onValueChange={(value: 'CRC' | 'USD') => setMoneda(value)} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRC">Colones (CRC)</SelectItem>
                    <SelectItem value="USD">Dólares (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo del inquilino (opcional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="inquilino@ejemplo.com"
                  className="pl-10"
                  value={inquilinoCorreo}
                  onChange={(e) => setInquilinoCorreo(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Si lo dejas vacío, cualquier persona con el enlace podrá aceptar la invitación
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Información importante
                </p>
                <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• La invitación expirará automáticamente en 48 horas</li>
                  <li>• Recibirás una notificación cuando sea aceptada</li>
                  <li>• Puedes cancelar la invitación en cualquier momento</li>
                  <li>• El inquilino debe crear una cuenta para aceptarla</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || myProperties.length === 0}>
            <Mail className="size-4 mr-2" />
            {isLoading ? 'Creando...' : 'Crear invitación'}
          </Button>
        </div>
      </form>
    </div>
  );
}