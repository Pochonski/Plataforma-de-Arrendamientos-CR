# 🚀 Guía de Inicio Rápido

¡Bienvenido a la Plataforma de Arrendamientos CR! Esta guía te ayudará a tener el proyecto corriendo en menos de 5 minutos.

## ⚡ Inicio Express (< 5 minutos)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

Eso es todo! 🎉

## 👥 Credenciales de Prueba

### Dueño
```
Email: carlos@example.com
Contraseña: cualquier texto (es demo)
```

### Inquilino
```
Email: maria@example.com
Contraseña: cualquier texto (es demo)
```

## 🎯 Prueba Rápida del Sistema

### Como Dueño (5 minutos)
1. Inicia sesión con `carlos@example.com`
2. Ve el dashboard con 3 propiedades
3. Crea una nueva invitación
4. Copia el enlace de invitación
5. Revisa los pagos pendientes

### Como Inquilino (5 minutos)
1. Inicia sesión con `maria@example.com`
2. Explora el catálogo de propiedades
3. Pega el enlace de invitación en una nueva pestaña
4. Acepta la invitación
5. Sube un comprobante de pago

### Flujo Completo E2E (10 minutos)
1. **Dueño**: Crear nueva propiedad
2. **Dueño**: Crear invitación para esa propiedad
3. **Dueño**: Copiar enlace de invitación
4. **Inquilino**: Abrir enlace en otra pestaña
5. **Inquilino**: Aceptar invitación
6. **Inquilino**: Subir comprobante
7. **Dueño**: Revisar y aprobar comprobante
8. **Ambos**: Enviar mensajes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Build
npm run build        # Build de producción
npm run preview      # Preview del build
```

## 📂 Navegación Rápida

### Páginas Públicas
- `/` - Landing page
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta
- `/propiedades` - Catálogo
- `/recuperar-contraseña` - Recuperar contraseña
- `/design-docs` - Documentación visual

### Dashboard Dueño
- `/dashboard` - Dashboard principal
- `/dashboard/propiedades` - Mis propiedades
- `/dashboard/propiedades/nueva` - Nueva propiedad
- `/dashboard/invitaciones` - Invitaciones
- `/dashboard/pagos` - Pagos recibidos
- `/dashboard/mensajes` - Mensajes
- `/dashboard/perfil` - Perfil

### Dashboard Inquilino
- `/dashboard` - Dashboard principal
- `/dashboard/contrato` - Mi contrato
- `/dashboard/pago` - Subir comprobante
- `/dashboard/mensajes` - Mensajes
- `/dashboard/historial` - Historial
- `/dashboard/perfil` - Perfil

## 💡 Tips Útiles

### Cambiar entre Usuarios
1. Cierra sesión (botón en el sidebar)
2. Inicia sesión con otro usuario
3. O usa modo incógnito para tener ambos abiertos

### Probar el Modo Oscuro
- Busca el ícono de sol/luna en la esquina superior
- El tema se guarda automáticamente

### Explorar la Documentación
- Visita `/design-docs` para ver wireframes y mockups
- Lee [test-users.md](test-users.md) para flujos detallados
- Revisa [README.md](../../README.md) para información completa

## 🐛 Solución Rápida de Problemas

### El servidor no inicia
```bash
# Limpia e reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Puerto 5173 ocupado
```bash
# Vite usará automáticamente el siguiente puerto disponible
# O especifica uno: npm run dev -- --port 3000
```

### No se ven las imágenes
- Las imágenes vienen de Unsplash
- Verifica tu conexión a internet
- Si persiste, revisa la consola del navegador

## 📚 Siguiente Paso

Una vez que hayas probado la aplicación:

1. Lee [README.md](../../README.md) para entender la arquitectura
2. Revisa [test-users.md](test-users.md) para flujos completos
3. Explora [contributing.md](../project/contributing.md) si quieres contribuir
4. Consulta [deployment.md](deployment.md) para publicar

## 🎉 ¡A Explorar!

El proyecto tiene:
- ✅ 28 páginas completas
- ✅ Sistema de autenticación
- ✅ CRUD de propiedades
- ✅ Invitaciones y contratos
- ✅ Pagos y comprobantes
- ✅ Mensajería
- ✅ Notificaciones
- ✅ Modo claro/oscuro
- ✅ Responsive design

**¡Disfruta explorando la plataforma! 🚀**

---

**¿Necesitas ayuda?** Abre un issue en GitHub o consulta la documentación completa.
