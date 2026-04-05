import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
import { ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EditarPropiedad() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { properties, updateProperty, getPropertyById } = useData();
  const navigate = useNavigate();

  const property = id ? getPropertyById(id) : null;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState<'CRC' | 'USD'>('CRC');
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setTitulo(property.titulo);
      setDescripcion(property.descripcion);
      setPrecio(property.precio.toString());
      setMoneda(property.moneda);
      setProvincia(property.provincia);
      setCanton(property.canton);
      setDistrito(property.distrito);
      setTipo(property.tipo);
      setEstado(property.estado);
      setImagenes(property.imagenes);
      setCaracteristicas(property.caracteristicas);
    }
  }, [property]);

  const provincias = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón',
  ];

  const tipos = [
    { value: 'casa', label: 'Casa' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'local', label: 'Local comercial' },
    { value: 'bodega', label: 'Bodega' },
    { value: 'oficina', label: 'Oficina' },
  ];

  const estados = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'alquilada', label: 'Alquilada' },
    { value: 'mantenimiento', label: 'En mantenimiento' },
  ];

  const imagenesSugeridas = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ];

  if (!property || property.duenoId !== user?.id) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Propiedad no encontrada</h2>
        <p className="text-muted-foreground mb-6">
          No tienes permiso para editar esta propiedad
        </p>
        <Button onClick={() => navigate('/dashboard/propiedades')}>
          Volver a mis propiedades
        </Button>
      </Card>
    );
  }

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

    if (!titulo || !descripcion || !precio || !provincia || !canton || !distrito || !tipo) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (imagenes.length === 0) {
      setError('Agrega al menos una imagen');
      return;
    }

    setIsLoading(true);

    try {
      updateProperty(property.id, {
        titulo,
        descripcion,
        precio: parseFloat(precio),
        moneda,
        provincia,
        canton,
        distrito,
        tipo: tipo as any,
        estado: estado as any,
        imagenes,
        caracteristicas,
      });

      toast.success('Propiedad actualizada exitosamente');
      navigate('/dashboard/propiedades');
    } catch (err) {
      setError('Error al actualizar la propiedad. Intenta de nuevo.');
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
          <h1 className="text-3xl font-bold">Editar Propiedad</h1>
          <p className="text-muted-foreground">Actualiza la información de tu propiedad</p>
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
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la propiedad, sus características principales..."
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio mensual *</Label>
                <Input
                  id="precio"
                  type="number"
                  placeholder="850000"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  disabled={isLoading}
                />
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

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={estado} onValueChange={setEstado} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de propiedad *</Label>
              <Select value={tipo} onValueChange={setTipo} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select value={provincia} onValueChange={setProvincia} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {provincias.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón *</Label>
                <Input
                  id="canton"
                  placeholder="Ej: Escazú"
                  value={canton}
                  onChange={(e) => setCanton(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito *</Label>
                <Input
                  id="distrito"
                  placeholder="Ej: San Rafael"
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                  disabled={isLoading}
                />
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
              <Label className="mb-2 block">Agregar más imágenes</Label>
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
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
