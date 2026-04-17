import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Eye, Lock, User, Database, Mail, Bell, Trash2 } from 'lucide-react';

export default function DashboardPrivacidad() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <Shield className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Política de Privacidad</h1>
        <p className="text-muted-foreground">
          Última actualización: Enero 2026
        </p>
      </div>

      <div className="space-y-6">
        {/* Introducción */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="size-5" />
              Introducción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              En Arrendamientos CR, nos comprometemos a proteger su privacidad. Esta Política de Privacidad 
              describe cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando 
              utiliza nuestra plataforma.
            </p>
            <p>
              Al utilizar Arrendamientos CR, usted acepta las prácticas descritas en esta política.
            </p>
          </CardContent>
        </Card>

        {/* Información que Recopilamos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="size-5" />
              Información que Recopilamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Información de Registro</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Contraseña (encriptada)</li>
                <li>Fotografía de perfil (opcional)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Información de Propiedades</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dirección de la propiedad</li>
                <li>Características y amenities</li>
                <li>Fotos y videos</li>
                <li>Precio de arrendamiento</li>
                <li>Disponibilidad</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Información de Uso</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dirección IP</li>
                <li>Tipo de navegador</li>
                <li>Páginas visitadas</li>
                <li>Interacciones con la plataforma</li>
                <li>Preferencias configuradas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cómo Usamos su Información */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="size-5" />
              Cómo Usamos su Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Utilizamos su información para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Crear y gestionar su cuenta de usuario</li>
              <li>Facilitar la búsqueda y publicación de propiedades</li>
              <li>Generar contratos de arrendamiento</li>
              <li>Comunicarnos con usted sobre su cuenta y servicios</li>
              <li>Mejorar la experiencia del usuario en la plataforma</li>
              <li>Enviar notificaciones sobre propiedades favoritas</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraudes y actividades ilícitas</li>
            </ul>
          </CardContent>
        </Card>

        {/* Protección de Datos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="size-5" />
              Protección de sus Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Implementamos medidas de seguridad robustas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encriptación SSL/TLS para todas las comunicaciones</li>
              <li>Contraseñas hasheadas con algoritmos seguros</li>
              <li>Autenticación de dos factores (2FA)</li>
              <li>Monitoreo continuo de actividad sospechosa</li>
              <li>Respaldos regulares de datos</li>
              <li>Acceso restringido a información confidencial</li>
              <li>Auditorías de seguridad periódicas</li>
            </ul>
          </CardContent>
        </Card>

        {/* Compartir Información */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <User className="size-5" />
              Compartir Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-amber-900">
            <p><strong>NO vendemos</strong> su información personal a terceros.</p>
            <p>Podemos compartir información únicamente en estos casos:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Con su consentimiento:</strong> Cuando usted autorice explícitamente.</li>
              <li><strong>Arrendadores/Arrendatarios:</strong> Para facilitar el contacto entre las partes.</li>
              <li><strong>Proveedores de servicios:</strong> Para funcionalidades como envío de correos (bajo NDA).</li>
              <li><strong>Requerimientos legales:</strong> Cuando sea requerido por ley o autoridad competente.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sus Derechos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="size-5" />
              Sus Derechos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Acceder:</strong> Conocer qué información tenemos sobre usted.</li>
              <li><strong>Rectificar:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Eliminar:</strong> Solicitar la eliminación de su cuenta y datos.</li>
              <li><strong>Oponerse:</strong> Optar por no recibir comunicaciones de marketing.</li>
              <li><strong>Portabilidad:</strong> Obtener sus datos en formato legible.</li>
              <li><strong>Revocar consentimiento:</strong> En cualquier momento.</li>
            </ul>
            <p className="pt-2">
              Para ejercer cualquiera de estos derechos, contáctenos a través de 
              <a href="mailto:privacidad@arrendamientos-cr.com" className="text-primary hover:underline ml-1">
                privacidad@arrendamientos-cr.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Retención de Datos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="size-5" />
              Retención de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Conservamos su información durante:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cuenta activa:</strong> Mientras mantengas tu cuenta.</li>
              <li><strong>Después de eliminar cuenta:</strong> Hasta 90 días para cumplimiento legal.</li>
              <li><strong>Logs de seguridad:</strong> Máximo 1 año.</li>
              <li><strong>Contratos generados:</strong> Según regulaciones fiscales costarricenses.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="size-5" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Puede configurar qué notificaciones recibe:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alertas de nuevas propiedades en sus criterios de búsqueda</li>
              <li>Notificaciones de cambios en propiedades favoritas</li>
              <li>Recordatorios de pagos y contratos</li>
              <li>Comunicados oficiales de la plataforma</li>
            </ul>
            <p className="pt-2">
              Para modificar sus preferencias, visite la sección "Notificaciones" en su perfil.
            </p>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">¿Tiene preguntas sobre privacidad?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contáctenos a nuestro Oficial de Protección de Datos:
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Mail className="size-4" />
              <a href="mailto:privacidad@arrendamientos-cr.com">privacidad@arrendamientos-cr.com</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
