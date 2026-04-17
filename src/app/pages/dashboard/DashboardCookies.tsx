import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Cookie, Shield, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DashboardCookies() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
          <Cookie className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Política de Cookies</h1>
        <p className="text-muted-foreground">
          Última actualización: Enero 2026
        </p>
      </div>

      <div className="space-y-6">
        {/* Introducción */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cookie className="size-5" />
              ¿Qué son las Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, 
              tablet o teléfono móvil) cuando visita un sitio web. Estos archivos permiten que el sitio 
              web recuerde sus preferencias y acciones realizadas anteriormente.
            </p>
            <p>
              En Arrendamientos CR utilizamos cookies para mejorar su experiencia de navegación, 
              analizar el uso de la plataforma y personalizar el contenido.
            </p>
          </CardContent>
        </Card>

        {/* Tipos de Cookies que Utilizamos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="size-5" />
              Tipos de Cookies que Utilizamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {/* Cookies Esenciales */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-4 text-green-600" />
                <h4 className="font-semibold text-foreground">Cookies Esenciales</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Siempre activas</span>
              </div>
              <p className="mb-2">
                Estas cookies son necesarias para que el sitio web funcione correctamente. 
                No pueden desactivarse y no almacenan información personal identificable.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Autenticación de usuario y gestión de sesiones</li>
                <li>Seguridad de la cuenta</li>
                <li>Preferencias de idioma y región</li>
                <li>Carrito de compras/favoritos</li>
                <li>Protección contra ataques de seguridad</li>
              </ul>
            </div>

            {/* Cookies de Rendimiento */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="size-4 text-amber-600" />
                <h4 className="font-semibold text-foreground">Cookies de Rendimiento</h4>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="mb-2">
                Estas cookies recopilan información sobre cómo los visitantes usan nuestro sitio web, 
                incluyendo qué páginas visitan con más frecuencia y si reciben mensajes de error.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Google Analytics (anonimizado)</li>
                <li>Monitoreo de rendimiento del sitio</li>
                <li>Identificación de páginas problemáticas</li>
                <li>Análisis de patrones de navegación</li>
              </ul>
            </div>

            {/* Cookies de Funcionalidad */}
            <div className="border-b pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="size-4 text-blue-600" />
                <h4 className="font-semibold text-foreground">Cookies de Funcionalidad</h4>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="mb-2">
                Estas cookies permiten que el sitio web recuerde sus elecciones y proporcione 
                funciones mejoradas y personalizadas.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Recordar sus preferencias de búsqueda</li>
                <li>Guardar propiedades favoritas</li>
                <li>Preferencias de visualización (tema claro/oscuro)</li>
                <li>Información de formularios previamente completados</li>
              </ul>
            </div>

            {/* Cookies de Marketing */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-purple-600" />
                <h4 className="font-semibold text-foreground">Cookies de Marketing</h4>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Opcionales</span>
              </div>
              <p className="mb-2">
                Estas cookies se utilizan para rastrear a los visitantes en los sitios web con el 
                propósito de mostrar anuncios que sean relevantes e interesantes para cada usuario.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Remarketing en redes sociales</li>
                <li>Anuncios personalizados</li>
                <li>Medición de efectividad publicitaria</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookies de Terceros */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <AlertTriangle className="size-5" />
              Cookies de Terceros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-amber-900">
            <p>
              Utilizamos servicios de terceros que también pueden establecer cookies en su dispositivo:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Analytics:</strong> Para analizar el tráfico del sitio. 
                Puede optar por no participar usando el 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mx-1">
                  complemento de exclusión de Google Analytics
                </a>.
              </li>
              <li>
                <strong>Google Maps:</strong> Para mostrar mapas interactivos en las páginas de propiedades.
              </li>
              <li>
                <strong>Servicios de autenticación (Google):</strong> Para iniciar sesión con su cuenta de Google.
              </li>
            </ul>
            <p className="pt-2 font-medium">
              No tenemos control sobre las cookies de terceros. Le recomendamos revisar las políticas 
              de privacidad de estos servicios.
            </p>
          </CardContent>
        </Card>

        {/* Gestión de Cookies */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="size-5" />
              Cómo Gestionar las Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Desde su Navegador</h4>
              <p className="mb-2">
                Puede bloquear o eliminar cookies a través de la configuración de su navegador:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Configuración en la Plataforma</h4>
              <p>
                Puede gestionar sus preferencias de cookies no esenciales desde su panel de usuario 
                en la sección "Configuración de Privacidad".
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-medium text-foreground">
                ⚠️ Nota importante
              </p>
              <p className="pt-1">
                Si desactiva las cookies, algunas funciones del sitio pueden no funcionar correctamente, 
                como el inicio de sesión automático o el guardado de preferencias.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consentimiento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="size-5" />
              Su Consentimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Al utilizar nuestra plataforma por primera vez, se le mostrará un aviso sobre el uso 
              de cookies. Al continuar navegando después de ver este aviso, usted consiente el uso 
              de cookies según lo descrito en esta política.
            </p>
            <p>
              Puede cambiar sus preferencias en cualquier momento accediendo a la configuración 
              de cookies en su cuenta.
            </p>
          </CardContent>
        </Card>

        {/* Actualizaciones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cookie className="size-5" />
              Actualizaciones de esta Política
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Podemos actualizar esta política de cookies periódicamente. Cualquier cambio será 
              publicado en esta página con una fecha de "última actualización" actualizada.
            </p>
            <p>
              Le recomendamos revisar esta página regularmente para mantenerse informado sobre 
              cualquier cambio.
            </p>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">¿Tiene preguntas sobre cookies?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contáctenos a través de nuestro Centro de Ayuda o escriba a:
            </p>
            <p className="text-primary font-medium">privacidad@arrendamientos-cr.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
