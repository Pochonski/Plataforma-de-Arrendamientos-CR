import { Link, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';
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
  Zap,
  Users,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

export default function Landing() {
  const { properties } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Manejar scroll a anclas manualmente para mayor robustez
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash, location.pathname]);
  
  // Obtener propiedades disponibles para mostrar
  const availableProperties = properties.filter(p => p.estado === 'disponible').slice(0, 6);
  
  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const features = [
    {
      icon: Shield,
      title: 'Control Total',
      description: 'Gestiona tus propiedades, contratos y pagos desde un panel centralizado. Olvida las hojas de cálculo y los chats desordenados.',
    },
    {
      icon: Lock,
      title: 'Seguridad Jurídica',
      description: 'Invitaciones inteligentes y contratos con trazabilidad completa que protegen tanto al dueño como al inquilino.',
    },
    {
      icon: Zap,
      title: 'Pagos Ágiles',
      description: 'Registro de SINPE y transferencias con soporte de comprobante. Notificaciones automáticas de aprobación en tiempo real.',
    },
    {
      icon: BarChart3,
      title: 'Historial Perpetuo',
      description: 'Accede a tus recibos y documentos en cualquier momento. Un respaldo digital siempre a tu alcance y organizado.',
    },
  ];

  const steps = [
    {
      title: 'Perfil Verificado',
      description: 'Únete a nuestra comunidad. Validamos identidades para asegurar un entorno de confianza.',
      icon: Users,
    },
    {
      title: 'Conexión Inteligente',
      description: 'Publica tus inmuebles con visibilidad premium o encuentra el hogar que siempre soñaste.',
      icon: Search,
    },
    {
      title: 'Contratos Digitales',
      description: 'Gestiona términos y depósitos de forma guiada. Acuerdos claros y seguros para ambas partes.',
      icon: FileText,
    },
    {
      title: 'Vida Simple',
      description: 'Automatiza el flujo mensual. Sube comprobantes, recibe recordatorios y visualiza tu estado.',
      icon: CreditCard,
    },
  ];

  const benefits = [
    {
      title: 'Gestión Centralizada',
      description: 'Adiós a los comprobantes perdidos en chats de WhatsApp. Todo queda registrado formalmente.',
      icon: Building2,
    },
    {
      title: 'Trazabilidad Fiscal',
      description: 'Mantén un registro ordenado de todos tus ingresos y egresos por arrendamiento.',
      icon: TrendingUp,
    },
    {
      title: 'Seguridad Digital',
      description: 'Documentos protegidos y respaldados en la nube con altos estándares de seguridad Azure.',
      icon: Shield,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <Badge variant="secondary" className="px-4 py-1.5 animate-pulse">
              <TrendingUp className="size-3 mr-1.5" />
              La plataforma #1 de arrendamientos en Costa Rica
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Revoluciona la forma de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Alquilar y Cobrar
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              La solución tecnológica integral que profesionaliza el arrendamiento en Costa Rica.
              Segura, transparente y diseñada para tu tranquilidad.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  placeholder="Ubicación, tipo de propiedad o palabras clave..."
                  className="pl-12 h-14 text-lg border-2 border-primary/20 focus:border-primary transition-all rounded-xl shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/20 transition-all" asChild>
                <Link to="/propiedades">Explorar Ahora</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground pt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
                <MapPin className="size-4 text-primary" />
                <span>Cobertura Nacional</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Propiedades Verificadas</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border/50">
                <Shield className="size-4 text-primary" />
                <span>Gestión Encriptada</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary font-bold">Catálogo Seleccionado</Badge>
              <h2 className="text-4xl font-bold tracking-tight">Propiedades Destacadas</h2>
              <p className="text-muted-foreground text-lg">Inicia tu nueva etapa en estos espacios exclusivos</p>
            </div>
            <Button variant="ghost" asChild className="group text-lg font-semibold">
              <Link to="/propiedades" className="flex items-center gap-2">
                Ver todo el catálogo <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {availableProperties.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {availableProperties.map((property) => (
                <motion.div key={property.id} variants={itemVariants}>
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-background shadow-lg rounded-2xl">
                    <Link to={`/propiedades/${property.id}`}>
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <ImageWithFallback
                          src={property.imagenes[0]}
                          alt={property.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md border-none px-3 py-1">Disponible</Badge>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{property.titulo}</h3>
                          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <MapPin className="size-4 text-primary" />
                            <span className="text-sm">{property.distrito}, {property.canton}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-muted">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground font-medium">Alquiler mensual</span>
                            <span className="text-2xl font-black text-primary">{formatPrice(property.precio, property.moneda)}</span>
                          </div>
                          <Badge variant="outline" className="capitalize px-3 py-1 font-semibold">{property.tipo}</Badge>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="p-16 text-center border-dashed border-2 bg-muted/50 rounded-3xl">
              <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary mb-6 ring-8 ring-primary/5">
                <Building2 className="size-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Tu búsqueda comienza aquí</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Actualmente estamos actualizando nuestro inventario con las mejores propiedades.
              </p>
              <Button size="lg" className="rounded-xl px-10" asChild>
                <Link to="/propiedades">Ver Catálogo Completo</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 relative scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">Propuesta de Valor</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Todo lo que necesitas en un solo ecosistema</h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Hemos rediseñado la experiencia de arrendamiento eliminando la fricción de los procesos tradicionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all bg-background/50 backdrop-blur-sm p-8 rounded-3xl group">
                  <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-primary/5 relative scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">El Proceso</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">¿Cómo funciona?</h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Un flujo optimizado para que te enfoques en lo que importa, no en los trámites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
             {/* Path Line (Desktop) */}
            <div className="hidden lg:block absolute top-[2.5rem] left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full z-0 opacity-20"></div>
            
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="size-20 rounded-3xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-primary-foreground mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <step.icon className="size-10" />
                  <div className="absolute -top-3 -right-3 size-10 rounded-full bg-background border-4 border-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Benefits List */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-none font-bold">Excelencia Operativa</Badge>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                  Profesionaliza tu relación de arrendamiento
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Llevamos el mercado costarricense al estándar internacional con herramientas de vanguardia diseñadas para mitigar riesgos.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <benefit.icon className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold">{benefit.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group" asChild>
                  <Link to="/registro">
                    Empezar Mi Gestión <Zap className="ml-2 size-5 group-hover:fill-current transition-all" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2" asChild>
                  <Link to="/propiedades">Ver Propiedades</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative p-8"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full scale-150 animate-pulse"></div>
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-background/50 backdrop-blur-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Gestión de propiedades profesional"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="size-5 text-primary" />
                        </div>
                        <h4 className="font-bold">Evolución Digital</h4>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                        "Arrendamientos CR me permitió reducir el tiempo de gestión de cobros en un 80%."
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="size-6 rounded-full border-2 border-background bg-muted"></div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-primary">+1k Usuarios Activos</span>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-black/10 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none italic">
              TRANSFORMA TU GESTIÓN HOY
            </h2>
            <p className="text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
              Únete a la nueva era tecnológica del sector inmobiliario en Costa Rica.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button size="lg" variant="secondary" className="h-20 px-12 rounded-2xl text-2xl font-black italic shadow-2xl hover:scale-105 transition-transform" asChild>
                <Link to="/registro">REGISTRARSE GRATIS</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-white/60 font-bold uppercase tracking-widest text-xs">
              <span>Sin Tarjeta de Crédito</span>
              <span className="size-1 bg-white/40 rounded-full"></span>
              <span>Setup en <span className="text-white">60 Segundos</span></span>
              <span className="size-1 bg-white/40 rounded-full"></span>
              <span>Soporte Local</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
