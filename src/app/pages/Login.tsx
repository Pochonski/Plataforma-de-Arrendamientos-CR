import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Logo } from '../components/shared/Logo';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!correo || !contraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(correo, contraseña);
      if (success) {
        toast.success('¡Bienvenido de nuevo!');
        navigate('/dashboard');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 flex items-center justify-between border-b lg:border-none">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight">Iniciar sesión</h1>
              <p className="text-muted-foreground">
                Ingresa a tu cuenta para gestionar tus alquileres
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="size-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="correo"
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="pl-10"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraseña">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="contraseña"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recordarme"
                      checked={recordarme}
                      onCheckedChange={(checked) => setRecordarme(checked as boolean)}
                    />
                    <label
                      htmlFor="recordarme"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recordarme
                    </label>
                  </div>
                  <Link
                    to="/recuperar-contraseña"
                    className="text-sm text-primary hover:underline"
                  >
                    Olvidé mi contraseña
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>Iniciando sesión...</>
                  ) : (
                    <>
                      <LogIn className="size-4 mr-2" />
                      Iniciar sesión
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <svg className="size-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar con Google
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="text-primary hover:underline font-medium">
                  Regístrate gratis
                </Link>
              </p>
            </form>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Al continuar, aceptas nuestros{' '}
                <Link to="#" className="text-primary hover:underline">
                  Términos de servicio
                </Link>{' '}
                y{' '}
                <Link to="#" className="text-primary hover:underline">
                  Política de privacidad
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-muted relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1720678554596-bab43d25ebd1?w=1200"
          alt="Edificio moderno"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center p-12">
          <div className="max-w-md text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Gestiona tus alquileres de forma profesional
            </h2>
            <p className="text-lg opacity-90">
              La plataforma más completa para dueños e inquilinos en Costa Rica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
