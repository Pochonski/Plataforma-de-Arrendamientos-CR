# Arreglar Error de Google OAuth - "The given origin is not allowed for the given client ID"

## Problema

El botón de Google Sign-In muestra errores 400 porque el origen (origin) desde donde accedes a la aplicación **NO está autorizado** en Google Cloud Console.

## Solución: Agregar URIs autorizadas en Google Cloud Console

### Pasos:

1. **Ve a Google Cloud Console**
   - URL: https://console.cloud.google.com/
   - Selecciona tu proyecto (o crea uno nuevo)

2. **Ve a "APIs y Servicios" > "Credenciales"**
   - Haz clic en el nombre de tu **OAuth 2.0 Client ID** (el que usa el client ID: `703304000101-mv908iu4u9fqcpkmrnfg6u9fd0pkqk2o.apps.googleusercontent.com`)

3. **En la sección "Authorized JavaScript origins" (Orígenes JavaScript autorizados)**, agrega:

   ### Para desarrollo local:

   ```
   http://localhost:5173
   http://localhost:3000
   http://localhost:4173
   http://127.0.0.1:5173
   ```

   ### Para producción (Azure Static Web Apps):

   ```
   https://agreeable-ground-0b1436910.6.azurestaticapps.net
   ```

4. **En la sección "Authorized redirect URIs" (URIs de redirección autorizados)**, agrega:

   ```
   https://accounts.google.com/o/oauth2/v2/auth
   https://agreeable-ground-0b1436910.6.azurestaticapps.net/
   ```

5. **Guarda los cambios** y espera unos minutos (puede tomar hasta 5-10 minutos en propagarse)

6. **Limpia la caché del navegador** o abre una ventana de incógnito

7. **Recarga la página de login**

## Cómo encontrar tu URI de producción de Azure:

### Opción 1: Azure Static Web Apps

- Ve a https://portal.azure.com
- Busca "Static Web Apps"
- Selecciona tu aplicación
- La URL de producción será algo como: `https://blue-tree-0123456789-xxxx.azurestaticapps.net`

### Opción 2: Verificar en el despliegue

- Busca en los archivos de configuración de Azure o en la documentación del proyecto

## URIs típicas que debes agregar:

### Desarrollo:

- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Common alternative)
- `http://localhost:4173` (Vite preview)

### Producción Azure:

- `https://tu-app.azurewebsites.net`
- `https://tu-app-abc123.azurestaticapps.net`

## Notas importantes:

- **NO uses `localhost` en producción** - Solo para desarrollo
- **Agrega TODOS los orígenes** desde donde planeas acceder
- **Incluye tanto HTTP como HTTPS** si es necesario
- **Los cambios pueden tardar hasta 10 minutos** en aplicarse
