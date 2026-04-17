import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadExcel } from '../../utils/export';

export default function PagosRecibidos() {
  const { user } = useAuth();
  const { payments, updatePayment, properties, updateContract, fetchPayments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (user?.id) {
      fetchPayments(user.id);
    }
  }, [user?.id, fetchPayments]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const myPayments = payments;

  const filteredPayments = myPayments.filter((payment) => {
    const property = properties.find((p) => p.id === payment.propiedadId);
    const matchesSearch = property?.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || payment.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = myPayments.filter((p) => p.estado === 'pendiente').length;

  const formatPrice = (precio: number, moneda: string) => {
    const symbol = moneda === 'USD' ? '$' : '₡';
    return `${symbol}${precio.toLocaleString('es-CR')}`;
  };

  const getMonthName = (mes: number) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[mes - 1];
  };

  const getPaymentStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"><Clock className="size-3 mr-1" />Pendiente</Badge>;
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"><CheckCircle2 className="size-3 mr-1" />Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"><XCircle className="size-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getPaymentTypeBadge = (tipo?: string) => {
    if (tipo === 'deposito') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Depósito</Badge>;
    }
    return <Badge variant="outline">Mensualidad</Badge>;
  };

  const handleApprove = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    updatePayment(paymentId, {
      estado: 'aprobado',
      fechaRevision: new Date(),
    });

    if (payment.tipo === 'deposito') {
      updateContract(payment.contratoId, {
        estadoDeposito: 'pagado'
      });
    }

    setSelectedPayment(null);
    toast.success('Pago aprobado exitosamente');
  };

  const handleReject = () => {
    if (!selectedPayment || !motivoRechazo.trim()) {
      toast.error('Por favor indica el motivo del rechazo');
      return;
    }

    updatePayment(selectedPayment.id, {
      estado: 'rechazado',
      fechaRevision: new Date(),
      motivoRechazo: motivoRechazo.trim(),
    });

    setSelectedPayment(null);
    setShowRejectDialog(false);
    setMotivoRechazo('');
    toast.success('Pago rechazado');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pagos Recibidos</h1>
        <p className="text-muted-foreground mt-1">
          Revisa y aprueba los comprobantes de pago
        </p>
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
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
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
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold">
                  {myPayments.filter((p) => p.estado === 'aprobado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <XCircle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rechazados</p>
                <p className="text-2xl font-bold">
                  {myPayments.filter((p) => p.estado === 'rechazado').length}
                </p>
              </div>
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
              <Button
                variant={filterEstado === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('todos')}
              >
                Todos
              </Button>
              <Button
                variant={filterEstado === 'pendiente' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('pendiente')}
              >
                Pendientes
              </Button>
              <Button
                variant={filterEstado === 'aprobado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('aprobado')}
              >
                Aprobados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comprobantes</CardTitle>
          {filteredPayments.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => {
                const exportData = filteredPayments.map(p => {
                  const property = properties.find((pr) => pr.id === p.propiedadId);
                  return {
                    'Propiedad': property?.titulo || 'Propiedad',
                    'Tipo': p.tipo === 'deposito' ? 'Depósito' : 'Mensualidad',
                    'Periodo': p.tipo === 'deposito' ? 'Inicio' : `${getMonthName(p.mes)} ${p.año}`,
                    'Monto': p.monto,
                  'Moneda': p.moneda,
                  'Fecha de Subida': p.fechaSubida ? new Date(p.fechaSubida).toLocaleDateString() : 'N/A',
                  'Estado': p.estado,
                  'Nota de rechazo': p.motivoRechazo || ''
                };
              });
              downloadExcel(exportData, 'pagos_recibidos');
            }}>
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha subida</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
                        <TableCell>{getPaymentTypeBadge(payment.tipo)}</TableCell>
                        <TableCell>
                          {payment.tipo === 'deposito' ? 'Inicio' : `${getMonthName(payment.mes)} ${payment.año}`}
                        </TableCell>
                        <TableCell>{formatPrice(payment.monto, payment.moneda)}</TableCell>
                        <TableCell>
                          {payment.fechaSubida
                            ? new Date(payment.fechaSubida).toLocaleDateString('es-CR')
                            : '-'}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.estado)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="size-4 mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No hay pagos</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterEstado !== 'todos'
                  ? 'No se encontraron pagos con los filtros aplicados'
                  : 'Aún no has recibido comprobantes de pago'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del comprobante</DialogTitle>
            <DialogDescription>
              Revisa y aprueba o rechaza el comprobante de pago
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Propiedad</Label>
                  <p className="font-semibold">
                    {properties.find((p) => p.id === selectedPayment.propiedadId)?.titulo}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Periodo / Tipo</Label>
                  <p className="font-semibold mt-1">
                    {selectedPayment.tipo === 'deposito' ? (
                      <span className="flex items-center gap-2">{getPaymentTypeBadge(selectedPayment.tipo)} Inicio</span>
                    ) : (
                      <span className="flex items-center gap-2">{getPaymentTypeBadge(selectedPayment.tipo)} {getMonthName(selectedPayment.mes)} {selectedPayment.año}</span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Monto</Label>
                  <p className="font-semibold text-lg text-primary">
                    {formatPrice(selectedPayment.monto, selectedPayment.moneda)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <div className="mt-1">{getPaymentStatusBadge(selectedPayment.estado)}</div>
                </div>
              </div>

              {/* Voucher Image */}
              {selectedPayment.comprobante && (
                <div>
                  <Label className="mb-2 block">Comprobante</Label>
                  <div className="rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={selectedPayment.comprobante}
                      alt="Comprobante"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedPayment.estado === 'rechazado' && selectedPayment.motivoRechazo && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <Label className="text-red-900 dark:text-red-100">Motivo del rechazo</Label>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    {selectedPayment.motivoRechazo}
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedPayment?.estado === 'pendiente' && (
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(true);
                }}
              >
                <XCircle className="size-4 mr-2" />
                Rechazar
              </Button>
              <Button onClick={() => handleApprove(selectedPayment.id)}>
                <CheckCircle2 className="size-4 mr-2" />
                Aprobar pago
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar comprobante</DialogTitle>
            <DialogDescription>
              Indica el motivo por el cual rechazas este comprobante. El inquilino recibirá esta información.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo del rechazo *</Label>
              <Textarea
                id="motivo"
                placeholder="Ej: El monto no coincide, la imagen está borrosa..."
                rows={4}
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setMotivoRechazo('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!motivoRechazo.trim()}
            >
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
