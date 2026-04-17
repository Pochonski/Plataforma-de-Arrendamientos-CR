import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { HelpCircle, Search, MessageCircle, Phone, Mail, Book, FileText, Users, Shield, Home, Key } from 'lucide-react';

const faqCategories = [
  {
    title: 'Cuenta y Registro',
    icon: Users,
    questions: [
      {
        q: '¿Cómo me registro en la plataforma?',
        a: 'Haga clic en el botón "Registrarse" en la esquina superior derecha. Complete el formulario con sus datos personales, verifique su correo electrónico y listo. El proceso toma menos de 5 minutos.'
      },
      {
        q: '¿Olvidé mi contraseña, qué hago?',
        a: 'En la página de inicio de sesión, haga clic en "¿Olvidó su contraseña?". Ingrese su correo electrónico y recibirá un enlace para restablecer su contraseña.'
      },
      {
        q: '¿Puedo cambiar mi información de perfil?',
        a: 'Sí. Inicie sesión, vaya a "Mi Perfil" en el panel de control y podrá modificar sus datos personales, información de contacto y fotografía.'
      }
    ]
  },
  {
    title: 'Búsqueda de Propiedades',
    icon: Search,
    questions: [
      {
        q: '¿Cómo busco propiedades para arrendar?',
        a: 'Use la barra de búsqueda principal. Puede filtrar por ubicación, tipo de propiedad, rango de precios, número de habitaciones y otras características. Los resultados se muestran en un mapa interactivo y lista.'
      },
      {
        q: '¿Puedo guardar propiedades favoritas?',
        a: 'Sí. mientras navega por las propiedades, haga clic en el icono de corazón para guardar propiedades en sus favoritos. Acceda a ellas desde "Mis Favoritos" en su panel de control.'
      },
      {
        q: '¿Cómo contacto al arrendador?',
        a: 'En la página de detalle de la propiedad, haga clic en "Contactar Arrendador". Podrá enviar un mensaje directamente a través de nuestra plataforma.'
      }
    ]
  },
  {
    title: 'Contratos y Pagos',
    icon: FileText,
    questions: [
      {
        q: '¿Cómo genero un contrato de arrendamiento?',
        a: 'Vaya a "Nuevo Contrato" en su panel de control. Seleccione la propiedad, el arrendatario, defina los términos (precio, fecha de inicio, duración) y el sistema generará el documento automáticamente.'
      },
      {
        q: '¿Puedo personalizar el contrato?',
        a: 'Sí. Tenemos plantillas prediseñadas que puede modificar. Puede agregar cláusulas personalizadas, condiciones específicas y términos adicionales según sus necesidades.'
      },
      {
        q: '¿Cómo funcionan los pagos?',
        a: 'Los pagos se coordinan directamente entre arrendador y arrendatario fuera de la plataforma. Nuestra herramienta facilita la gestión de contratos y seguimiento, pero no procesamos pagos directamente.'
      }
    ]
  },
  {
    title: 'Seguridad',
    icon: Shield,
    questions: [
      {
        q: '¿Mis datos están seguros?',
        a: 'Sí. Utilizamos encriptación de grado bancario para proteger su información. No compartimos sus datos personales con terceros sin su consentimiento expreso.'
      },
      {
        q: '¿Cómo verifican las propiedades?',
        a: 'Las propiedades son publicadas por los propietarios registrados. Recomendamos siempre verificar la propiedad físicamente antes de formalizar cualquier acuerdo.'
      },
      {
        q: '¿Qué hago si encuentro una publicación fraudulenta?',
        a: 'Si sospecha de una publicación, repórtela inmediatamente usando el botón "Reportar" en la página de la propiedad. Nuestro equipo investigará y tomará las acciones necesarias.'
      }
    ]
  },
  {
    title: 'Propiedades',
    icon: Home,
    questions: [
      {
        q: '¿Cómo registro una propiedad para arrendar?',
        a: 'Inicie sesión, vaya a "Mis Propiedades" y haga clic en "Agregar Propiedad". Complete la información requerida, agregue fotos de calidad y publique su anuncio.'
      },
      {
        q: '¿Cuántas propiedades puedo publicar?',
        a: 'Puede publicar tantas propiedades como desee. No hay límite en el número de anuncios activos en la plataforma.'
      },
      {
        q: '¿Cómo edito o elimino una propiedad?',
        a: 'En "Mis Propiedades", encontrará opciones para editar, pausar o eliminar cada propiedad publicada.'
      }
    ]
  },
  {
    title: 'Llaves y Acceso',
    icon: Key,
    questions: [
      {
        q: '¿Cómo funcionan los códigos de acceso?',
        a: 'Puede generar códigos de acceso temporales para sus propiedades. Estos códigos permiten un acceso controlado y seguro a las propiedades, especialmente útil para visitas programadas.'
      },
      {
        q: '¿Puedo revocar un código de acceso?',
        a: 'Sí. Desde el panel de control de cada propiedad, puede ver, crear y revocar códigos de acceso en cualquier momento.'
      }
    ]
  }
];

const contactOptions = [
  {
    icon: Mail,
    title: 'Correo Electrónico',
    description: 'Respuesta en menos de 24 horas',
    content: 'soporte@arrendamientos-cr.com',
    link: 'mailto:soporte@arrendamientos-cr.com'
  },
  {
    icon: Phone,
    title: 'Teléfono',
    description: 'Lunes a Viernes, 8am - 5pm',
    content: '+506 2222-3333',
    link: 'tel:+50622223333'
  },
  {
    icon: MessageCircle,
    title: 'Chat en Vivo',
    description: 'Disponible 24/7 para consultas urgentes',
    content: 'Iniciar chat',
    link: '#'
  }
];

export default function DashboardCentroAyuda() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Centro de Ayuda</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentre respuestas a sus preguntas sobre Arrendamientos CR
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar en la ayuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {contactOptions.map((option, index) => (
            <a key={index} href={option.link} className="block">
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
                      <option.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{option.title}</h3>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-primary font-medium text-sm">{option.content}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-6">Preguntas Frecuentes</h2>
          
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <category.icon className="size-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>
                  {category.questions.length} preguntas en esta categoría
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.questions.map((item, questionIndex) => (
                  <div key={questionIndex} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-sm mb-1">{item.q}</h4>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <Book className="size-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">¿Aún necesita ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Nuestro equipo de soporte está listo para asistirle con cualquier consulta.
            </p>
            <a 
              href="mailto:soporte@arrendamientos-cr.com" 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
            >
              <Mail className="size-4" />
              Contáctenos directamente
            </a>
          </CardContent>
        </Card>
      </div>
  );
}
