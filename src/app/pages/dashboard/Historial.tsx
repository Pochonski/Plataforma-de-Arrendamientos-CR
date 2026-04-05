import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Filter,
} from 'lucide-react';

export default function Historial() {
  const { user } = useAuth();
  const { payments, properties } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAño, setFilterAño] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const myPayments = user?.rol === 'dueño'
    ? payments.filter((p) => p.duenoId === user?.id)
    : payments.filter((p) => p.inquilinoId === user?.id);

  const filteredPayments = myPayments.filter((payment) => {
    const property = properties.find((p) => p.id === payment.propiedadId);
    const matchesSearch = property?.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAño = filterAño === 'todos' || payment.año.toString() === filterAño;
    const matchesEstado = filterEstado === 'todos' || payment.estado === filterEstado;
    return matchesSearch && matchesAño && matchesEstado;
  });

  const años = Array.from(new Set(myPayments.map((p) => p.año))).sort((a, b) => b - a);

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getMonthName = (mes: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[mes - 1];
  };

  const getPaymentStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="size-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'aprobado':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="size-3 mr-1" />
            Aprobado
          </Badge>
        );
      case 'rechazado':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
            <XCircle className="size-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const totalAprobado = filteredPayments
    .filter((p) => p.estado === 'aprobado')
    .reduce((sum, p) => sum + p.monto, 0);

  const totalPendiente = filteredPayments
    .filter((p) => p.estado === 'pendiente')
    .reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Historial de Pagos</h1>
        <p className="text-muted-foreground mt-1">
          {user?.rol === 'dueño'
            ? 'Visualiza todos los pagos recibidos'
            : 'Visualiza todos tus pagos realizados'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total pagos</p>
              <p className="text-3xl font-bold">{filteredPayments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">
                {filteredPayments.filter((p) => p.estado === 'aprobado').length}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(totalAprobado, 'CRC')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-3xl font-bold text-amber-600">
                {filteredPayments.filter((p) => p.estado === 'pendiente').length}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(totalPendiente, 'CRC')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por propiedad..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterAño} onValueChange={setFilterAño}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los años</SelectItem>
                  {años.map((año) => (
                    <SelectItem key={año} value={año.toString()}>
                      {año}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aprobado">Aprobados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="rechazado">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pagos</CardTitle>
          {filteredPayments.length > 0 && (
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-2" />
              Exportar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    {user?.rol === 'inquilino' && <TableHead>Nota</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const property = properties.find((p) => p.id === payment.propiedadId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {property?.titulo || 'Propiedad'}
                        </TableCell>
                        <TableCell>
                          {getMonthName(payment.mes)} {payment.año}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(payment.monto, payment.moneda)}
                        </TableCell>
                        <TableCell>
                          {payment.fechaSubida
                            ? new Date(payment.fechaSubida).toLocaleDateString('es-CR')
                            : '-'}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.estado)}</TableCell>
                        {user?.rol === 'inquilino' && (
                          <TableCell>
                            {payment.estado === 'rechazado' && payment.motivoRechazo ? (
                              <span className="text-xs text-muted-foreground">
                                {payment.motivoRechazo}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterAño !== 'todos' || filterEstado !== 'todos'
                  ? 'No se encontraron pagos con los filtros aplicados'
                  : user?.rol === 'dueño'
                  ? 'Aún no has recibido comprobantes de pago'
                  : 'Aún no has realizado pagos'}
              </p>
              {(searchQuery || filterAño !== 'todos' || filterEstado !== 'todos') && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterAño('todos');
                    setFilterEstado('todos');
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
