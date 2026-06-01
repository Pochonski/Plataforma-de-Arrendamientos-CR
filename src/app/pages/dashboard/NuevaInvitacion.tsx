import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invitacionSchema, type InvitacionFormData } from '@/lib/validations';
import { useProperties, useCreateInvitation } from '@/lib/hooks';
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
  const navigate = useNavigate();

  const { data: properties = [] } = useProperties(1, user?.id ? { duenoId: user.id } : undefined);
  const myProperties = properties.filter((p) => p.duenoId === user?.id);

  const form = useForm<InvitacionFormData>({
    resolver: zodResolver(invitacionSchema),
    defaultValues: {
      inquilinoCorreo: '',
      propiedadId: '',
      montoAlquiler: 0,
      montoDeposito: 0,
      moneda: 'CRC',
    },
  });

  const { errors } = form.formState;
  const propiedadId = form.watch('propiedadId');
  const selectedProperty = properties.find((p) => p.id === propiedadId);

  const mutation = useCreateInvitation();
  const [createdInvitation, setCreatedInvitation] = useState<any>(null);

  const onSubmit: SubmitHandler<InvitacionFormData> = (data) => {
    mutation.mutate(
      {
        propiedadId: data.propiedadId,
        duenoId: user?.id || '',
        inquilinoCorreo: data.inquilinoCorreo || undefined,
        montoAlquiler: data.montoAlquiler,
        montoDeposito: data.montoDeposito,
        moneda: data.moneda,
      },
      {
        onSuccess: (invitation) => {
          setCreatedInvitation(invitation);
          toast.success('Invitación creada exitosamente');
        },
        onError: () => {
          toast.error('Error al crear la invitación. Intenta de nuevo.');
        },
      },
    );
  };

  const copyInvitationLink = async () => {
    if (createdInvitation) {
      const link = `${window.location.origin}/invitacion/${createdInvitation.token}`;

      try {
        await navigator.clipboard.writeText(link);
        toast.success('Enlace copiado al portapapeles');
      } catch {
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
        } catch {
          toast.error('No se pudo copiar el enlace');
        }
      }
    }
  };

  if (createdInvitation) {
    return (
      <div className="space-y-6">
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
            form.reset();
          }}>
            Crear otra invitación
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mutation.isError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 flex-shrink-0" />
            <span>Error al crear la invitación. Intenta de nuevo.</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información de la invitación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propiedad">Propiedad *</Label>
              <Controller
                name="propiedadId"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const prop = properties.find((p) => p.id === value);
                      if (prop) {
                        form.setValue('montoAlquiler', prop.precio);
                        form.setValue('montoDeposito', prop.precio);
                        form.setValue('moneda', prop.moneda);
                      }
                    }}
                    disabled={mutation.isPending || myProperties.length === 0}
                  >
                    <SelectTrigger className={errors.propiedadId ? 'border-destructive' : ''}>
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
                )}
              />
              {errors.propiedadId && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.propiedadId.message}
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
                  className={errors.montoAlquiler ? 'border-destructive' : ''}
                  {...form.register('montoAlquiler', { valueAsNumber: true })}
                  disabled={mutation.isPending}
                />
                {errors.montoAlquiler && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.montoAlquiler.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposito">Monto depósito de garantía *</Label>
                <Input
                  id="deposito"
                  type="number"
                  placeholder="850000"
                  className={errors.montoDeposito ? 'border-destructive' : ''}
                  {...form.register('montoDeposito', { valueAsNumber: true })}
                  disabled={mutation.isPending}
                />
                <p className="text-xs text-muted-foreground">Por ley suele ser equivalente a un mes</p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="moneda">Moneda *</Label>
                <Controller
                  name="moneda"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRC">Colones (CRC)</SelectItem>
                        <SelectItem value="USD">Dólares (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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
                  className={`pl-10 ${errors.inquilinoCorreo ? 'border-destructive' : ''}`}
                  {...form.register('inquilinoCorreo')}
                  disabled={mutation.isPending}
                />
              </div>
              {errors.inquilinoCorreo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.inquilinoCorreo.message}
                </p>
              )}
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
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || myProperties.length === 0}>
            <Mail className="size-4 mr-2" />
            {mutation.isPending ? 'Creando...' : 'Crear invitación'}
          </Button>
        </div>
      </form>
    </div>
  );
}
