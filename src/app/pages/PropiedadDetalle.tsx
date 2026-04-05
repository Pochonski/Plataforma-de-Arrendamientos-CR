import { useParams, useNavigate, Link } from 'react-router';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  ArrowLeft,
  MapPin,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PropiedadDetalle() {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById, getOrCreateConversation } = useData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = id ? getPropertyById(id) : null;

  if (!property) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <Building2 className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Propiedad no encontrada</h2>
          <p className="text-muted-foreground mb-6">
            La propiedad que buscas no existe o ha sido eliminada
          </p>
          <Button asChild>
            <Link to="/propiedades">Volver al catálogo</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      local: 'Local comercial',
      bodega: 'Bodega',
      oficina: 'Oficina',
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Back Button */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="aspect-[16/10] bg-muted relative">
                {property.imagenes.length > 0 && (
                  <ImageWithFallback
                    src={property.imagenes[currentImageIndex]}
                    alt={property.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
                {property.imagenes.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`size-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {property.imagenes.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {property.imagenes.slice(0, 4).map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={imagen}
                        alt={`Vista ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{property.titulo}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-5" />
                        <span>
                          {property.distrito}, {property.canton}, {property.provincia}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                      {property.estado}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(property.precio, property.moneda)}
                    </span>
                    <span className="text-lg text-muted-foreground">/mes</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.descripcion}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Detalles</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                      <p className="font-semibold">{getTipoLabel(property.tipo)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Moneda</p>
                      <p className="font-semibold">
                        {property.moneda === 'USD' ? 'Dólares (USD)' : 'Colones (CRC)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Provincia</p>
                      <p className="font-semibold">{property.provincia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cantón</p>
                      <p className="font-semibold">{property.canton}</p>
                    </div>
                  </div>
                </div>

                {property.caracteristicas.length > 0 && (
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Características</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="size-5 text-primary flex-shrink-0" />
                          <span>{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-4">¿Te interesa esta propiedad?</h3>
                  
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          if (!user) {
                            toast.error('Debes iniciar sesión para iniciar una conversación');
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
                        }}
                      >
                        <MessageSquare className="size-4 mr-2" />
                        Enviar mensaje
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Phone className="size-4 mr-2" />
                        Solicitar información
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-4">
                        Inicia sesión para contactar al dueño
                      </p>
                      <Button className="w-full" size="lg" asChild>
                        <Link to="/login">Iniciar sesión</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/registro">Crear cuenta</Link>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <Button variant="ghost" className="w-full">
                    <Share2 className="size-4 mr-2" />
                    Compartir propiedad
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Información importante</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Propiedad verificada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Gestión formal de contrato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Sistema de pagos trazable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>Soporte disponible</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}