import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registroFormSchema } from '@/lib/validations';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleAuth } from '@/lib/hooks/useGoogleAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { UserPlus, Mail, Lock, User, AlertCircle, Building2, Home, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function Registro() {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [showEmailRoleDialog, setShowEmailRoleDialog] = useState(false);
  const [serverError, setServerError] = useState('');

  const google = useGoogleAuth();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registroFormSchema>>({
    resolver: zodResolver(registroFormSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      telefono: '',
      contraseña: '',
      confirmarContraseña: '',
    },
  });

  const onSubmit = () => {
    setServerError('');
    setShowEmailRoleDialog(true);
  };

  const handleRoleSelection = async (rol: 'dueño' | 'inquilino') => {
    const data = form.getValues();

    try {
      const success = await registerUser(data.nombre, data.correo, data.contraseña, rol, data.telefono);
      if (success) {
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/dashboard');
      } else {
        setServerError('No se pudo crear la cuenta. Intenta de nuevo.');
        setShowEmailRoleDialog(false);
      }
    } catch (err) {
      setServerError('Ocurrió un error. Por favor intenta de nuevo.');
      setShowEmailRoleDialog(false);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col">


          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
                <p className="text-muted-foreground">
                  Comienza a gestionar tus alquileres hoy mismo
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="size-4 flex-shrink-0" />
                    <span>{serverError}</span>
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
                        className={`pl-10 ${form.formState.errors.nombre ? 'border-destructive' : ''}`}
                        {...form.register('nombre')}
                        disabled={isLoading}
                      />
                    </div>
                    {form.formState.errors.nombre && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" /> {form.formState.errors.nombre.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground flex items-center justify-center font-bold text-[10px]">#</div>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="8888-8888"
                        className={`pl-10 ${form.formState.errors.telefono ? 'border-destructive' : ''}`}
                        {...form.register('telefono')}
                        disabled={isLoading}
                      />
                    </div>
                    {form.formState.errors.telefono && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" /> {form.formState.errors.telefono.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="correo"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        className={`pl-10 ${form.formState.errors.correo ? 'border-destructive' : ''}`}
                        {...form.register('correo')}
                        disabled={isLoading}
                      />
                    </div>
                    {form.formState.errors.correo && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" /> {form.formState.errors.correo.message}
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
                        className={`pl-10 pr-10 ${form.formState.errors.contraseña ? 'border-destructive' : ''}`}
                        {...form.register('contraseña')}
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
                    {form.formState.errors.contraseña && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" /> {form.formState.errors.contraseña.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarContraseña">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="confirmarContraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 ${form.formState.errors.confirmarContraseña ? 'border-destructive' : ''}`}
                        {...form.register('confirmarContraseña')}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {form.formState.errors.confirmarContraseña && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="size-3" /> {form.formState.errors.confirmarContraseña.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="size-4 mr-2" />
                    Crear cuenta
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Inicia sesión
                  </Link>
                </p>
              </form>

              <div className="space-y-3">
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

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={google.handleGoogleSuccess}
                    onError={() => {
                      toast.error('Error con Google OAuth');
                    }}
                    useOneTap={false}
                    text="signup_with"
                    shape="rectangular"
                    logo_alignment="left"
                    width={240}
                  />
                </div>
              </div>

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
      <Dialog open={showEmailRoleDialog} onOpenChange={setShowEmailRoleDialog}>
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

      {/* Role Selection Dialog for Google Login */}
      <Dialog open={google.showRoleSelection} onOpenChange={google.closeRoleDialog}>
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
              onClick={() => google.handleRoleSelection('dueño')}
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
                <Button className="w-full" disabled={google.isLoading}>
                  {google.isLoading ? 'Creando cuenta...' : 'Continuar como dueño'}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
              onClick={() => google.handleRoleSelection('inquilino')}
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
                <Button className="w-full" disabled={google.isLoading}>
                  {google.isLoading ? 'Creando cuenta...' : 'Continuar como inquilino'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
