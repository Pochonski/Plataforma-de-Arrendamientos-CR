import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  Mail,
  Plus,
  Search,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Invitaciones() {
  const { user } = useAuth();
  const { invitations, updateInvitation, properties } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);

  const myInvitations = invitations.filter((inv) => inv.duenoId === user?.id);

  const filteredInvitations = myInvitations.filter((invitation) => {
    const property = properties.find((p) => p.id === invitation.propiedadId);
    return (
      property?.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.inquilinoCorreo?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeCount = myInvitations.filter((inv) => inv.estado === 'pendiente').length;
  const acceptedCount = myInvitations.filter((inv) => inv.estado === 'aceptada').length;

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="size-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'aceptada':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="size-3 mr-1" />
            Aceptada
          </Badge>
        );
      case 'expirada':
        return (
          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400">
            <XCircle className="size-3 mr-1" />
            Expirada
          </Badge>
        );
      case 'cancelada':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
            <Ban className="size-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getDaysRemaining = (fechaExpiracion: Date) => {
    const now = new Date();
    const diff = new Date(fechaExpiracion).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const copyInvitationLink = async (token: string) => {
    const link = `${window.location.origin}/invitacion/${token}`;
    
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(link);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      // Fallback for when clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success('Enlace copiado al portapapeles');
        } else {
          toast.error('No se pudo copiar el enlace');
        }
      } catch (fallbackErr) {
        toast.error('No se pudo copiar el enlace');
        console.error('Error al copiar:', fallbackErr);
      }
    }
  };

  const handleCancel = (id: string) => {
    updateInvitation(id, { estado: 'cancelada' });
    setCancelId(null);
    toast.success('Invitación cancelada');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invitaciones de Contrato</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las invitaciones para tus propiedades
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/dashboard/invitaciones/nueva">
            <Plus className="size-4 mr-2" />
            Nueva invitación
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aceptadas</p>
                <p className="text-2xl font-bold">{acceptedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Mail className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{myInvitations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por propiedad o inquilino..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Invitations Table */}
      <Card>
        <CardContent className="p-6">
          {filteredInvitations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => {
                    const property = properties.find((p) => p.id === invitation.propiedadId);
                    const daysLeft = getDaysRemaining(invitation.fechaExpiracion);
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">
                          {property?.titulo || 'Propiedad'}
                        </TableCell>
                        <TableCell>
                          {invitation.inquilinoCorreo || 'Sin asignar'}
                        </TableCell>
                        <TableCell>
                          {formatPrice(invitation.montoAlquiler, invitation.moneda)}
                        </TableCell>
                        <TableCell>
                          {invitation.estado === 'pendiente' && daysLeft > 0 ? (
                            <span className="text-sm">
                              {daysLeft} día{daysLeft !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(invitation.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {invitation.estado === 'pendiente' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyInvitationLink(invitation.token)}
                                >
                                  <Copy className="size-4 mr-1" />
                                  Copiar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setCancelId(invitation.id)}
                                >
                                  <Ban className="size-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : myInvitations.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <Mail className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tienes invitaciones</h3>
              <p className="text-muted-foreground mb-6">
                Comienza creando una invitación para tus inquilinos
              </p>
              <Button asChild size="lg">
                <Link to="/dashboard/invitaciones/nueva">
                  <Plus className="size-4 mr-2" />
                  Crear primera invitación
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron invitaciones</h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otros términos de búsqueda
              </p>
              <Button onClick={() => setSearchQuery('')}>Limpiar búsqueda</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar invitación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La invitación será cancelada y el inquilino no podrá acceder al enlace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelId && handleCancel(cancelId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar invitación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}