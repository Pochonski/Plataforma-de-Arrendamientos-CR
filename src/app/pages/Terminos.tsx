import { PublicLayout } from '../components/layout/PublicLayout';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Scale, AlertTriangle, Users, Building, CreditCard, Shield, Gavel } from 'lucide-react';

export function Terminos() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
            <Scale className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Términos de Uso</h1>
          <p className="text-muted-foreground">
            Última actualización: 1 de enero de 2026
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">
              Bienvenido a Arrendamientos CR. Al utilizar nuestra plataforma, usted acepta cumplir 
              con los siguientes términos y condiciones. Lea cuidadosamente este documento antes 
              de usar nuestros servicios.
            </p>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Tabla de Contenidos</h2>
            <ol className="space-y-2 text-primary">
              <li><a href="#aceptacion" className="hover:underline">1. Aceptación de Términos</a></li>
              <li><a href="#descripcion" className="hover:underline">2. Descripción del Servicio</a></li>
              <li><a href="#cuenta" className="hover:underline">3. Cuenta de Usuario</a></li>
              <li><a href="#propiedades" className="hover:underline">4. Publicación de Propiedades</a></li>
              <li><a href="#contratos" className="hover:underline">5. Contratos de Arrendamiento</a></li>
              <li><a href="#pagos" className="hover:underline">6. Pagos y Transacciones</a></li>
              <li><a href="#conducta" className="hover:underline">7. Conducta del Usuario</a></li>
              <li><a href="#propiedad-intelectual" className="hover:underline">8. Propiedad Intelectual</a></li>
              <li><a href="#limitacion" className="hover:underline">9. Limitación de Responsabilidad</a></li>
              <li><a href="#modificaciones" className="hover:underline">10. Modificaciones al Servicio</a></li>
              <li><a href="#ley" className="hover:underline">11. Ley Aplicable</a></li>
              <li><a href="#contacto" className="hover:underline">12. Contacto</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          <Card id="aceptacion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6" />
                1. Aceptación de Términos
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Al acceder y utilizar Arrendamientos CR, usted manifiesta que ha leído, 
                  comprendido y acepta estar sujeto a estos Términos de Uso y a nuestra 
                  Política de Privacidad.
                </p>
                <p>
                  Si no está de acuerdo con alguno de estos términos, no deberá utilizar 
                  nuestros servicios. El uso continuado de la plataforma constituye 
                  aceptación de cualquier modificación a estos términos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="descripcion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building className="size-6" />
                2. Descripción del Servicio
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Arrendamientos CR es una plataforma digital que facilita la conexión entre 
                  propietarios de bienes inmuebles y personas interesadas en arrendarlos en 
                  Costa Rica.
                </p>
                <p className="font-medium text-foreground">Nuestros servicios incluyen:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Publicación y búsqueda de propiedades para arrendamiento</li>
                  <li>Generación de contratos de arrendamiento</li>
                  <li>Gestión de códigos de acceso para propiedades</li>
                  <li>Herramientas de comunicación entre arrendadores y arrendatarios</li>
                  <li>Almacenamiento seguro de documentos y contratos</li>
                </ul>
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-amber-700 dark:text-amber-400">Importante:</strong> 
                    Arrendamientos CR no es una inmobiliaria ni interviene directamente en las 
                    transacciones. Los acuerdos y pagos se coordinan entre las partes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="cuenta">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-6" />
                3. Cuenta de Usuario
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-semibold text-foreground">3.1 Registro</h3>
                <p>
                  Para utilizar ciertos servicios, debe crear una cuenta proporcionando 
                  información veraz y actualizada. Usted es responsable de la exactitud 
                  de los datos proporcionados.
                </p>
                
                <h3 className="font-semibold text-foreground">3.2 Requisitos</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ser mayor de 18 años</li>
                  <li>Proporcionar información de identificación válida</li>
                  <li>Contar con correo electrónico activo</li>
                  <li>Aceptar estos Términos de Uso</li>
                </ul>
                
                <h3 className="font-semibold text-foreground">3.3 Seguridad</h3>
                <p>
                  Usted es responsable de mantener la confidencialidad de su contraseña 
                  y cuenta. Todas las actividades realizadas bajo su cuenta son de su 
                  responsabilidad. Deberá notificarnos inmediatamente sobre cualquier 
                  uso no autorizado.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="propiedades">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building className="size-6" />
                4. Publicación de Propiedades
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-semibold text-foreground">4.1 Elegibilidad</h3>
                <p>
                  Solo los propietarios legales o personas autorizadas pueden publicar 
                  propiedades. Nos reservamos el derecho de verificar la legitimidad de 
                  las publicaciones.
                </p>
                
                <h3 className="font-semibold text-foreground">4.2 Contenido</h3>
                <p>Las publicaciones deben:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Describir la propiedad con información precisa y veraz</li>
                  <li>Incluir fotografías reales de la propiedad</li>
                  <li>Especificar el precio correcto de arrendamiento</li>
                  <li>Indicar claramente la ubicación y condiciones</li>
                </ul>
                
                <h3 className="font-semibold text-foreground">4.3 Prohibiciones</h3>
                <p>Está prohibido publicar:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Propiedades que no posee o no está autorizado a arrendar</li>
                  <li>Información falsa o engañosa</li>
                  <li>Contenido ofensivo o inapropiado</li>
                  <li>Propiedades para propósitos ilegales</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card id="contratos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6" />
                5. Contratos de Arrendamiento
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nuestra plataforma ofrece herramientas para generar contratos de 
                  arrendamiento. Sin embargo, Arrendamientos CR no es parte del contrato.
                </p>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Shield className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-blue-700 dark:text-blue-400">Recomendación:</strong> 
                    Antes de formalizar cualquier contrato, consulte con un abogado 
                    especializado en derecho inmobiliario en Costa Rica para garantizar 
                    que el contrato cumple con todas las leyes aplicables.
                  </p>
                </div>
                
                <p>
                  Los usuarios asumen toda la responsabilidad sobre los términos acordados, 
                  incluyendo precio, duración, condiciones de pago y cualquier otra cláusula 
                  pactada entre las partes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="pagos">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="size-6" />
                6. Pagos y Transacciones
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Arrendamientos CR no procesa pagos directamente. Las transacciones 
                  económicas entre arrendadores y arrendatarios se realizan por medios 
                  externos a la plataforma.
                </p>
                
                <h3 className="font-semibold text-foreground">Responsabilidades del usuario:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acordar métodos de pago directamente entre las partes</li>
                  <li>Verificar la legitimidad de las transacciones</li>
                  <li>Conservar comprobantes de pago</li>
                  <li>Reportar cualquier irregularidad</li>
                </ul>
                
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-red-700 dark:text-red-400">Advertencia:</strong> 
                    Sea cauteloso con solicitudes de pagos anticipados o transferencias 
                    a cuentas desconocidas. Arrendamientos CR no garantiza ni es responsable 
                    de transacciones realizadas fuera de la plataforma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="conducta">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-6" />
                7. Conducta del Usuario
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Al usar nuestra plataforma, usted se compromete a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Utilizar el servicio de manera lawful y ética</li>
                  <li>No realizar publicaciones falsas o engañosas</li>
                  <li>No acosar, intimidar o discriminar a otros usuarios</li>
                  <li>No intentar acceder a cuentas de otros usuarios</li>
                  <li>No sobrecargar nuestros servidores o interrumpir servicios</li>
                  <li>Reportar actividades sospechosas o fraudulentas</li>
                </ul>
                
                <p>
                  Nos reservamos el derecho de suspender o terminate cuentas que 
                  violate estos términos sin previo aviso.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="propiedad-intelectual">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Gavel className="size-6" />
                8. Propiedad Intelectual
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Todo el contenido de Arrendamientos CR, incluyendo pero no limitado a 
                  textos, gráficos, logotipos, íconos, imágenes, clips de audio, 
                  descargas digitales y software, es propiedad de Arrendamientos CR 
                  o sus licenciantes y está protegido por leyes de propiedad intelectual.
                </p>
                
                <p>
                  Queda prohibido copiar, modificar, distribuir o usar nuestro contenido 
                  sin autorización expresa por escrito.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="limitacion">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="size-6" />
                9. Limitación de Responsabilidad
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Arrendamientos CR no es responsable por:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acuerdos o disputas entre arrendadores y arrendatarios</li>
                  <li>Pérdidas financieras derivadas de transacciones</li>
                  <li>Incumplimiento de contratos entre partes</li>
                  <li>Precisión de la información publicada por usuarios</li>
                  <li>Disponibilidad continua del servicio</li>
                  <li>Contenido de sitios web de terceros</li>
                </ul>
                
                <p>
                  Nuestra responsabilidad se limita al funcionamiento de la plataforma 
                  como herramienta de conexión entre usuarios.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="modificaciones">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="size-6" />
                10. Modificaciones al Servicio
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nos reservamos el derecho de modificar, suspender o discontinuar 
                  cualquier aspecto del servicio en cualquier momento, con o sin previo 
                  aviso.
                </p>
                
                <p>
                  Podemos actualizar estos términos periódicamente. Los cambios 
                  significativos serán notificados a través de correo electrónico o 
                  un aviso prominente en la plataforma. El uso continuado después de 
                  los cambios constituye aceptación de los nuevos términos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="ley">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Scale className="size-6" />
                11. Ley Aplicable
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Estos términos se rigen e interpretan de acuerdo con las leyes de 
                  la República de Costa Rica.
                </p>
                
                <p>
                  Cualquier controversia derivada del uso de nuestros servicios será 
                  resuelta ante los tribunales competentes de Costa Rica.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="contacto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-6" />
                12. Contacto
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Si tiene preguntas sobre estos Términos de Uso, puede contactarnos:
                </p>
                
                <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                  <p><strong>Correo electrónico:</strong> legal@arrendamientos-cr.com</p>
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
