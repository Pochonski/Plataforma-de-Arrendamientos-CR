import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
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
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MisPropiedades() {
  const { user } = useAuth();
  const { properties, deleteProperty, contracts, updateContract, updateProperty } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Finish Contract State
  const [finishPropertyId, setFinishPropertyId] = useState<string | null>(null);
  const [depositResolution, setDepositResolution] = useState<'devuelto' | 'retenido' | null>(null);

  const myProperties = properties.filter((p) => p.duenoId === user?.id);

  const filteredProperties = myProperties.filter((property) =>
    property.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.provincia.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.canton.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteProperty(id);
    setDeleteId(null);
    toast.success('Propiedad eliminada exitosamente');
  };

  const handleFinishContract = () => {
    if (!finishPropertyId || !depositResolution) return;

    const property = properties.find(p => p.id === finishPropertyId);
    if (!property) return;

    const activeContract = contracts.find(c => c.propiedadId === finishPropertyId && c.estado === 'activo');
    if (activeContract) {
      updateContract(activeContract.id, {
        estado: 'finalizado',
        estadoDeposito: depositResolution
      });
      toast.success(`Contrato finalizado. Depósito ${depositResolution}.`);
    }

    updateProperty(finishPropertyId, { estado: 'disponible' });
    setFinishPropertyId(null);
    setDepositResolution(null);
  };

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Disponible</Badge>;
      case 'alquilada':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">Alquilada</Badge>;
      case 'mantenimiento':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">Mantenimiento</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Propiedades</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus propiedades en alquiler
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/dashboard/propiedades/nueva">
            <Plus className="size-4 mr-2" />
            Nueva propiedad
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título o ubicación..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {property.imagenes[0] && (
                  <img
                    src={property.imagenes[0]}
                    alt={property.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {getEstadoBadge(property.estado)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/propiedades/${property.id}`}>
                          <Eye className="size-4 mr-2" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/propiedades/${property.id}/editar`}>
                          <Edit className="size-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      {property.estado === 'alquilada' && (
                        <DropdownMenuItem onClick={() => setFinishPropertyId(property.id)}>
                          <Trash2 className="size-4 mr-2 text-amber-500" />
                          Finalizar Contrato
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(property.id)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1 mb-1">{property.titulo}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {property.distrito}, {property.canton}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(property.precio, property.moneda)}
                  </span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/dashboard/propiedades/${property.id}/editar`}>
                      <Edit className="size-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/propiedades/${property.id}`}>
                      <Eye className="size-4 mr-1" />
                      Ver
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myProperties.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aún no has publicado propiedades</h3>
          <p className="text-muted-foreground mb-6">
            Comienza publicando tu primera propiedad en alquiler
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard/propiedades/nueva">
              <Plus className="size-4 mr-2" />
              Publicar primera propiedad
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No se encontraron propiedades</h3>
          <p className="text-muted-foreground mb-6">
            Intenta con otros términos de búsqueda
          </p>
          <Button onClick={() => setSearchQuery('')}>Limpiar búsqueda</Button>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finish Contract Dialog */}
      <AlertDialog open={!!finishPropertyId} onOpenChange={() => {
        setFinishPropertyId(null);
        setDepositResolution(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Contrato</AlertDialogTitle>
            <AlertDialogDescription>
              La propiedad volverá a estar disponible para alquilar. 
              Por favor, indica qué sucedió con el depósito de garantía.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 py-4">
            <Button
              variant={depositResolution === 'devuelto' ? 'default' : 'outline'}
              className={depositResolution === 'devuelto' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => setDepositResolution('devuelto')}
            >
              Fue devuelto al inquilino
            </Button>
            <Button
              variant={depositResolution === 'retenido' ? 'destructive' : 'outline'}
              onClick={() => setDepositResolution('retenido')}
            >
              Fue retenido (daños/deudas)
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishContract}
              disabled={!depositResolution}
            >
              Finalizar contrato
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
