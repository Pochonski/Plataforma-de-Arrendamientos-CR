import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { FileText, Scale, AlertTriangle, Users, Building2, Shield, Gavel } from 'lucide-react';

export default function DashboardTerminos() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <FileText className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Términos y Condiciones</h1>
        <p className="text-muted-foreground">
          Última actualización: Enero 2026
        </p>
      </div>

      <div className="space-y-6">
        {/* Introducción */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="size-5" />
              Introducción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Bienvenido a Arrendamientos CR. Estos Términos y Condiciones ("Términos") regulan el uso de la plataforma 
              Arrendamientos CR ("la Plataforma", "nosotros", "nuestro") y los servicios que ofrecemos para facilitar 
              el arrendamiento de propiedades en Costa Rica.
            </p>
            <p>
              Al acceder y utilizar nuestra Plataforma, usted ("Usuario", "usted") acepta estar sujeto a estos Términos. 
              Si no está de acuerdo con alguno de estos términos, por favor no utilice la Plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Definiciones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="size-5" />
              Definiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>"Arrendador"</strong>: Persona física o jurídica que posee una propiedad y la ofrece en arrendamiento a través de la Plataforma.</li>
              <li><strong>"Arrendatario"</strong>: Persona física o jurídica que busca arrendar una propiedad a través de la Plataforma.</li>
              <li><strong>"Propiedad"</strong>: Inmueble residencial o comercial listado en la Plataforma para arrendamiento.</li>
              <li><strong>"Contrato de Arrendamiento"</strong>: Acuerdo legal entre Arrendador y Arrendatario para el arrendamiento de una Propiedad.</li>
              <li><strong>"Servicios"</strong>: Herramientas y funcionalidades que ofrece la Plataforma para facilitar el proceso de arrendamiento.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Aceptación de Términos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Aceptación de los Términos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Al registrarse en la Plataforma, usted declara y garantiza que:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tiene al menos 18 años de edad y capacidad legal para celebrar contratos.</li>
              <li>La información proporcionada durante el registro es verdadera, precisa y completa.</li>
              <li>Es responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
              <li>Acepta notificar inmediatamente sobre cualquier uso no autorizado de su cuenta.</li>
              <li>Utilizará la Plataforma de manera lawful y de acuerdo con estos Términos.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Servicios de la Plataforma */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="size-5" />
              Servicios de la Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Arrendamientos CR ofrece los siguientes servicios:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Publicación y búsqueda de propiedades para arrendamiento.</li>
              <li>Generación de contratos de arrendamiento basados en plantillas predefinidas.</li>
              <li>Gestión de invitaciones para arrendatarios.</li>
              <li>Seguimiento de pagos y historial de transacciones.</li>
              <li>Comunicación entre Arrendadores y Arrendatarios.</li>
              <li>Almacenamiento seguro de documentos y comprobantes.</li>
            </ul>
            <p className="pt-2">
              <strong>Importante:</strong> Arrendamientos CR actúa únicamente como intermediario. No somos parte del 
              contrato de arrendamiento y no procesamos pagos directamente.
            </p>
          </CardContent>
        </Card>

        {/* Obligaciones del Arrendador */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="size-5" />
              Obligaciones del Arrendador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Como Arrendador, usted se compromete a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Proporcionar información veraz y actualizada de sus propiedades.</li>
              <li>Mantener las propiedades en condiciones adecuadas para arrendamiento.</li>
              <li>Responder a las consultas de potenciales arrendatarios de manera oportuna.</li>
              <li>Emitir comprobantes de pago cuando reciba pagos de arrendamiento.</li>
              <li>Cumplir con todas las leyes y regulaciones aplicables en Costa Rica.</li>
              <li>No cobrar montos superiores a los acordados en el contrato.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Obligaciones del Arrendatario */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Obligaciones del Arrendatario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Como Arrendatario, usted se compromete a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Proporcionar información veraz durante el proceso de registro.</li>
              <li>Realizar los pagos de arrendamiento puntualmente según lo acordado.</li>
              <li>Mantener la propiedad en buen estado y cuidar las instalaciones.</li>
              <li>Respetar los términos y condiciones establecidos en el contrato.</li>
              <li>No subarrendar la propiedad sin autorización escrita del Arrendador.</li>
              <li>Reportar cualquier daño o problema de manera inmediata.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitación de Responsabilidad */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <AlertTriangle className="size-5" />
              Limitación de Responsabilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-amber-900">
            <p>
              Arrendamientos CR NO es responsable por:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Disputas entre Arrendadores y Arrendatarios relacionadas con el contrato de arrendamiento.</li>
              <li>Pagos no realizados, retrasados o disputados entre las partes.</li>
              <li>Condiciones de las propiedades, включая daños ocultos o vicios.</li>
              <li>Pérdida de pertenencias o daños personales en las propiedades.</li>
              <li>Incumplimiento de las leyes locales por parte de los Usuarios.</li>
              <li>Disponibilidad o calidad de los servicios de terceros.</li>
            </ul>
            <p className="pt-2 font-medium">
              Los Usuarios reconocen que utilizan la Plataforma bajo su propio riesgo.
            </p>
          </CardContent>
        </Card>

        {/* Propiedad Intelectual */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="size-5" />
              Propiedad Intelectual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Todo el contenido de la Plataforma, incluyendo pero no limitado a textos, gráficos, logotipos, 
              imágenes, software y código, está protegido por derechos de autor y otras leyes de propiedad intelectual.
            </p>
            <p>
              Se prohíbe la reproducción, distribución o modificación de cualquier contenido sin autorización 
              expresa de Arrendamientos CR.
            </p>
          </CardContent>
        </Card>

        {/* Modificaciones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gavel className="size-5" />
              Modificaciones de los Términos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Arrendamientos CR se reserva el derecho de modificar estos Términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en la Plataforma.
            </p>
            <p>
              Es su responsabilidad revisar periódicamente estos Términos. El uso continuado de la Plataforma 
              después de cualquier modificación constituye su aceptación de los nuevos Términos.
            </p>
          </CardContent>
        </Card>

        {/* Ley Aplicable */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="size-5" />
              Ley Aplicable y Jurisdicción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Estos Términos se rigen por las leyes de la República de Costa Rica. 
              Cualquier controversia derivada de estos Términos o del uso de la Plataforma 
              será sometida a los tribunales competentes de Costa Rica.
            </p>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">¿Tiene preguntas?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contáctenos a través de nuestro Centro de Ayuda o escriba a:
            </p>
            <p className="text-primary font-medium">soporte@arrendamientos-cr.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
