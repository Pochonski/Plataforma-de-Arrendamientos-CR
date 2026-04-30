import type { ReactNode } from 'react';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const formatPrice = (precio: number, moneda: string): string => {
  const symbol = moneda === 'USD' ? '$' : '₡';
  return `${symbol}${precio.toLocaleString('es-CR')}`;
};

export const getMonthName = (mes: number): string => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[mes - 1] ?? '';
};

export const getMonthNameLong = (mes: number): string => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return months[mes - 1] ?? '';
};

export const getPaymentStatusBadge = (estado: string): JSX.Element => {
  switch (estado) {
    case 'pendiente':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"><Clock className="size-3 mr-1" />Pendiente</Badge>;
    case 'aprobado':
      return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"><CheckCircle2 className="size-3 mr-1" />Aprobado</Badge>;
    case 'rechazado':
      return <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"><XCircle className="size-3 mr-1" />Rechazado</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
};

export const getDaysRemaining = (fechaExpiracion: Date): number => {
  const now = new Date();
  const diff = new Date(fechaExpiracion).getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

export const getInitials = (nombre: string): string => {
  return nombre
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};