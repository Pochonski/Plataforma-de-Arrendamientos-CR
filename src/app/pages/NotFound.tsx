import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-9xl font-bold text-primary/10 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FileQuestion className="size-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Página no encontrada</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1" size="lg">
              <Link to="/">
                <Home className="size-4 mr-2" />
                Ir al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link to="/propiedades">
                <Search className="size-4 mr-2" />
                Ver propiedades
              </Link>
            </Button>
          </div>

          <Button variant="ghost" asChild className="mt-4">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="size-4 mr-2" />
              Volver atrás
            </button>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
