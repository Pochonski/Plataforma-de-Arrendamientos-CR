import { Link, Outlet } from 'react-router';
import { Button } from '../ui/button';
import { Logo } from '../shared/Logo';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Building2, Search, FileText, CreditCard, BarChart3 } from 'lucide-react';
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
            <Link to="/#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </Link>
            <Link to="/#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
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

      <footer className="relative border-t bg-slate-950 text-slate-200 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-primary/20 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
                  <Building2 className="size-6" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  ARRENDAMIENTOS <span className="text-primary">CR</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs">
                Liderando la transformación digital del sector inmobiliario en Costa Rica. Seguridad, transparencia y eficiencia en cada contrato.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link to="#" className="size-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <BarChart3 className="size-5" />
                </Link>
                <Link to="#" className="size-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Users className="size-5" />
                </Link>
                <Link to="#" className="size-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Shield className="size-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-widest text-sm">Plataforma</h3>
              <ul className="space-y-4">
                <li><Link to="/propiedades" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Propiedades</Link></li>
                <li><Link to="/#como-funciona" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Cómo funciona</Link></li>
                <li><Link to="/#beneficios" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Beneficios</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Planes de Precios</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-widest text-sm">Compañía</h3>
              <ul className="space-y-4">
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Sobre nosotros</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Centro de ayuda</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Blog de noticias</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Contacto directo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-widest text-sm">Legalidad</h3>
              <ul className="space-y-4">
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Términos de servicio</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Política de privacidad</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Acuerdo de nivel de servicio</Link></li>
                <li><Link to="#" className="text-slate-400 hover:text-primary transition-colors">Configuración de cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <p className="font-medium italic">© 2026 Arrendamientos CR. Desarrollado con tecnología de vanguardia.</p>
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-green-500"></div> Sistemas Activos</span>
              <div className="flex items-center gap-4">
                <span className="hover:text-primary cursor-pointer transition-colors">San José, Costa Rica</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
