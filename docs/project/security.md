# 🔐 Política de Seguridad

## Versiones Soportadas

| Versión | Soportada          |
| ------- | ------------------ |
| 1.0.x   | ✅ Sí              |
| < 1.0   | ❌ No              |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable:

### 🚨 Proceso de Reporte

1. **NO** abras un issue público
2. Envía un email a: [security@arrendamientoscr.com] (o crea un security advisory en GitHub)
3. Incluye:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de solución (si las tienes)

### ⏱️ Tiempo de Respuesta

- Reconocimiento inicial: 48 horas
- Evaluación y plan de acción: 7 días
- Fix y deployment: según severidad
  - Crítico: 24-48 horas
  - Alto: 1 semana
  - Medio: 2 semanas
  - Bajo: próxima versión

### 🏆 Reconocimiento

Los investigadores de seguridad que reporten vulnerabilidades de manera responsable serán reconocidos públicamente (si lo desean) en nuestro archivo de SECURITY_HALL_OF_FAME.md.

## 🛡️ Mejores Prácticas de Seguridad

### Para Desarrolladores

#### 1. Autenticación y Autorización

```typescript
// ✅ Correcto - verificar permisos
const handleDelete = (propertyId: string) => {
  if (user.rol !== 'dueño' || property.duenoId !== user.id) {
    toast.error('No tienes permiso para realizar esta acción');
    return;
  }
  // proceder con eliminación
};

// ❌ Incorrecto - confiar en el cliente
const handleDelete = (propertyId: string) => {
  // eliminar sin verificar permisos
};
```

#### 2. Validación de Entrada

```typescript
// ✅ Correcto - validar y sanitizar
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

const handleSubmit = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
  // procesar email
};

// ❌ Incorrecto - aceptar cualquier entrada
const handleSubmit = (email: string) => {
  // usar email sin validar
};
```

#### 3. Manejo de Datos Sensibles

```typescript
// ✅ Correcto - no almacenar datos sensibles en localStorage
// Usar httpOnly cookies o session storage
const storeToken = (token: string) => {
  // Almacenar en cookie httpOnly desde el backend
  // O usar sessionStorage solo para tokens no críticos
};

// ❌ Incorrecto - exponer tokens
localStorage.setItem('authToken', token); // ❌ Vulnerable a XSS
```

#### 4. Manejo de Archivos

```typescript
// ✅ Correcto - validar tipo y tamaño
const validateFile = (file: File): boolean => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (file.size > MAX_SIZE) {
    toast.error('El archivo es demasiado grande');
    return false;
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error('Tipo de archivo no permitido');
    return false;
  }
  
  return true;
};

// ❌ Incorrecto - aceptar cualquier archivo
const handleUpload = (file: File) => {
  // subir sin validar
};
```

### Para Usuarios

#### Contraseñas Seguras

- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos un carácter especial
- No usar información personal
- Usar un gestor de contraseñas

#### Reconocer Phishing

🚩 **Señales de alerta:**
- URLs sospechosas (revisar el dominio)
- Solicitudes urgentes de información
- Errores ortográficos
- Remitentes desconocidos

✅ **Buenas prácticas:**
- Verificar la URL antes de iniciar sesión
- Usar autenticación de dos factores (cuando esté disponible)
- No compartir credenciales
- Cerrar sesión al terminar

## 🔒 Características de Seguridad Implementadas

### Frontend (Actual)

- ✅ Validación de formularios
- ✅ Sanitización de inputs
- ✅ Rutas protegidas por autenticación
- ✅ Validación de tipos de archivo
- ✅ Límites de tamaño de archivo
- ✅ HTTPS enforced (en producción)
- ✅ No almacenar contraseñas en plain text

### Backend (Recomendado para Producción)

- [ ] JWT con expiración corta
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] CORS configurado correctamente
- [ ] Helmet.js para headers de seguridad
- [ ] Validación del lado del servidor
- [ ] Sanitización de queries SQL/NoSQL
- [ ] Encriptación de datos sensibles
- [ ] Logs de auditoría
- [ ] 2FA (autenticación de dos factores)
- [ ] Captcha en formularios públicos

## 🚨 Vectores de Ataque Comunes y Mitigación

### 1. Cross-Site Scripting (XSS)

**Riesgo:** Inyección de scripts maliciosos

**Mitigación:**
```typescript
// Usar dangerouslySetInnerHTML solo cuando sea absolutamente necesario
// Preferir text content sobre HTML
<div>{userInput}</div> // ✅ Seguro - React escapa automáticamente

// Si necesitas HTML, sanitízalo primero
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 2. Cross-Site Request Forgery (CSRF)

**Riesgo:** Peticiones no autorizadas desde otros sitios

**Mitigación:**
```typescript
// Usar tokens CSRF en el backend
// Verificar origen de las peticiones
// Usar SameSite cookies
```

### 3. SQL/NoSQL Injection

**Riesgo:** Manipulación de queries

**Mitigación:**
```typescript
// Usar queries preparadas o ORMs
// Nunca concatenar inputs del usuario
// Validar y sanitizar en el backend

// ✅ Correcto con ORM
await User.findOne({ email: sanitizedEmail });

// ❌ Incorrecto - vulnerable
db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

### 4. Exposición de Datos Sensibles

**Riesgo:** Filtración de información

**Mitigación:**
```typescript
// No exponer información innecesaria
const getUserPublicData = (user: User) => ({
  id: user.id,
  nombre: user.nombre,
  // NO incluir: email completo, contraseña, tokens, etc.
});

// Usar variables de entorno
const API_KEY = import.meta.env.VITE_API_KEY; // Solo accesible en build time
```

### 5. Dependencias Vulnerables

**Riesgo:** Librerías con vulnerabilidades conocidas

**Mitigación:**
```bash
# Auditar dependencias regularmente
npm audit

# Actualizar automáticamente
npm audit fix

# Revisar CVEs
npm install -g snyk
snyk test
```

## 📋 Checklist de Seguridad

### Pre-deployment

- [ ] Ejecutar `npm audit` y resolver vulnerabilidades
- [ ] Revisar que no haya secretos en el código
- [ ] Configurar variables de entorno en producción
- [ ] Habilitar HTTPS
- [ ] Configurar CSP (Content Security Policy)
- [ ] Implementar rate limiting
- [ ] Revisar permisos de acceso
- [ ] Configurar CORS apropiadamente
- [ ] Habilitar logs de seguridad

### Post-deployment

- [ ] Monitorear logs de errores
- [ ] Configurar alertas de seguridad
- [ ] Realizar pentesting
- [ ] Revisar análisis de vulnerabilidades
- [ ] Actualizar dependencias regularmente

## 🔄 Actualizaciones de Seguridad

Las actualizaciones de seguridad se publicarán en:

- GitHub Security Advisories
- CHANGELOG.md
- Email a usuarios registrados (para vulnerabilidades críticas)

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [React Security Best Practices](https://react.dev/learn/security)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## 📞 Contacto

Para reportes de seguridad o consultas:
- Email: [security@arrendamientoscr.com]
- GitHub Security Advisory: [Crear advisory](https://github.com/usuario/repo/security/advisories/new)

---

**La seguridad es responsabilidad de todos. Reporta cualquier problema de forma responsable.**
