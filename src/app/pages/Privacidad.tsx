import { PublicLayout } from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/card';
import { Shield, Eye, Lock, Users, Database, Mail, AlertTriangle, FileText, Settings } from 'lucide-react';

export function Privacidad() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
            <Shield className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-muted-foreground">
            Última actualización: 1 de enero de 2026
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">
              En Arrendamientos CR, nos comprometemos a proteger su privacidad. Esta Política 
              de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su 
              información personal cuando utiliza nuestra plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Tabla de Contenidos</h2>
            <ol className="space-y-2 text-primary">
              <li><a href="#informacion" className="hover:underline">1. Información que Recopilamos</a></li>
              <li><a href="#uso" className="hover:underline">2. Cómo Usamos su Información</a></li>
              <li><a href="#compartimos" className="hover:underline">3. Información que Compartimos</a></li>
              <li><a href="#proteccion" className="hover:underline">4. Cómo Protegemos su Información</a></li>
              <li><a href="#sus-derechos" className="hover:underline">5. Sus Derechos</a></li>
              <li><a href="#retencion" className="hover:underline">6. Retención de Datos</a></li>
              <li><a href="#cookies" className="hover:underline">7. Uso de Cookies</a></li>
              <li><a href="#ninos" className="hover:underline">8. Niños y Adolescentes</a></li>
              <li><a href="#cambios" className="hover:underline">9. Cambios a esta Política</a></li>
              <li><a href="#contacto" className="hover:underline">10. Contacto</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          <Card id="informacion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="size-6" />
                1. Información que Recopilamos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-semibold text-foreground">1.1 Información que proporciona directamente:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Datos de registro:</strong> nombre, correo electrónico, número de teléfono, contraseña</li>
                  <li><strong>Información de perfil:</strong> fotografía, dirección, fecha de nacimiento</li>
                  <li><strong>Información de propiedades:</strong> fotografías, descripción, ubicación, precios</li>
                  <li><strong>Contenido generado:</strong> contratos, mensajes, reseñas y comentarios</li>
                  <li><strong>Datos de pago:</strong> información de tarjetas (procesada por pasarelas de pago terceros)</li>
                </ul>

                <h3 className="font-semibold text-foreground">1.2 Información recopilada automáticamente:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Datos de uso:</strong> páginas visitadas, tiempo de permanencia, clics</li>
                  <li><strong>Información del dispositivo:</strong> tipo de navegador, sistema operativo, dirección IP</li>
                  <li><strong>Cookies y tecnologías similares:</strong> véase nuestra Política de Cookies</li>
                  <li><strong>Logs del servidor:</strong> registros de acceso y errores</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card id="uso">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="size-6" />
                2. Cómo Usamos su Información
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Utilizamos su información para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Crear y gestionar su cuenta de usuario</li>
                  <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                  <li>Facilitar la publicación y búsqueda de propiedades</li>
                  <li>Generar contratos de arrendamiento</li>
                  <li>Comunicarnos con usted sobre su cuenta y servicios</li>
                  <li>Enviar notificaciones sobre propiedades favoritas</li>
                  <li>Procesar pagos (a través de pasarelas de pago terceros)</li>
                  <li>Prevenir fraudes y actividades ilícitas</li>
                  <li>Cumplir obligaciones legales</li>
                  <li>Personalizar su experiencia en la plataforma</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card id="compartimos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-6" />
                3. Información que Compartimos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>No vendemos su información personal. Compartimos información únicamente en los siguientes casos:</p>
                
                <h3 className="font-semibold text-foreground">3.1 Con otros usuarios:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Su información de perfil cuando se comunica con arrendadores/arrendatarios</li>
                  <li>Información de propiedades que usted publica públicamente</li>
                </ul>

                <h3 className="font-semibold text-foreground">3.2 Con proveedores de servicios:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Servicios de alojamiento web y almacenamiento</li>
                  <li>Pasarelas de pago para procesamiento de transacciones</li>
                  <li>Servicios de análisis y estadísticas</li>
                  <li>Servicios de correo electrónico y notificaciones</li>
                </ul>

                <h3 className="font-semibold text-foreground">3.3 Por razones legales:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cumplimiento de leyes, regulaciones o solicitudes gubernamentales</li>
                  <li>Protección de nuestros derechos, privacidad, seguridad</li>
                  <li>Detección y prevención de fraudes</li>
                  <li>Respuesta a emergencias o situaciones de riesgo</li>
                </ul>

                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-blue-700 dark:text-blue-400">Nota importante:</strong> 
                    Cuando se pone en contacto con un arrendador o arrendatario a través de la 
                    plataforma, comparte su información de contacto con esa persona. Nosotros 
                    no somos responsables del uso que dicha persona haga de su información.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="proteccion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="size-6" />
                4. Cómo Protegemos su Información
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Implementamos múltiples capas de seguridad para proteger su información:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encriptación:</strong> Datos en tránsito y en reposo usando estándares AES-256</li>
                  <li><strong>HTTPS:</strong> Toda la comunicación con nuestros servidores está encriptada</li>
                  <li><strong>Contraseñas:</strong> Hasheadas con bcrypt, nunca almacenamos contraseñas en texto plano</li>
                  <li><strong>Acceso limitado:</strong> Solo personal autorizado tiene acceso a sistemas con datos sensibles</li>
                  <li><strong>Monitoreo:</strong> Registros de auditoría y detección de anomalías</li>
                  <li><strong>Actualizaciones:</strong> Mantenemos nuestros sistemas y software actualizados</li>
                  <li><strong>Backups:</strong> Respaldos periódicos encriptados</li>
                </ul>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-amber-700 dark:text-amber-400">Recomendación:</strong> 
                    Use contraseñas fuertes y únicas. Nunca comparta sus credenciales con terceros. 
                    Nosotros nunca le pediremos su contraseña por correo electrónico.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="sus-derechos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="size-6" />
                5. Sus Derechos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Usted tiene derecho a:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre usted</li>
                  <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                  <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos personales</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                  <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para ciertos fines</li>
                  <li><strong>Limitación:</strong> Solicitar que limitemos el procesamiento de sus datos</li>
                  <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
                </ul>

                <p>
                  Para ejercer cualquiera de estos derechos, comuníquese con nosotros a través de 
                  los medios indicados en la sección de contacto. Responderemos a su solicitud 
                  dentro de los 30 días.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="retencion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="size-6" />
                6. Retención de Datos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Conservamos su información durante:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Datos de cuenta:</strong> Mientras su cuenta esté activa + 2 años</li>
                  <li><strong>Contratos:</strong> 10 años después de la finalización del contrato (requisito legal)</li>
                  <li><strong>Logs de actividad:</strong> 2 años para análisis y seguridad</li>
                  <li><strong>Datos de cookies:</strong> Según lo descrito en nuestra Política de Cookies</li>
                </ul>

                <p>
                  Puede solicitar la eliminación de su cuenta y datos siguiendo el procedimiento 
                  establecido. Ciertos datos pueden ser conservados por períodos más largos cuando 
                  la ley lo requiera.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="cookies">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6" />
                7. Uso de Cookies
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia. 
                  Para más detalles, consulte nuestra{' '}
                  <a href="/cookies" className="text-primary hover:underline">
                    Política de Cookies
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="ninos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-6" />
                8. Niños y Adolescentes
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nuestros servicios no están dirigidos a personas menores de 18 años. 
                  No recopilamos intencionalmente información de menores.
                </p>
                <p>
                  Si descubrimos que hemos recopilado información de un menor sin verificar 
                  el consentimiento parental, eliminaremos esa información lo más pronto posible.
                </p>
                <p>
                  Si usted es padre o tutor y cree que su hijo nos ha proporcionado información 
                  personal, contáctenos inmediatamente.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="cambios">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6" />
                9. Cambios a esta Política
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente. 
                  Los cambios significativos serán comunicados mediante:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notificación por correo electrónico a la dirección registrada</li>
                  <li>Aviso destacado en la plataforma</li>
                  <li>Actualización de la fecha de "última actualización"</li>
                </ul>
                <p>
                  Le recomendamos revisar esta política regularmente. El uso continuado 
                  de nuestros servicios después de los cambios constituye aceptación de 
                  la nueva política.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="contacto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="size-6" />
                10. Contacto
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tiene preguntas, solicitudes o preocupaciones sobre esta Política 
                  de Privacidad o el tratamiento de sus datos personales:
                </p>
                
                <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                  <p><strong>Responsable de Protección de Datos:</strong></p>
                  <p><strong>Correo electrónico:</strong> privacidad@arrendamientos-cr.com</p>
                  <p><strong>Teléfono:</strong> +506 2222-3333</p>
                  <p><strong>Dirección:</strong> San José, Costa Rica</p>
                </div>

                <p>
                  Responderemos a todas las consultas relacionadas con privacidad dentro 
                  de los 30 días siguientes a su recepción.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
