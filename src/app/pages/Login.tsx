import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
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
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        const from = location.state?.from?.pathname || location.state?.returnTo || '/dashboard';
        navigate(from, { replace: true });
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

                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    setIsLoading(true);
                    try {
                      const success = await loginWithGoogle(credentialResponse);
                      if (success) {
                        toast.success('¡Bienvenido con Google!');
                        navigate('/dashboard', { replace: true });
                      } else {
                        toast.error('No se pudo iniciar sesión con Google');
                      }
                    } catch (err) {
                      toast.error('Error al iniciar sesión con Google');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onError={() => {
                    toast.error('Error con Google OAuth');
                  }}
                  useOneTap
                />
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
