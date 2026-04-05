import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { User, Mail, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !correo.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      updateUser({ nombre, correo });
      toast.success('Perfil actualizado exitosamente');
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (rol: string) => {
    return rol === 'dueño' ? (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
        <Shield className="size-3 mr-1" />
        Dueño
      </Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
        <User className="size-3 mr-1" />
        Inquilino
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu información personal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="size-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {user ? getInitials(user.nombre) : 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-1">{user?.nombre}</h2>
            <p className="text-muted-foreground text-sm mb-4">{user?.correo}</p>
            {user && <div className="flex justify-center">{getRoleBadge(user.rol)}</div>}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
          </CardHeader>
          <CardContent>
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
                      placeholder="Tu nombre"
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
                  <Label>Rol en la plataforma</Label>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">
                      {user?.rol === 'dueño'
                        ? 'Estás registrado como propietario de inmuebles'
                        : 'Estás registrado como inquilino'}
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                <Save className="size-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Cuenta verificada</p>
                <p className="text-xs text-muted-foreground">Tu cuenta ha sido verificada</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Cambiar contraseña
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Correos de pagos</p>
                  <p className="text-xs text-muted-foreground">Recibe actualizaciones por email</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Recordatorios</p>
                  <p className="text-xs text-muted-foreground">Alertas de pagos pendientes</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
