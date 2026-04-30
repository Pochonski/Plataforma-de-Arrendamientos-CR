import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, X, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PROVINCIAS, TIPOS_PROPIEDAD } from '../../utils/constants';

export default function NuevaPropiedad() {
  const { user } = useAuth();
  const { addProperty } = useData();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState<'CRC' | 'USD'>('CRC');
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');
  const [tipo, setTipo] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const imagenesSugeridas = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ];

  const handleAddCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      setCaracteristicas([...caracteristicas, nuevaCaracteristica.trim()]);
      setNuevaCaracteristica('');
    }
  };

  const handleRemoveCaracteristica = (index: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== index));
  };

  const handleAddImagen = (url: string) => {
    if (!imagenes.includes(url)) {
      setImagenes([...imagenes, url]);
    }
  };

  const handleRemoveImagen = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!titulo.trim()) errors.titulo = 'Por favor completa el título';
    if (!descripcion.trim()) errors.descripcion = 'Por favor completa la descripción';
    if (!precio) errors.precio = 'Por favor ingresa el precio';
    if (!provincia) errors.provincia = 'Por favor selecciona la provincia';
    if (!canton.trim()) errors.canton = 'Por favor ingresa el cantón';
    if (!distrito.trim()) errors.distrito = 'Por favor ingresa el distrito';
    if (!tipo) errors.tipo = 'Por favor selecciona el tipo';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (imagenes.length === 0) {
      setError('Agrega al menos una imagen');
      return;
    }

    setIsLoading(true);

    try {
      addProperty({
        titulo,
        descripcion,
        precio: parseFloat(precio),
        moneda,
        provincia,
        canton,
        distrito,
        tipo: tipo as any,
        estado: 'disponible',
        imagenes,
        duenoId: user?.id || '',
        caracteristicas,
      });

      toast.success('Propiedad publicada exitosamente');
      navigate('/dashboard/propiedades');
    } catch (err) {
      setError('Error al publicar la propiedad. Intenta de nuevo.');
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
          <h1 className="text-3xl font-bold">Nueva Propiedad</h1>
          <p className="text-muted-foreground">Publica una nueva propiedad en alquiler</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la propiedad *</Label>
              <Input
                id="titulo"
                placeholder="Ej: Apartamento moderno en Escazú"
                className={fieldErrors.titulo ? 'border-destructive' : ''}
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  if (fieldErrors.titulo) setFieldErrors(prev => ({ ...prev, titulo: '' }));
                }}
                disabled={isLoading}
              />
              {fieldErrors.titulo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.titulo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la propiedad, sus características principales..."
                className={fieldErrors.descripcion ? 'border-destructive' : ''}
                rows={4}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  if (fieldErrors.descripcion) setFieldErrors(prev => ({ ...prev, descripcion: '' }));
                }}
                disabled={isLoading}
              />
              {fieldErrors.descripcion && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.descripcion}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio mensual *</Label>
                <Input
                  id="precio"
                  type="number"
                  placeholder="850000"
                  className={fieldErrors.precio ? 'border-destructive' : ''}
                  value={precio}
                  onChange={(e) => {
                    setPrecio(e.target.value);
                    if (fieldErrors.precio) setFieldErrors(prev => ({ ...prev, precio: '' }));
                  }}
                  disabled={isLoading}
                />
                {fieldErrors.precio && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.precio}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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
              <Label htmlFor="tipo">Tipo de propiedad *</Label>
              <Select value={tipo} onValueChange={(v) => { setTipo(v); if (fieldErrors.tipo) setFieldErrors(prev => ({ ...prev, tipo: '' })); }} disabled={isLoading}>
                <SelectTrigger className={fieldErrors.tipo ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PROPIEDAD.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.tipo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.tipo}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia *</Label>
              <Select value={provincia} onValueChange={(v) => { setProvincia(v); if (fieldErrors.provincia) setFieldErrors(prev => ({ ...prev, provincia: '' })); }} disabled={isLoading}>
                <SelectTrigger className={fieldErrors.provincia ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCIAS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.provincia && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {fieldErrors.provincia}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón *</Label>
                <Input
                  id="canton"
                  placeholder="Ej: Escazú"
                  className={fieldErrors.canton ? 'border-destructive' : ''}
                  value={canton}
                  onChange={(e) => {
                    setCanton(e.target.value);
                    if (fieldErrors.canton) setFieldErrors(prev => ({ ...prev, canton: '' }));
                  }}
                  disabled={isLoading}
                />
                {fieldErrors.canton && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.canton}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito *</Label>
                <Input
                  id="distrito"
                  placeholder="Ej: San Rafael"
                  className={fieldErrors.distrito ? 'border-destructive' : ''}
                  value={distrito}
                  onChange={(e) => {
                    setDistrito(e.target.value);
                    if (fieldErrors.distrito) setFieldErrors(prev => ({ ...prev, distrito: '' }));
                  }}
                  disabled={isLoading}
                />
                {fieldErrors.distrito && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {fieldErrors.distrito}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecciona imágenes para tu propiedad (mínimo 1)
            </p>
            
            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {imagenes.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImagen(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label className="mb-2 block">Imágenes disponibles</Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {imagenesSugeridas.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAddImagen(img)}
                    disabled={imagenes.includes(img)}
                    className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img src={img} alt={`Sugerida ${index + 1}`} className="w-full h-full object-cover" />
                    {imagenes.includes(img) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Badge>Agregada</Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ej: 2 habitaciones, Parqueo..."
                value={nuevaCaracteristica}
                onChange={(e) => setNuevaCaracteristica(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCaracteristica())}
                disabled={isLoading}
              />
              <Button type="button" onClick={handleAddCaracteristica} disabled={isLoading}>
                <Plus className="size-4 mr-2" />
                Agregar
              </Button>
            </div>

            {caracteristicas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {caracteristicas.map((car, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1.5">
                    {car}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-5 ml-2 hover:bg-transparent"
                      onClick={() => handleRemoveCaracteristica(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar propiedad'}
          </Button>
        </div>
      </form>
    </div>
  );
}
