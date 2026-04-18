import { Link } from 'react-router';
import { Building2, Heart } from 'lucide-react';

const productoLinks = [
  { label: 'Propiedades', path: '/propiedades' },
  { label: 'Cómo funciona', path: '/#como-funciona' },
  { label: 'Beneficios', path: '/#beneficios' },
];

const recursosLinks = [
  { label: 'Centro de Ayuda', path: '/centro-ayuda' },
];

const legalLinks = [
  { label: 'Términos de Uso', path: '/terminos' },
  { label: 'Privacidad', path: '/privacidad' },
  { label: 'Cookies', path: '/cookies' },
];

export function DashboardFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <span>Arrendamientos CR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plataforma moderna para gestionar alquileres en Costa Rica de forma segura y transparente.
            </p>
          </div>

          {/* Producto */}
          <div>
            <h3 className="font-semibold mb-3">Producto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productoLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {recursosLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Arrendamientos CR. Todos los derechos reservados.</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Hecho con</span>
              <Heart className="size-3 text-red-500 fill-red-500" />
              <span>en Costa Rica</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
