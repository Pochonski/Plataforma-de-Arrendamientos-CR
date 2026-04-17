import { Link } from 'react-router';
import { Building2, Heart } from 'lucide-react';

const footerLinks = [
  { label: 'Centro de Ayuda', path: '/centro-ayuda' },
  { label: 'Términos de Uso', path: '/terminos' },
  { label: 'Privacidad', path: '/privacidad' },
  { label: 'Cookies', path: '/cookies' },
];

export function DashboardFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo y Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-4" />
            <span>© {new Date().getFullYear()} Arrendamientos CR</span>
            <span className="hidden sm:inline">• Hecho con</span>
            <Heart className="size-3 hidden sm:inline text-red-500 fill-red-500" />
            <span className="hidden sm:inline">en Costa Rica</span>
          </div>

          {/* Enlaces funcionales */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
