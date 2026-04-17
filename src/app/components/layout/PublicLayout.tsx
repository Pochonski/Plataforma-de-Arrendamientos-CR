import { Link, Outlet } from 'react-router';
import { Button } from '../ui/button';
import { Logo } from '../shared/Logo';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Building2, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function PublicLayout() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/propiedades" className="text-muted-foreground hover:text-foreground transition-colors">
              Propiedades
            </Link>
            <Link 
              to="/#como-funciona" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Cómo funciona
            </Link>
            <Link 
              to="/#beneficios" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Beneficios
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link to="/dashboard">Panel de Control</Link>
                </Button>
                <Button variant="outline" onClick={logout} className="hidden sm:inline-flex">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

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
                <li><Link to="/propiedades" className="hover:text-foreground transition-colors">Propiedades</Link></li>
                <li><Link to="/#como-funciona" className="hover:text-foreground transition-colors">Cómo funciona</Link></li>
                <li><Link to="/#beneficios" className="hover:text-foreground transition-colors">Beneficios</Link></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="font-semibold mb-3">Recursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/centro-ayuda" className="hover:text-foreground transition-colors">Centro de Ayuda</Link></li>
                <li><Link to="/centro-ayuda" className="hover:text-foreground transition-colors">Guías</Link></li>
                <li><Link to="/centro-ayuda" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terminos" className="hover:text-foreground transition-colors">Términos de Uso</Link></li>
                <li><Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                <li><Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
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
    </div>
  );
}
