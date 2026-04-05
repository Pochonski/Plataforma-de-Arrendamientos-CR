import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ArrowLeft, Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function SubirComprobante() {
  const { user } = useAuth();
  const { getContractByInquilinoId, addPayment, properties } = useData();
  const navigate = useNavigate();

  const myContract = getContractByInquilinoId(user?.id || '');
  const property = myContract ? properties.find((p) => p.id === myContract.propiedadId) : null;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [mes, setMes] = useState(currentMonth.toString());
  const [año, setAño] = useState(currentYear.toString());
  const [comprobante, setComprobante] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!myContract || !property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Subir Comprobante</h1>
          </div>
        </div>

        <Card className="p-12 text-center">
          <AlertCircle className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No tienes un contrato activo</h2>
          <p className="text-muted-foreground mb-6">
            Necesitas tener un contrato activo para subir comprobantes de pago
          </p>
          <Button onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
        </Card>
      </div>
    );
  }

  const meses = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const años = [currentYear - 1, currentYear, currentYear + 1];

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo debe ser menor a 5MB');
        return;
      }

      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        setError('Solo se permiten imágenes JPG, PNG o WEBP');
        return;
      }

      setError('');
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobante(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!comprobante) {
      setError('Por favor selecciona un comprobante');
      return;
    }

    setIsLoading(true);

    try {
      addPayment({
        contratoId: myContract.id,
        propiedadId: myContract.propiedadId,
        inquilinoId: myContract.inquilinoId,
        duenoId: myContract.duenoId,
        mes: parseInt(mes),
        año: parseInt(año),
        monto: myContract.montoMensual,
        moneda: myContract.moneda,
        comprobante,
        estado: 'pendiente',
        fechaSubida: new Date(),
      });

      toast.success('Comprobante subido exitosamente');
      navigate('/dashboard');
    } catch (err) {
      setError('Error al subir el comprobante. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Subir Comprobante de Pago</h1>
          <p className="text-muted-foreground">Registra tu pago mensual de alquiler</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="size-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Period Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Periodo de pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mes">Mes</Label>
                    <Select value={mes} onValueChange={setMes} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="año">Año</Label>
                    <Select value={año} onValueChange={setAño} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {años.map((a) => (
                          <SelectItem key={a} value={a.toString()}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted space-y-1">
                  <p className="text-sm text-muted-foreground">Monto a pagar</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(myContract.montoMensual, myContract.moneda)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Comprobante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comprobante">
                    Imagen del comprobante (SINPE, transferencia, depósito)
                  </Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Input
                        id="comprobante"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      {comprobante && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setComprobante(null);
                            setFileName('');
                          }}
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB
                    </p>
                  </div>
                </div>

                {comprobante && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Vista previa</Label>
                    <div className="relative rounded-lg overflow-hidden border bg-muted max-w-md">
                      <img
                        src={comprobante}
                        alt="Comprobante"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {fileName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Instrucciones importantes
                    </p>
                    <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                      <li>• Asegúrate de que la imagen sea legible y muestre todos los detalles</li>
                      <li>• Verifica que el monto y la fecha sean correctos</li>
                      <li>• El dueño revisará y aprobará tu comprobante</li>
                      <li>• Recibirás una notificación cuando sea aprobado o rechazado</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !comprobante}>
                <Upload className="size-4 mr-2" />
                {isLoading ? 'Subiendo...' : 'Subir comprobante'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar - Contract Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {property.imagenes[0] && (
                  <img
                    src={property.imagenes[0]}
                    alt={property.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{property.titulo}</h3>
                <p className="text-sm text-muted-foreground">
                  {property.distrito}, {property.canton}
                </p>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Monto mensual</p>
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(myContract.montoMensual, myContract.moneda)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Si tienes problemas para subir tu comprobante o necesitas más información, contáctanos.</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:soporte@plataforma.com">
                  Contactar soporte
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
