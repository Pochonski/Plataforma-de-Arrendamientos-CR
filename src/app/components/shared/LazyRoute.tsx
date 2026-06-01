import { Suspense, type ComponentType } from 'react';

interface LazyRouteProps {
  component: ComponentType;
}

export function LazyRoute({ component: Component }: LazyRouteProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <Component />
    </Suspense>
  );
}
