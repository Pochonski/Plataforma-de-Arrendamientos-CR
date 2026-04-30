export const PROVINCIAS = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
] as const;

export const TIPOS_PROPIEDAD = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'local', label: 'Local comercial' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'oficina', label: 'Oficina' },
] as const;

export type Provincia = typeof PROVINCIAS[number];
export type TipoPropiedad = typeof TIPOS_PROPIEDAD[number]['value'];