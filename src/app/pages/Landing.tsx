import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  Search,
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useData } from '../contexts/DataContext';

export default function Landing() {
  const { properties } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Obtener propiedades disponibles para mostrar
  const availableProperties = properties.filter(p => p.estado === 'disponible').slice(0, 6);
  
  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const features = [
    {
      icon: Search,
      title: 'Busca propiedades',
      description: 'Encuentra el lugar perfecto con nuestro catálogo actualizado de propiedades en alquiler.',
    },
    {
      icon: FileText,
      title: 'Formaliza contratos',
      description: 'Gestiona invitaciones y contratos de forma segura y trazable.',
    },
    {
      icon: CreditCard,
      title: 'Registra pagos',
      description: 'Sube comprobantes de SINPE o transferencia y lleva control total.',
    },
    {
      icon: BarChart3,
      title: 'Historial ordenado',
      description: 'Accede a todo tu historial de pagos y documentos en un solo lugar.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Regístrate',
      description: 'Crea tu cuenta como dueño o inquilino en menos de un minuto.',
    },
    {
      number: '2',
      title: 'Publica o busca',
      description: 'Los dueños publican propiedades, los inquilinos encuentran su hogar ideal.',
    },
    {
      number: '3',
      title: 'Formaliza',
      description: 'Genera invitaciones de contrato seguras con un enlace único.',
    },
    {
      number: '4',
      title: 'Gestiona',
      description: 'Registra pagos mensuales y mantén todo documentado.',
    },
  ];

  const benefits = [
    'Sin necesidad de intercambiar comprobantes por chat',
    'Historial completo siempre disponible',
    'Invitaciones con expiración automática',
    'Revisión y aprobación de pagos centralizada',
    'Notificaciones en tiempo real',
    'Interfaz moderna y fácil de usar',
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5">
              <TrendingUp className="size-3 mr-1.5" />
              Plataforma moderna de arrendamientos
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Encuentra propiedades, formaliza tu alquiler y controla tus pagos{' '}
              <span className="text-primary">en un solo lugar</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La solución completa para gestionar arrendamientos en Costa Rica de forma segura,
              transparente y profesional.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  placeholder="Busca por ubicación, tipo de propiedad..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-8" asChild>
                <Link to="/propiedades">Buscar propiedades</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>Todas las provincias</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="size-4" />
                <span>Verificadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4" />
                <span>Gestión segura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Propiedades destacadas</h2>
              <p className="text-muted-foreground mt-1">Descubre las mejores opciones disponibles</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/propiedades">Ver todas</Link>
            </Button>
          </div>

          {availableProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/propiedades/${property.id}`}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={property.imagenes[0]}
                        alt={property.titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-1">{property.titulo}</h3>
                        <Badge variant="secondary">Disponible</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="size-4" />
                        <span className="line-clamp-1">{property.distrito}, {property.canton}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-2xl font-bold text-primary">{formatPrice(property.precio, property.moneda)}</span>
                        <span className="text-sm text-muted-foreground">/mes</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <Building2 className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay propiedades disponibles</h3>
              <p className="text-muted-foreground mb-6">
                Explora todas las propiedades en nuestro catálogo completo
              </p>
              <Button asChild>
                <Link to="/propiedades">Ver todas las propiedades</Link>
              </Button>
            </Card>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/propiedades">Ver todas las propiedades</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="beneficios" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-muted-foreground">
              Una plataforma completa que resuelve los problemas más comunes en la gestión de alquileres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-muted-foreground">
              En cuatro pasos simples estarás gestionando tus alquileres de forma profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Olvídate de los pagos perdidos en WhatsApp
              </h2>
              <p className="text-muted-foreground mb-8">
                Llevamos tu gestión de alquileres al siguiente nivel con herramientas diseñadas
                específicamente para el mercado costarricense.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/registro">Comenzar gratis</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/propiedades">Explorar propiedades</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1720678554596-bab43d25ebd1?w=800"
                  alt="Plataforma de arrendamientos"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              ¿Listo para modernizar tu gestión de alquileres?
            </h2>
            <p className="text-lg opacity-90">
              Únete a cientos de dueños e inquilinos que ya confían en nuestra plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/registro">Crear cuenta gratis</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-colors font-semibold"
                asChild
              >
                <Link to="/propiedades">Ver propiedades</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
