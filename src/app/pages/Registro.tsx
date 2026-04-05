import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Logo } from '../components/shared/Logo';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { UserPlus, Mail, Lock, User, AlertCircle, Building2, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir al menos una mayúscula';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir al menos un número';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nombre || !correo || !contraseña || !confirmarContraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    const passwordError = validatePassword(contraseña);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setShowRoleSelection(true);
  };

  const handleRoleSelection = async (rol: 'dueño' | 'inquilino') => {
    setIsLoading(true);
    
    try {
      const success = await register(nombre, correo, contraseña, rol);
      if (success) {
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/dashboard');
      } else {
        setError('No se pudo crear la cuenta. Intenta de nuevo.');
        setShowRoleSelection(false);
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
      setShowRoleSelection(false);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = validatePassword(contraseña);
  const hasMinLength = contraseña.length >= 8;
  const hasUppercase = /[A-Z]/.test(contraseña);
  const hasNumber = /[0-9]/.test(contraseña);

  return (
    <>
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
                <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
                <p className="text-muted-foreground">
                  Comienza a gestionar tus alquileres hoy mismo
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
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Juan Pérez"
                        className="pl-10"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

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
                    {contraseña && (
                      <div className="space-y-1 text-xs">
                        <div className={hasMinLength ? 'text-green-600' : 'text-muted-foreground'}>
                          {hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
                        </div>
                        <div className={hasUppercase ? 'text-green-600' : 'text-muted-foreground'}>
                          {hasUppercase ? '✓' : '○'} Al menos una mayúscula
                        </div>
                        <div className={hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                          {hasNumber ? '✓' : '○'} Al menos un número
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarContraseña">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="confirmarContraseña"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={confirmarContraseña}
                        onChange={(e) => setConfirmarContraseña(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="size-4 mr-2" />
                    Crear cuenta
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
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Inicia sesión
                  </Link>
                </p>
              </form>

              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Al crear una cuenta, aceptas nuestros{' '}
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
            src="https://images.unsplash.com/photo-1762374974129-f9266d9c4efc?w=1200"
            alt="Casa residencial"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center p-12">
            <div className="max-w-md text-white space-y-6">
              <h2 className="text-4xl font-bold">
                Únete a la comunidad de arrendamientos
              </h2>
              <p className="text-lg opacity-90">
                Miles de dueños e inquilinos ya confían en nuestra plataforma para gestionar sus alquileres
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Dialog */}
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
              onClick={() => handleRoleSelection('dueño')}
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
              onClick={() => handleRoleSelection('inquilino')}
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
    </>
  );
}
