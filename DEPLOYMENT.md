# 🚀 Guía de Deployment

Esta guía te ayudará a deployar la Plataforma de Arrendamientos CR en diferentes plataformas.

## 📋 Requisitos Previos

Antes de hacer deploy, asegúrate de:

- [ ] Tener todos los cambios commiteados
- [ ] Haber probado la aplicación localmente
- [ ] Configurar las variables de entorno necesarias
- [ ] Revisar que no haya errores en consola

## 🔨 Build de Producción

```bash
# Instalar dependencias
npm install

# Crear build de producción
npm run build

# Preview del build (opcional)
npm run preview
```

El build generará una carpeta `/dist` con los archivos estáticos optimizados.

## 🌐 Opciones de Deployment

### 1. Vercel (Recomendado)

Vercel es ideal para aplicaciones React y ofrece deployment automático.

#### Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

#### Via GitHub

1. Conecta tu repositorio con Vercel
2. Importa el proyecto
3. Configura las variables de entorno
4. Vercel hará deploy automáticamente en cada push

**Configuración:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

#### Via CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy a producción
netlify deploy --prod
```

#### Via Drag & Drop

1. Haz build: `npm run build`
2. Ve a [netlify.com/drop](https://app.netlify.com/drop)
3. Arrastra la carpeta `dist`

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar scripts a package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

**vite.config.ts:**

```typescript
export default defineConfig({
  base: '/nombre-del-repo/',
  // ... resto de la configuración
})
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Subir a S3
aws s3 sync dist/ s3://tu-bucket-name --delete

# Invalidar cache de CloudFront
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"
```

### 5. Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build y run:**

```bash
# Build imagen
docker build -t arrendamientos-cr .

# Run container
docker run -p 8080:80 arrendamientos-cr
```

## 🔐 Variables de Entorno

### Variables Esenciales

Para producción, necesitas configurar:

```env
VITE_API_URL=https://tu-api.com/api
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-preset
```

### Configuración por Plataforma

**Vercel:**
- Project Settings → Environment Variables

**Netlify:**
- Site settings → Build & deploy → Environment

**GitHub Pages:**
- Settings → Secrets and variables → Actions

## 🔍 Verificación Post-Deployment

### Checklist

- [ ] La aplicación carga correctamente
- [ ] Todas las rutas funcionan (SPA routing)
- [ ] Las imágenes se cargan correctamente
- [ ] El modo oscuro funciona
- [ ] Responsive en mobile/tablet/desktop
- [ ] No hay errores en consola
- [ ] Los formularios envían datos
- [ ] Las notificaciones aparecen
- [ ] El localStorage funciona

### Testing en Producción

```bash
# Test de rendimiento
npm install -g lighthouse

lighthouse https://tu-app.com --view

# Test de links rotos
npm install -g broken-link-checker

blc https://tu-app.com -ro
```

## 🚨 Solución de Problemas Comunes

### Problema: Rutas 404 al refrescar

**Solución:** Configurar fallback a index.html

**Vercel:** Crear `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify:** Crear `_redirects` en `/public`:
```
/*  /index.html  200
```

### Problema: Variables de entorno no funcionan

**Solución:** 
- Asegúrate de usar el prefijo `VITE_`
- Rebuildeá después de cambiar variables
- Verifica que estén configuradas en la plataforma

### Problema: Archivos estáticos no se encuentran

**Solución:**
- Verifica la configuración de `base` en vite.config.ts
- Usa rutas relativas en lugar de absolutas
- Revisa que los archivos estén en `/public`

## 📊 Monitoreo y Analytics

### Configurar Google Analytics

```typescript
// En App.tsx o main.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Track pageviews
const router = createBrowserRouter([
  // ... rutas
]);

router.subscribe((location) => {
  ReactGA.send({ hitType: "pageview", page: location.pathname });
});
```

### Configurar Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 🔄 CI/CD

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Optimizaciones de Producción

### Performance

1. **Code Splitting**: Ya implementado con React Router
2. **Lazy Loading**: Para rutas no críticas
3. **Image Optimization**: Usar WebP cuando sea posible
4. **Caching**: Configurar headers apropiados
5. **Minificación**: Ya incluida en Vite

### SEO

```html
<!-- En index.html -->
<head>
  <meta name="description" content="Plataforma de arrendamientos en Costa Rica">
  <meta property="og:title" content="Arrendamientos CR">
  <meta property="og:description" content="Gestiona tus alquileres de forma profesional">
  <meta property="og:image" content="/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
</head>
```

## 📞 Soporte

Si tienes problemas con el deployment:

1. Revisa los logs de build
2. Verifica las variables de entorno
3. Consulta la documentación de la plataforma
4. Abre un issue en GitHub

---

**¡Feliz Deployment! 🎉**
