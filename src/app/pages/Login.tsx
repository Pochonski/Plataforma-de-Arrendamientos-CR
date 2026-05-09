import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Building2, Home } from 'lucide-react';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ id: string; nombre: string; correo: string } | null>(null);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!correo.trim()) errors.correo = 'Por favor completa el correo';
    if (!contraseña) errors.contraseña = 'Por favor completa la contraseña';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential as string;
      const payload = JSON.parse(atob(token.split('.')[1]));

      const googleUserData = {
        id: payload.sub || payload.email,
        nombre: payload.name,
        correo: payload.email,
      };

      // Check if user already exists in DB
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/usuarios`, { cache: 'no-store' });
          if (response.ok) {
            const usuarios = await response.json();
            const normalizedEmail = googleUserData.correo.toLowerCase();
            const existingUser = usuarios.find((u: any) => (u.Correo || u.correo || '').toLowerCase() === normalizedEmail);
            if (existingUser) {
              // User exists, login directly with their data from DB
              const normalizedUser = {
                id: existingUser.Id || existingUser.id,
                nombre: existingUser.Nombre || existingUser.nombre,
                correo: existingUser.Correo || existingUser.correo,
                rol: existingUser.Rol === 'dueno' || existingUser.Rol === 'arrendador' ? 'dueño'
                   : existingUser.Rol === 'arrendatario' ? 'inquilino'
                   : existingUser.Rol || existingUser.rol || 'inquilino',
              };
              setUser(normalizedUser);
              toast.success('¡Bienvenido con Google!');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
        } catch (e) {
          console.error('Error checking existing user:', e);
        }
      }

      // User doesn't exist, show role selection
      setPendingGoogleUser(googleUserData);
      setShowRoleSelection(true);
    } catch (err) {
      toast.error('Error al procesar login de Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRoleSelection = async (rol: 'dueño' | 'inquilino') => {
    if (!pendingGoogleUser) return;

    setIsLoading(true);
    try {
      const success = await loginWithGoogle({ credential: '' }, rol, pendingGoogleUser);
      if (success) {
        toast.success('¡Bienvenido con Google!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('No se pudo crear la cuenta con Google');
      }
    } catch (err) {
      toast.error('Error al crear cuenta con Google');
    } finally {
      setIsLoading(false);
      setShowRoleSelection(false);
      setPendingGoogleUser(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">


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
                      className={`pl-10 ${fieldErrors.correo ? 'border-destructive' : ''}`}
                      value={correo}
                      onChange={(e) => {
                        setCorreo(e.target.value);
                        if (fieldErrors.correo) setFieldErrors(prev => ({ ...prev, correo: '' }));
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.correo && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3" /> {fieldErrors.correo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contraseña">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="contraseña"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${fieldErrors.contraseña ? 'border-destructive' : ''}`}
                      value={contraseña}
                      onChange={(e) => {
                        setContraseña(e.target.value);
                        if (fieldErrors.contraseña) setFieldErrors(prev => ({ ...prev, contraseña: '' }));
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {fieldErrors.contraseña && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3" /> {fieldErrors.contraseña}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recordarme"
                      checked={recordarme}
                      onCheckedChange={(checked) => {
                        if (checked !== 'indeterminate') setRecordarme(checked);
                      }}
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
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error('Error con Google OAuth');
                  }}
                  useOneTap={false}
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

      {/* Role Selection Dialog for Google Login */}
      <Dialog open={showRoleSelection} onOpenChange={setShowRoleSelection}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Selecciona tu rol</DialogTitle>
            <DialogDescription>
              Elige cómo vas a utilizar la plataforma. Esto nos ayudará a personalizar tu experiencia.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => handleGoogleRoleSelection('dueño')}
            >
              <CardContent className="p-6 space-y-4 text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                  <Building2 className="size-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Soy Dueño</h3>
                  <p className="text-sm text-muted-foreground">
                    Busco gestionar mis propiedades y administrar contratos de alquiler
                  </p>
                </div>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Continuar como dueño'}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => handleGoogleRoleSelection('inquilino')}
            >
              <CardContent className="p-6 space-y-4 text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
                  <Home className="size-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Soy Inquilino</h3>
                  <p className="text-sm text-muted-foreground">
                    Busco encontrar una propiedad y gestionar mi alquiler
                  </p>
                </div>
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Continuar como inquilino'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
