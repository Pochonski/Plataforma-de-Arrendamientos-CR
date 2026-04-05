import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    // Simulación de envío de correo
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      toast.success('Correo enviado exitosamente', {
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/login" className="gap-2">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-primary/10 flex items-center justify-center">
              {step === 'email' ? (
                <KeyRound className="size-6 text-primary" />
              ) : (
                <CheckCircle2 className="size-6 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'email' ? 'Recuperar contraseña' : '¡Correo enviado!'}
            </CardTitle>
            <CardDescription>
              {step === 'email'
                ? 'Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña'
                : 'Hemos enviado las instrucciones a tu correo electrónico'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <Alert>
                  <Mail className="size-4" />
                  <AlertDescription>
                    Te enviaremos un enlace seguro para restablecer tu contraseña. El enlace expirará en 1 hora.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4 mr-2" />
                      Enviar instrucciones
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="size-4" />
                  <AlertDescription>
                    Hemos enviado un correo a <strong>{email}</strong> con instrucciones para restablecer tu
                    contraseña.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Pasos a seguir:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Revisa tu bandeja de entrada (y spam)</li>
                    <li>Haz clic en el enlace del correo</li>
                    <li>Ingresa tu nueva contraseña</li>
                    <li>Inicia sesión con tu nueva contraseña</li>
                  </ol>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Volver al inicio de sesión</Link>
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setEmail('');
                    }}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ¿No recibiste el correo? Intentar de nuevo
                  </button>
                </div>
              </div>
            )}

            {step === 'email' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Recordaste tu contraseña?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {step === 'email' && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p className="font-medium mb-2">💡 Consejos de seguridad:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Usa una contraseña única y segura</li>
              <li>Incluye letras mayúsculas, minúsculas, números y símbolos</li>
              <li>Evita usar información personal fácil de adivinar</li>
              <li>Considera usar un gestor de contraseñas</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
