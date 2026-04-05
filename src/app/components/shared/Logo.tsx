import { Building2 } from 'lucide-react';
import { Link } from 'react-router';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
      <div className="flex items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground">
        <Building2 className="size-5" />
      </div>
      <span className="hidden sm:inline">Arrendamientos CR</span>
    </Link>
  );
}
