# Guía de Contribución

¡Gracias por tu interés en contribuir a la Plataforma de Arrendamientos CR! 🎉

Este documento proporciona pautas y mejores prácticas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Estilo](#guía-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto y todos los participantes se rigen por nuestro Código de Conducta. Al participar, se espera que respetes este código.

### Nuestros Estándares

- Usar lenguaje inclusivo y acogedor
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🚀 Cómo Contribuir

### Formas de Contribuir

1. **Reportar Bugs** - Ayúdanos a mejorar reportando problemas
2. **Sugerir Features** - Comparte ideas para nuevas funcionalidades
3. **Mejorar Documentación** - Ayuda a clarificar y expandir la documentación
4. **Escribir Código** - Implementa nuevas características o arregla bugs
5. **Revisar PRs** - Ayuda revisando pull requests de otros

### Proceso General

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## ⚙️ Configuración del Entorno

### Requisitos Previos

- Node.js 18 o superior
- npm, yarn o pnpm
- Git
- Editor de código (recomendado: VS Code)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/usuario/arrendamientos-cr.git
cd arrendamientos-cr

# Instalar dependencias
npm install
# o
pnpm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### VS Code Extensions Recomendadas

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- GitLens

## 📁 Estructura del Proyecto

```
/
├── src/
│   ├── app/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── layout/         # Layouts (Public, Dashboard)
│   │   │   ├── shared/         # Componentes compartidos
│   │   │   └── ui/             # Componentes UI (Shadcn)
│   │   ├── contexts/           # Context providers
│   │   ├── pages/              # Páginas
│   │   │   └── dashboard/      # Páginas del dashboard
│   │   ├── types/              # Tipos TypeScript
│   │   ├── utils/              # Utilidades
│   │   ├── App.tsx             # Componente raíz
│   │   └── routes.tsx          # Configuración de rutas
│   └── styles/                 # Estilos globales
├── public/                     # Archivos estáticos
└── docs/                       # Documentación
```

## 🎨 Guía de Estilo

### TypeScript

- Usar TypeScript para todo el código nuevo
- Definir interfaces explícitas para props
- Evitar `any`, usar tipos específicos
- Preferir `const` sobre `let`

```typescript
// ✅ Correcto
interface UserProps {
  name: string;
  email: string;
  role: 'dueño' | 'inquilino';
}

const UserCard = ({ name, email, role }: UserProps) => {
  // ...
};

// ❌ Incorrecto
const UserCard = (props: any) => {
  // ...
};
```

### React

- Usar componentes funcionales con hooks
- Extraer lógica compleja a custom hooks
- Mantener componentes pequeños y enfocados
- Usar nombres descriptivos

```typescript
// ✅ Correcto
export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}

// ❌ Incorrecto - componente demasiado genérico
export function Card({ data }: any) {
  // ...
}
```

### CSS y Tailwind

- Usar clases de Tailwind en lugar de CSS custom cuando sea posible
- Seguir el orden convencional de clases
- Usar variables CSS del tema para colores

```tsx
// ✅ Correcto - orden lógico de clases
<div className="flex items-center gap-2 p-4 rounded-lg bg-primary text-primary-foreground">

// ❌ Incorrecto - orden aleatorio
<div className="text-primary-foreground bg-primary rounded-lg flex p-4 items-center gap-2">
```

### Convenciones de Nombres

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Funciones**: camelCase (`getUserById()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Variables**: camelCase (`userEmail`)
- **Tipos/Interfaces**: PascalCase (`UserRole`)

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[notas al pie opcionales]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en el proceso de build o herramientas

**Ejemplos:**

```bash
git commit -m "feat: agregar filtro de búsqueda por precio"
git commit -m "fix: corregir error en validación de formulario"
git commit -m "docs: actualizar README con instrucciones de instalación"
git commit -m "refactor: simplificar lógica del componente PropertyCard"
```

## 🔄 Proceso de Pull Request

### Antes de Crear el PR

1. ✅ Asegúrate de que el código compile sin errores
2. ✅ Verifica que todos los tests pasen (cuando estén implementados)
3. ✅ Revisa que el código siga la guía de estilo
4. ✅ Actualiza la documentación si es necesario
5. ✅ Prueba en diferentes tamaños de pantalla
6. ✅ Prueba en modo claro y oscuro

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios realizados

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Cambios Realizados
- Item 1
- Item 2
- Item 3

## Screenshots (si aplica)
Capturas de pantalla de los cambios visuales

## Checklist
- [ ] Mi código sigue la guía de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado en diferentes navegadores
- [ ] He probado en modo responsive
```

### Revisión de Código

- Los PRs serán revisados por al menos un mantenedor
- Se pueden solicitar cambios antes de hacer merge
- Sé receptivo a feedback constructivo
- Responde a comentarios en tiempo razonable

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no sea un bug ya reportado
2. Asegúrate de usar la última versión
3. Recopila información del problema

### Template de Bug Report

```markdown
**Descripción del Bug**
Una descripción clara y concisa del bug.

**Pasos para Reproducir**
1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que sucediera.

**Comportamiento Actual**
Descripción de lo que realmente sucede.

**Screenshots**
Si es aplicable, agrega screenshots.

**Entorno:**
 - OS: [e.g. Windows 10]
 - Navegador: [e.g. chrome 120]
 - Versión: [e.g. 1.0.0]

**Contexto Adicional**
Cualquier otra información relevante.
```

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Otras soluciones o características que consideraste.

**Contexto Adicional**
Screenshots, mockups, ejemplos, etc.

**Impacto**
- [ ] Usuarios finales (dueños)
- [ ] Usuarios finales (inquilinos)
- [ ] Desarrolladores
- [ ] Todos los anteriores
```

## 🧪 Testing (Futuro)

Cuando se implementen tests:

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Cobertura de tests
npm test -- --coverage
```

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Shadcn/ui Docs](https://ui.shadcn.com/)

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir:

1. Revisa la documentación existente
2. Busca en issues cerrados
3. Abre un issue con la etiqueta "question"
4. Contacta a los mantenedores

## 🙏 Agradecimientos

¡Gracias por tomarte el tiempo de contribuir! Cada contribución, sin importar su tamaño, es valiosa y apreciada.

---

**Happy Coding! 💻**
