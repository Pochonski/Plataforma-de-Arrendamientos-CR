import { PublicLayout } from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/card';
import { Cookie, Shield, Settings, AlertTriangle, Trash2, Eye, Lock } from 'lucide-react';

export function Cookies() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
            <Cookie className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
          <p className="text-muted-foreground">
            Última actualización: 1 de enero de 2026
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">
              Esta Política de Cookies explica qué son las cookies, cómo las utilizamos, 
              los tipos de cookies que empleamos y cómo puede управлять sus preferencias.
            </p>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Tabla de Contenidos</h2>
            <ol className="space-y-2 text-primary">
              <li><a href="#que-son" className="hover:underline">1. ¿Qué son las Cookies?</a></li>
              <li><a href="#como-usamos" className="hover:underline">2. Cómo Usamos las Cookies</a></li>
              <li><a href="#tipos" className="hover:underline">3. Tipos de Cookies que Utilizamos</a></li>
              <li><a href="#gestion" className="hover:underline">4. Cómo Gestionar sus Cookies</a></li>
              <li><a href="#cookies-terceros" className="hover:underline">5. Cookies de Terceros</a></li>
              <li><a href="#actualizaciones" className="hover:underline">6. Actualizaciones</a></li>
              <li><a href="#contacto" className="hover:underline">7. Contacto</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          <Card id="que-son">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Cookie className="size-6" />
                1. ¿Qué son las Cookies?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
                  (computadora, tablet o teléfono móvil) cuando visita un sitio web.
                </p>
                <p>
                  Las cookies ayudan a los sitios web a recordar sus preferencias, mejorar su 
                  experiencia de navegación y proporcionar funcionalidades específicas. También 
                  ayudan a los propietarios de sitios web a entender cómo los usuarios interactúan 
                  con su contenido.
                </p>
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-blue-700 dark:text-blue-400">Importante:</strong> 
                    Las cookies son archivos de texto, no software. No contienen virus, 
                    malware ni pueden ejecutar código por sí mismas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="como-usamos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="size-6" />
                2. Cómo Usamos las Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Utilizamos cookies para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Autenticación:</strong> Mantenerlo conectado mientras navega</li>
                  <li><strong>Seguridad:</strong> Proteger su cuenta contra accesos no autorizados</li>
                  <li><strong>Preferencias:</strong> Recordar sus configuraciones y ajustes</li>
                  <li><strong>Análisis:</strong> Entender cómo usa nuestro sitio para mejorarlo</li>
                  <li><strong>Rendimiento:</strong> Optimizar la velocidad y funcionalidad del sitio</li>
                  <li><strong>Funcionalidad:</strong> Habilitar características específicas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card id="tipos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="size-6" />
                3. Tipos de Cookies que Utilizamos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {/* Essential Cookies */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Shield className="size-5 text-green-600" />
                    Cookies Esenciales
                  </h3>
                  <p className="text-sm mb-2">
                    <strong>Necesarias para el funcionamiento del sitio.</strong>
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>session_id:</strong> Mantiene su sesión activa (Sesión)</li>
                    <li><strong>auth_token:</strong> Recordar su información de login (30 días)</li>
                    <li><strong>csrf_token:</strong> Protección contra ataques CSRF (Sesión)</li>
                    <li><strong>consent_preferences:</strong> Recordar sus preferencias de cookies (1 año)</li>
                  </ul>
                </div>

                {/* Functional Cookies */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Settings className="size-5 text-blue-600" />
                    Cookies Funcionales
                  </h3>
                  <p className="text-sm mb-2">
                    <strong>Mejoran su experiencia y recuerdan sus preferencias.</strong>
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>language:</strong> Recordar su idioma preferido (1 año)</li>
                    <li><strong>theme:</strong> Guardar su tema de color favorito (1 año)</li>
                    <li><strong>recent_searches:</strong> Historial de búsquedas recientes (30 días)</li>
                    <li><strong>favorites:</strong> Recordar propiedades favoritas (30 días)</li>
                  </ul>
                </div>

                {/* Performance Cookies */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Eye className="size-5 text-purple-600" />
                    Cookies de Rendimiento
                  </h3>
                  <p className="text-sm mb-2">
                    <strong>Nos ayudan a entender cómo los visitantes usan nuestro sitio.</strong>
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>analytics_id:</strong> Identificar visitantes únicos (2 años)</li>
                    <li><strong>page_views:</strong> Contar visitas a páginas (2 años)</li>
                    <li><strong>referral_source:</strong> Identificar cómo llegó al sitio (Sesión)</li>
                  </ul>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Cookie className="size-5 text-amber-600" />
                    Cookies de Marketing
                  </h3>
                  <p className="text-sm mb-2">
                    <strong>Para mostrarle anuncios relevantes (si aplica).</strong>
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li><strong>ad_id:</strong> Seguimiento de campañas publicitarias (90 días)</li>
                    <li><strong>conversion_pixel:</strong> Medir efectividad de anuncios (90 días)</li>
                  </ul>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Actualmente no utilizamos cookies de marketing de terceros.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-amber-700 dark:text-amber-400">Nota:</strong> 
                    Los tiempos entre paréntesis indican la duración de cada cookie. 
                    "Sesión" significa que la cookie se elimina al cerrar el navegador.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="gestion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="size-6" />
                4. Cómo Gestionar sus Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Usted tiene varias opciones para gestionar las cookies:</p>

                <h3 className="font-semibold text-foreground">4.1 Banner de Cookies</h3>
                <p>
                  La primera vez que visite nuestro sitio, verá un banner donde puede 
                  aceptar o rechazar cookies no esenciales. Su preferencia será recordada.
                </p>

                <h3 className="font-semibold text-foreground">4.2 Configuración del Navegador</h3>
                <p>Puede bloquear o eliminar cookies a través de la configuración de su navegador:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                  <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                  <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                  <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
                </ul>

                <h3 className="font-semibold text-foreground">4.3 Configuración en la Plataforma</h3>
                <p>
                  Puede modificar sus preferencias de cookies en cualquier momento desde su 
                  panel de configuración de cuenta.
                </p>

                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-red-700 dark:text-red-400">Advertencia:</strong> 
                    Bloquear cookies esenciales puede afectar la funcionalidad del sitio. 
                    Algunas características pueden no funcionar correctamente si desactiva 
                    estas cookies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="cookies-terceros">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="size-6" />
                5. Cookies de Terceros
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Algunos cookies en nuestro sitio son установлены третьими лицами (terceros). 
                  Estos terceros incluyen:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> Para analizar el tráfico del sitio</li>
                  <li><strong>Google Fonts:</strong> Para cargar fuentes tipográficas</li>
                  <li><strong>Firebase:</strong> Para autenticación y base de datos en tiempo real</li>
                </ul>
                <p>
                  No contrôlamos las cookies de terceros. Le recomendamos revisar las políticas 
                  de privacidad de estos servicios para entender cómo utilizan sus datos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="actualizaciones">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Cookie className="size-6" />
                6. Actualizaciones
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta Política de Cookies periódicamente para reflejar 
                  cambios en los servicios que ofrecemos o por requisitos legales.
                </p>
                <p>
                  Cualquier cambio será publicado en esta página. Los cambios significativos 
                  serán comunicados de manera más visible.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="contacto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Trash2 className="size-6" />
                7. Contacto
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tiene preguntas sobre nuestra Política de Cookies:
                </p>
                
                <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                  <p><strong>Correo electrónico:</strong> privacidad@arrendamientos-cr.com</p>
                  <p><strong>Teléfono:</strong> +506 2222-3333</p>
                  <p><strong>Dirección:</strong> San José, Costa Rica</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
