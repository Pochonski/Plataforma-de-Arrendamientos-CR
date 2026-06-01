import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propiedadSchema, type PropiedadFormData } from '@/lib/validations';
import { useCreateProperty } from '@/lib/hooks';
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
import { PROVINCIAS, TIPOS_PROPIEDAD } from '../../utils/constants';

export default function NuevaPropiedad() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<PropiedadFormData>({
    resolver: zodResolver(propiedadSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      precio: 0,
      moneda: 'CRC',
      tipo: 'casa',
      provincia: '',
      canton: '',
      distrito: '',
      caracteristicas: [],
      imagenes: [],
      estado: 'disponible',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = form;

  const createProperty = useCreateProperty();

  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');

  const imagenesSugeridas = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ];

  const imagenes = watch('imagenes');
  const caracteristicas = watch('caracteristicas');

  const handleAddCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      setValue('caracteristicas', [...getValues('caracteristicas'), nuevaCaracteristica.trim()]);
      setNuevaCaracteristica('');
    }
  };

  const handleRemoveCaracteristica = (index: number) => {
    setValue('caracteristicas', getValues('caracteristicas').filter((_, i) => i !== index));
  };

  const handleAddImagen = (url: string) => {
    const current = getValues('imagenes');
    if (!current.includes(url)) {
      setValue('imagenes', [...current, url], { shouldValidate: true });
    }
  };

  const handleRemoveImagen = (index: number) => {
    const current = getValues('imagenes');
    setValue('imagenes', current.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<PropiedadFormData> = (data) => {
    createProperty.mutate(
      { ...data, duenoId: user?.id || '' },
      {
        onSuccess: () => {
          toast.success('Propiedad publicada exitosamente');
          navigate('/dashboard/propiedades');
        },
        onError: () => {
          toast.error('Error al publicar la propiedad. Intenta de nuevo.');
        },
      },
    );
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className={errors.titulo ? 'border-destructive' : ''}
                {...register('titulo')}
                disabled={createProperty.isPending}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.titulo.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la propiedad, sus características principales..."
                className={errors.descripcion ? 'border-destructive' : ''}
                rows={4}
                {...register('descripcion')}
                disabled={createProperty.isPending}
              />
              {errors.descripcion && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.descripcion.message}
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
                  className={errors.precio ? 'border-destructive' : ''}
                  {...register('precio')}
                  disabled={createProperty.isPending}
                />
                {errors.precio && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.precio.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="moneda">Moneda *</Label>
                <Controller
                  name="moneda"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={createProperty.isPending}>
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
              <Label htmlFor="tipo">Tipo de propiedad *</Label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={createProperty.isPending}>
                    <SelectTrigger className={errors.tipo ? 'border-destructive' : ''}>
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
                )}
              />
              {errors.tipo && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.tipo.message}
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
              <Controller
                name="provincia"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={createProperty.isPending}>
                    <SelectTrigger className={errors.provincia ? 'border-destructive' : ''}>
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
                )}
              />
              {errors.provincia && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" /> {errors.provincia.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón *</Label>
                <Input
                  id="canton"
                  placeholder="Ej: Escazú"
                  className={errors.canton ? 'border-destructive' : ''}
                  {...register('canton')}
                  disabled={createProperty.isPending}
                />
                {errors.canton && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.canton.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito">Distrito *</Label>
                <Input
                  id="distrito"
                  placeholder="Ej: San Rafael"
                  className={errors.distrito ? 'border-destructive' : ''}
                  {...register('distrito')}
                  disabled={createProperty.isPending}
                />
                {errors.distrito && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-3" /> {errors.distrito.message}
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
            {errors.imagenes && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="size-3" /> {errors.imagenes.message}
              </p>
            )}

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
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCaracteristica())}
                disabled={createProperty.isPending}
              />
              <Button type="button" onClick={handleAddCaracteristica} disabled={createProperty.isPending}>
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
            disabled={createProperty.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={createProperty.isPending}>
            {createProperty.isPending ? 'Publicando...' : 'Publicar propiedad'}
          </Button>
        </div>
      </form>
    </div>
  );
}
