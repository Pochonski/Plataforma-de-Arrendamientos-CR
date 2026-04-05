import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Search, MapPin, Filter, SlidersHorizontal, Grid3x3, List, MessageSquare } from 'lucide-react';
import { Property } from '../types';
import { toast } from 'sonner';

export default function Propiedades() {
  const { properties, getOrCreateConversation, getUserById } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('todas');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [selectedPrecio, setSelectedPrecio] = useState('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

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

  const rangosPrecios = [
    { value: '0-300000', label: 'Menos de ₡300,000' },
    { value: '300000-600000', label: '₡300,000 - ₡600,000' },
    { value: '600000-900000', label: '₡600,000 - ₡900,000' },
    { value: '900000-1200000', label: '₡900,000 - ₡1,200,000' },
    { value: '1200000-999999999', label: 'Más de ₡1,200,000' },
  ];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.provincia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.canton.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvincia =
      selectedProvincia === 'todas' || property.provincia === selectedProvincia;

    const matchesTipo = selectedTipo === 'todos' || property.tipo === selectedTipo;

    let matchesPrecio = true;
    if (selectedPrecio !== 'todos') {
      const [min, max] = selectedPrecio.split('-').map(Number);
      matchesPrecio = property.precio >= min && property.precio <= max;
    }

    return matchesSearch && matchesProvincia && matchesTipo && matchesPrecio && property.estado === 'disponible';
  });

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const handleContactOwner = (property: Property) => {
    if (!isAuthenticated || !user) {
      toast.info('Inicia sesión para contactar al dueño');
      navigate('/login');
      return;
    }

    // Don't allow owner to message themselves
    if (user.id === property.duenoId) {
      toast.info('Esta es tu propiedad');
      return;
    }

    const conversation = getOrCreateConversation(
      [user.id, property.duenoId],
      property.id,
      'consulta_propiedad'
    );

    if (conversation) {
      navigate('/dashboard/mensajes');
      toast.success('Conversación iniciada');
    } else {
      toast.error('No se pudo iniciar la conversación');
    }
  };

  const PropertyCard = ({ property, mode }: { property: Property; mode: 'grid' | 'list' }) => {
    if (mode === 'list') {
      return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-80 aspect-[4/3] sm:aspect-auto overflow-hidden">
              <ImageWithFallback
                src={property.imagenes[0]}
                alt={property.titulo}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="flex-1 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold">{property.titulo}</h3>
                    <Badge variant="secondary">Disponible</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{property.distrito}, {property.canton}, {property.provincia}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(property.precio, property.moneda)}
                  </div>
                  <div className="text-sm text-muted-foreground">/mes</div>
                </div>
              </div>

              <p className="text-muted-foreground line-clamp-2">{property.descripcion}</p>

              <div className="flex flex-wrap gap-2">
                {property.caracteristicas.slice(0, 4).map((caracteristica, idx) => (
                  <Badge key={idx} variant="outline">
                    {caracteristica}
                  </Badge>
                ))}
                {property.caracteristicas.length > 4 && (
                  <Badge variant="outline">+{property.caracteristicas.length - 4} más</Badge>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button asChild className="flex-1 sm:flex-none">
                  <Link to={`/propiedades/${property.id}`}>Ver detalles</Link>
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => handleContactOwner(property)}>
                  Contactar
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={property.imagenes[0]}
            alt={property.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-1 flex-1">{property.titulo}</h3>
            <Badge variant="secondary">Disponible</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="size-4 flex-shrink-0" />
            <span className="line-clamp-1">{property.distrito}, {property.canton}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{property.descripcion}</p>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(property.precio, property.moneda)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/mes</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1" size="sm">
              <Link to={`/propiedades/${property.id}`}>Ver detalles</Link>
            </Button>
            <Button variant="outline" className="flex-1" size="sm" onClick={() => handleContactOwner(property)}>
              Contactar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold">Encuentra tu hogar ideal</h1>
            <p className="text-lg text-muted-foreground">
              Explora nuestro catálogo de propiedades disponibles en todo Costa Rica
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                placeholder="Busca por ubicación, tipo de propiedad o características..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
              <SelectTrigger>
                <SelectValue placeholder="Provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las provincias</SelectItem>
                {provincias.map((provincia) => (
                  <SelectItem key={provincia} value={provincia}>
                    {provincia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPrecio} onValueChange={setSelectedPrecio}>
              <SelectTrigger>
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los precios</SelectItem>
                {rangosPrecios.map((rango) => (
                  <SelectItem key={rango.value} value={rango.value}>
                    {rango.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
          <Button variant="ghost" size="sm">
            <SlidersHorizontal className="size-4 mr-2" />
            Más filtros
          </Button>
        </div>

        {/* Properties Grid/List */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredProperties.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} mode={viewMode} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron propiedades</h3>
            <p className="text-muted-foreground mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedProvincia('todas');
                setSelectedTipo('todos');
                setSelectedPrecio('todos');
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}