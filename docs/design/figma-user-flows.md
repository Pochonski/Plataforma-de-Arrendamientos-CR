# Guía de User Flows y Prototipos - Sistema de Arrendamientos CR

## User Flows para Implementar en Figma

### Flow 1: Registro e Inicio de Sesión

```
┌─────────────┐
│   Landing   │
│   Page      │
└──────┬──────┘
       │
       ├─ [Ingresar] ──┐
       │               │
       │               ▼
       │        ┌──────────┐
       │        │  Login   │
       │        └────┬─────┘
       │             │
       │             ├─ Credenciales correctas ──┐
       │             │                            │
       │             └─ Error ──► [Toast: Error] │
       │                                          │
       └─ [Registrarse] ──┐                      │
                          │                      │
                          ▼                      │
                   ┌──────────┐                 │
                   │ Registro │                 │
                   └────┬─────┘                 │
                        │                        │
                        ├─ Seleccionar rol ──┐  │
                        │                     │  │
                        ▼                     ▼  ▼
                  ┌──────────┐      ┌──────────────┐
                  │  Modal   │      │  Dashboard   │
                  │ Selector │      │ (según rol)  │
                  │ de Rol   │      └──────────────┘
                  └────┬─────┘
                       │
                       ├─ Dueño ───────┐
                       │                │
                       └─ Inquilino ────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │ Dashboard Dueño  │
                              │       o          │
                              │Dashboard Inquilino│
                              └──────────────────┘
```

**Pantallas necesarias:**
1. Landing Page
2. Login (con estado error)
3. Registro (paso 1)
4. Registro - Modal Selector de Rol
5. Dashboard Dueño (bienvenida)
6. Dashboard Inquilino (bienvenida)

**Interacciones en Figma:**
- Landing → Login: On Click "Ingresar"
- Landing → Registro: On Click "Registrarse"
- Login → Dashboard: On Click "Iniciar Sesión" (con delay 200ms)
- Registro → Modal: On Click "Continuar"
- Modal → Dashboard: On Click "Confirmar" (con Smart Animate)

---

### Flow 2: Dueño - Publicar Propiedad

```
┌──────────────────┐
│ Dashboard Dueño  │
└────────┬─────────┘
         │
         ├─ [Nueva Propiedad] ──┐
         │                      │
         ▼                      ▼
   ┌──────────┐        ┌─────────────────┐
   │Navegación│        │ Formulario      │
   │ Sidebar  │        │Nueva Propiedad  │
   │          │        └────────┬────────┘
   │"Mis Props│                 │
   │edades"   │                 ├─ Llenar datos
   └────┬─────┘                 │
        │                       ├─ Subir imágenes
        ▼                       │
   ┌──────────┐                 ├─ Agregar características
   │  Mis     │                 │
   │Propiedad │                 ▼
   │  es      │        ┌─────────────────┐
   │ (vacío)  │        │ [Publicar]      │
   └──────────┘        └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Toast: Éxito    │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Mis Propiedades │
                       │  (con nueva     │
                       │   propiedad)    │
                       └─────────────────┘
```

**Pantallas necesarias:**
1. Dashboard Dueño
2. Nueva Propiedad (vacío)
3. Nueva Propiedad (parcialmente lleno)
4. Nueva Propiedad (completo)
5. Nueva Propiedad (con validación)
6. Mis Propiedades (vacío con empty state)
7. Mis Propiedades (con 1 propiedad)
8. Toast de confirmación (overlay)

**Interacciones en Figma:**
- Dashboard → Nueva Propiedad: On Click botón "Nueva Propiedad"
- Formulario → Validación: After Delay 100ms (mostrar campos requeridos)
- [Publicar] → Toast: On Click con Dissolve 200ms
- Toast → Mis Propiedades: After Delay 2000ms con Smart Animate

---

### Flow 3: Dueño - Crear y Enviar Invitación

```
┌──────────────────┐
│Dashboard Dueño   │
│                  │
│ Invitaciones: 0  │
└────────┬─────────┘
         │
         ▼
   ┌──────────────────┐
   │  Invitaciones    │
   │   (vacío)        │
   └────────┬─────────┘
            │
            ├─ [Nueva Invitación]
            │
            ▼
   ┌──────────────────────┐
   │ Nueva Invitación     │
   │                      │
   │ 1. Seleccionar       │
   │    Propiedad         │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ 2. Ingresar correo   │
   │    del inquilino     │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ 3. Confirmar monto   │
   │    de alquiler       │
   └────────┬─────────────┘
            │
            ├─ [Crear Invitación]
            │
            ▼
   ┌──────────────────────┐
   │ Modal: Invitación    │
   │       Creada         │
   │                      │
   │ 🔗 https://...       │
   │                      │
   │ [Copiar enlace]      │
   │ [Enviar por correo]  │
   └────────┬─────────────┘
            │
            ├─ [Copiar] ──► Toast: "Enlace copiado"
            │
            ├─ [Enviar] ──► Toast: "Invitación enviada"
            │
            ▼
   ┌──────────────────────┐
   │  Invitaciones        │
   │  (con 1 pendiente)   │
   │                      │
   │  ⏱️ Vence en 47h     │
   └──────────────────────┘
```

**Pantallas necesarias:**
1. Dashboard Dueño (con 0 invitaciones)
2. Invitaciones (empty state)
3. Nueva Invitación (paso 1 - seleccionar propiedad)
4. Nueva Invitación (paso 2 - correo inquilino)
5. Nueva Invitación (paso 3 - confirmar monto)
6. Modal: Invitación Creada (con enlace)
7. Invitaciones (con 1 pendiente)
8. Toast: "Enlace copiado"
9. Toast: "Invitación enviada"

**Interacciones en Figma:**
- Dashboard → Invitaciones: On Click en card "Invitaciones"
- Invitaciones vacías → Nueva: On Click "Nueva Invitación"
- Paso 1 → Paso 2: After Delay (auto-advance) o On Click "Siguiente"
- [Crear] → Modal: On Click con Smart Animate
- [Copiar] → Toast: On Click con Dissolve
- Modal Close → Listado: On Click "X" con slide up

---

### Flow 4: Inquilino - Buscar y Ver Propiedad

```
┌─────────────────┐
│     Landing     │
└────────┬────────┘
         │
         ├─ [Ver Propiedades]
         │
         ▼
┌─────────────────────────┐
│  Catálogo Propiedades   │
│                         │
│  Filtros:               │
│  ┌─────────────────┐   │
│  │ Provincia: Todas│   │
│  │ Tipo: Todos     │   │
│  │ Precio: Todos   │   │
│  └─────────────────┘   │
│                         │
│  [12 propiedades]       │
└───────────┬─────────────┘
            │
            ├─ Aplicar filtros ──┐
            │                     │
            ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐
   │  San José       │   │  Precio máx:    │
   │  ▼              │   │  ₡800,000       │
   └────────┬────────┘   └────────┬────────┘
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  Catálogo Filtrado  │
            │  (4 propiedades)    │
            └──────────┬──────────┘
                       │
                       ├─ Click en propiedad
                       │
                       ▼
            ┌─────────────────────┐
            │ Detalle Propiedad   │
            │                     │
            │ [Galería imágenes]  │
            │                     │
            │ Apartamento Escazú  │
            │ ₡650,000/mes       │
            │                     │
            │ 📍 San Rafael       │
            │ 🛏️ 2 habitaciones   │
            │ 🚿 2 baños          │
            │                     │
            │ Descripción...      │
            │                     │
            │ Características:    │
            │ ✓ Cocina equipada   │
            │ ✓ Balcón            │
            │ ✓ Parqueo           │
            │                     │
            │ [Contactar Dueño]   │
            └─────────────────────┘
```

**Pantallas necesarias:**
1. Landing Page
2. Catálogo (sin filtros, 12 propiedades)
3. Catálogo (filtros activos, 4 propiedades)
4. Catálogo (vista lista)
5. Catálogo (vista grid)
6. Detalle Propiedad (imagen 1)
7. Detalle Propiedad (galería expandida)
8. Detalle Propiedad (scrolled - características)

**Interacciones en Figma:**
- Landing → Catálogo: On Click "Ver Propiedades"
- Filtro → Catálogo actualizado: On Change con Smart Animate
- Card → Detalle: On Click card con Slide Left
- Grid/List toggle: On Click con Dissolve
- Galería: On Click imagen con overlay modal

---

### Flow 5: Inquilino - Subir Comprobante de Pago

```
┌────────────────────┐
│Dashboard Inquilino │
│                    │
│ Pago del mes:      │
│ ⚠️ Pendiente       │
└──────────┬─────────┘
           │
           ├─ [Subir comprobante]
           │
           ▼
┌─────────────────────────┐
│  Subir Comprobante      │
│                         │
│  Propiedad:             │
│  Apartamento en Escazú  │
│                         │
│  Monto: ₡650,000       │
│  Mes: Marzo 2026        │
│                         │
│  Comprobante *          │
│  ┌───────────────────┐ │
│  │   📷              │ │
│  │                   │ │
│  │   Arrastra o      │ │
│  │   haz clic        │ │
│  │                   │ │
│  └───────────────────┘ │
└───────────┬─────────────┘
            │
            ├─ [Subir archivo]
            │
            ▼
┌─────────────────────────┐
│  Subir Comprobante      │
│                         │
│  Comprobante *          │
│  ┌───────────────────┐ │
│  │ ✅ sinpe-300.jpg  │ │
│  │    152 KB         │ │
│  │    [X Remover]    │ │
│  └───────────────────┘ │
│                         │
│  Comentarios            │
│  ┌───────────────────┐ │
│  │ Pago realizado    │ │
│  │ el 01/03/2026     │ │
│  └───────────────────┘ │
│                         │
│  [Cancelar] [Enviar]    │
└───────────┬─────────────┘
            │
            ├─ Validar archivo ──┐
            │                     │
            ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐
   │ Error:          │   │ [Enviar]        │
   │ Archivo muy     │   │                 │
   │ grande (>2MB)   │   │                 │
   └─────────────────┘   └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Loading...      │
                         │ Enviando...     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Toast: Éxito    │
                         │ Comprobante     │
                         │ enviado         │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Dashboard       │
                         │                 │
                         │ Pago del mes:   │
                         │ ⏳ En revisión  │
                         └─────────────────┘
```

**Pantallas necesarias:**
1. Dashboard Inquilino (pago pendiente)
2. Subir Comprobante (vacío)
3. Subir Comprobante (archivo cargado)
4. Subir Comprobante (error validación)
5. Subir Comprobante (loading)
6. Toast: Éxito
7. Dashboard (pago en revisión)

**Interacciones en Figma:**
- Dashboard → Subir: On Click "Subir comprobante"
- Upload área → Archivo: On Click con After Delay 500ms
- Error validación: Conditional (si size > 2MB)
- [Enviar] → Loading: On Click con Smart Animate
- Loading → Toast: After Delay 1500ms
- Toast → Dashboard: After Delay 2000ms

---

### Flow 6: Dueño - Revisar y Aprobar/Rechazar Pago

```
┌────────────────────┐
│Dashboard Dueño     │
│                    │
│ Pagos pendientes:  │
│ 🔴 3 por revisar   │
└──────────┬─────────┘
           │
           ├─ [Ver pagos]
           │
           ▼
┌─────────────────────────┐
│  Pagos Recibidos        │
│                         │
│  ┌───────────────────┐ │
│  │ María González    │ │
│  │ Marzo 2026        │ │
│  │ ₡650,000         │ │
│  │ ⏳ Pendiente      │ │
│  │ [Ver comprobante] │ │
│  └─────────┬─────────┘ │
└────────────┼───────────┘
             │
             ├─ [Ver comprobante]
             │
             ▼
┌──────────────────────────┐
│  Modal: Comprobante      │
│                          │
│  [Imagen del comprobante]│
│   (sinpe-300.jpg)        │
│                          │
│  Comentario:             │
│  "Pago realizado el      │
│   01/03/2026"            │
│                          │
│  [Rechazar] [Aprobar]    │
└────────┬─────────────────┘
         │
         ├─ [Aprobar] ──────┐
         │                  │
         │                  ▼
         │         ┌─────────────────┐
         │         │ Toast: Aprobado │
         │         └────────┬────────┘
         │                  │
         │                  ▼
         │         ┌─────────────────┐
         │         │ Pagos Recibidos │
         │         │ (actualizado)   │
         │         │                 │
         │         │ ✅ Aprobado     │
         │         └─────────────────┘
         │
         └─ [Rechazar] ──┐
                         │
                         ▼
              ┌─────────────────────┐
              │ Modal: Motivo       │
              │ de Rechazo          │
              │                     │
              │ ┌─────────────────┐│
              │ │ Ingresa motivo  ││
              │ │ del rechazo...  ││
              │ └─────────────────┘│
              │                     │
              │ [Cancelar] [Enviar] │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Toast: Rechazado    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Pagos Recibidos     │
              │ (actualizado)       │
              │                     │
              │ ❌ Rechazado        │
              └─────────────────────┘
```

**Pantallas necesarias:**
1. Dashboard Dueño (3 pagos pendientes)
2. Pagos Recibidos (lista con pendientes)
3. Modal: Ver Comprobante
4. Modal: Motivo de Rechazo
5. Toast: Aprobado
6. Toast: Rechazado
7. Pagos Recibidos (con estado aprobado)
8. Pagos Recibidos (con estado rechazado)

**Interacciones en Figma:**
- Dashboard → Pagos: On Click card "Pagos pendientes"
- Lista → Modal comprobante: On Click "Ver comprobante"
- [Aprobar] → Toast: On Click con Dissolve
- [Rechazar] → Modal motivo: On Click con Slide Up
- Modal motivo [Enviar] → Toast: On Click
- Toast → Lista actualizada: After Delay 2000ms

---

### Flow 7: Editar y Eliminar Propiedad

```
┌────────────────────┐
│ Mis Propiedades    │
│                    │
│ ┌────────────────┐│
│ │ Apartamento    ││
│ │ Escazú         ││
│ │                ││
│ │ [✏️] [🗑️]     ││
│ └────────────────┘│
└──────────┬─────────┘
           │
           ├─ [✏️ Editar] ──┐
           │                │
           │                ▼
           │       ┌─────────────────┐
           │       │ Editar Propiedad│
           │       │ (pre-llenado)   │
           │       └────────┬────────┘
           │                │
           │                ├─ Modificar datos
           │                │
           │                ▼
           │       ┌─────────────────┐
           │       │ [Guardar]       │
           │       └────────┬────────┘
           │                │
           │                ▼
           │       ┌─────────────────┐
           │       │ Toast: Guardado │
           │       └────────┬────────┘
           │                │
           │                ▼
           │       ┌─────────────────┐
           │       │ Mis Propiedades │
           │       │ (actualizada)   │
           │       └─────────────────┘
           │
           └─ [🗑️ Eliminar] ──┐
                              │
                              ▼
                     ┌─────────────────┐
                     │ AlertDialog     │
                     │                 │
                     │ ⚠️ ¿Eliminar?  │
                     │                 │
                     │ Esta acción no  │
                     │ se puede        │
                     │ deshacer        │
                     │                 │
                     │[Cancelar][OK]   │
                     └────────┬────────┘
                              │
                              ├─ [Cancelar] ──► Cerrar modal
                              │
                              └─ [OK] ──┐
                                        │
                                        ▼
                              ┌─────────────────┐
                              │ Toast: Eliminado│
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Mis Propiedades │
                              │ (sin propiedad) │
                              └─────────────────┘
```

**Pantallas necesarias:**
1. Mis Propiedades (con propiedad)
2. Editar Propiedad (formulario pre-llenado)
3. Editar Propiedad (modificado)
4. Toast: Guardado
5. AlertDialog: Confirmar eliminación
6. Toast: Eliminado
7. Mis Propiedades (vacío)

**Interacciones en Figma:**
- Lista → Editar: On Click botón editar (icono lápiz)
- [Guardar] → Toast: On Click con Dissolve
- Lista → AlertDialog: On Click botón eliminar (icono basura)
- AlertDialog [Cancelar] → Cerrar: On Click con Dissolve
- AlertDialog [OK] → Toast: On Click con Smart Animate
- Toast → Lista actualizada: After Delay 2000ms

---

## Especificaciones de Animaciones en Figma

### 1. Transiciones entre Páginas

**Slide Left (Avanzar):**
```
Trigger: On Click
Animation: Smart Animate
Easing: Ease Out
Duration: 300ms
Direction: ← (from right)
```

**Slide Right (Retroceder):**
```
Trigger: On Click (botón atrás)
Animation: Smart Animate
Easing: Ease In
Duration: 250ms
Direction: → (to right)
```

**Dissolve (Cambio de contexto):**
```
Trigger: On Click
Animation: Dissolve
Easing: Ease In Out
Duration: 200ms
```

### 2. Modales y Overlays

**Modal Entrada:**
```
Trigger: On Click
Animation: Smart Animate
Initial State: 
  - Opacity: 0%
  - Y position: +20px
  - Scale: 95%
Final State:
  - Opacity: 100%
  - Y position: 0px
  - Scale: 100%
Duration: 250ms
Easing: Ease Out
```

**Modal Salida:**
```
Trigger: On Click (X o fuera del modal)
Animation: Smart Animate
Easing: Ease In
Duration: 200ms
Reverse of entrada
```

**Backdrop:**
```
Background: rgba(0, 0, 0, 0.5)
Blur: 4px
Animation: Fade In/Out
Duration: 200ms
```

### 3. Toasts y Notificaciones

**Toast Entrada:**
```
Initial position: Y: -60px, Opacity: 0%
Animation: Smart Animate
Final position: Y: 16px, Opacity: 100%
Duration: 300ms
Easing: Ease Out Cubic
```

**Toast Salida:**
```
Trigger: After Delay 3000ms
Animation: Smart Animate
Final position: Y: -60px, Opacity: 0%
Duration: 250ms
Easing: Ease In
```

### 4. Loading States

**Spinner Rotation:**
```
Animation: Rotate
Duration: 1000ms
Easing: Linear
Loop: Infinite
Rotation: 360°
```

**Skeleton Loading:**
```
Animation: Pulse
Duration: 1500ms
Easing: Ease In Out
Loop: Infinite
Opacity: 50% ↔ 100%
```

### 5. Hover States (Desktop)

**Button Hover:**
```
Trigger: While Hovering
Animation: Instant (no delay)
Changes:
  - Background: +5% lightness
  - Scale: 102%
  - Shadow: Elevation +1
```

**Card Hover:**
```
Trigger: While Hovering
Animation: Smart Animate
Duration: 150ms
Easing: Ease Out
Changes:
  - Shadow: 0px 4px → 0px 8px
  - Y position: 0px → -2px
```

### 6. Focus States

**Input Focus:**
```
Trigger: On Focus
Animation: Instant
Changes:
  - Border: 1px → 2px
  - Border color: #E4E4E7 → #16A34A
  - Ring: 0px → 2px (primary color)
```

### 7. Accordion/Collapse

**Expand:**
```
Trigger: On Click
Animation: Smart Animate
Duration: 300ms
Easing: Ease Out
Height: Auto → Full content
Icon rotation: 0° → 180°
```

**Collapse:**
```
Trigger: On Click
Animation: Smart Animate
Duration: 250ms
Easing: Ease In
Height: Full content → Auto (collapsed)
Icon rotation: 180° → 0°
```

### 8. Form Validation

**Error State Entrada:**
```
Trigger: On validation fail
Animation: Shake
Duration: 400ms
X position: 0px → -10px → +10px → -5px → +5px → 0px
Border color: #E4E4E7 → #EF4444
```

**Error Message:**
```
Initial: Opacity 0%, Y: -10px
Animation: Smart Animate
Final: Opacity 100%, Y: 0px
Duration: 200ms
Easing: Ease Out
```

### 9. Drag and Drop (Subir archivos)

**Drag Over:**
```
Trigger: While Dragging Over
Background: #F4F4F5 → #E0F2FE
Border: 2px dashed #E4E4E7 → 2px dashed #16A34A
Border style: Dashed (animated)
```

**Drop Success:**
```
Animation: Smart Animate
Duration: 300ms
Background: Flash #16A34A (100ms) → Normal
Show checkmark: Scale 0% → 120% → 100%
```

### 10. Badge/Status Changes

**Status Update:**
```
Trigger: On status change
Animation: Smart Animate
Duration: 200ms
Easing: Ease In Out
Changes:
  - Background color
  - Text color
  - Icon (if applicable)
Scale effect: 100% → 110% → 100%
```

---

## Micro-interacciones Recomendadas

### 1. Botón "Copiar Enlace"
```
Estado inicial: [📋 Copiar enlace]
On Click:
  1. Botón cambia a: [✅ Copiado!]
  2. Color: Primary → Success green
  3. After 2000ms: Vuelve a estado inicial
```

### 2. Like/Favorito en Propiedades
```
Estado inicial: [🤍 Guardar]
On Click:
  1. Icono cambia: 🤍 → ❤️
  2. Animación: Scale 100% → 130% → 100%
  3. Duration: 300ms
  4. Haptic feedback (mobile)
```

### 3. Contador de Notificaciones
```
Cuando llega nueva notificación:
  1. Badge aparece con bounce
  2. Número incrementa con fade
  3. Duración: 400ms
  4. Easing: Ease Out Back (overshoot)
```

### 4. Stepper en Formularios Multi-paso
```
Paso activo:
  - Circle: Filled primary color
  - Number: White text
  - Line: Primary color

Paso completado:
  - Circle: Green with checkmark
  - Line: Green

Paso pendiente:
  - Circle: Gray outline
  - Number: Gray text
  - Line: Gray

Transición:
  Animation: Smart Animate 300ms
  Line progress: Animate width 0% → 100%
```

### 5. Empty State → Content
```
Inicial: Empty state con ilustración
On data load:
  1. Empty state fade out (200ms)
  2. Content items appear one by one
  3. Stagger: 50ms entre items
  4. Animation: Slide up + fade in
  5. Total duration: ~800ms para 5 items
```

---

## Componentes Interactivos Especiales

### 1. Image Gallery/Lightbox

```
Thumbnail Grid → Lightbox:
  Trigger: On Click thumbnail
  Animation: Smart Animate
  Duration: 300ms
  
  Initial (thumbnail):
    - Size: 200×150px
    - Position: In grid
    
  Final (lightbox):
    - Size: 90vw × 90vh (max)
    - Position: Centered
    - Background: rgba(0,0,0,0.9)
    - Close button: Fade in
    - Navigation arrows: Fade in

Navigation:
  Left/Right arrows:
    - Slide transition 250ms
    - Image fade + slide
  
  Keyboard:
    - Arrow keys: Navigate
    - ESC: Close lightbox
```

### 2. Filtros Sidebar

```
Mobile:
  Initial: Hidden (off-screen left)
  Trigger: On Click "Filtros" button
  Animation: Slide In from left
  Duration: 300ms
  Background overlay: Fade in
  
Desktop:
  Always visible
  Toggle collapse: Accordion animation
  
Apply Filters:
  Button state: Disabled → Enabled (cuando hay cambios)
  On Click "Aplicar":
    - Loading spinner (500ms)
    - Results update (Smart Animate)
    - Scroll to top (smooth)
```

### 3. Dashboard Stats Cards

```
On Page Load:
  Cards appear with stagger:
    - Card 1: 0ms
    - Card 2: 100ms
    - Card 3: 200ms
    - Card 4: 300ms
  
  Each card:
    Initial: Y +20px, Opacity 0%
    Animation: Ease Out
    Final: Y 0px, Opacity 100%
    Duration: 400ms

On Data Update:
  Number change:
    - Old number: Fade out up (-10px)
    - New number: Fade in from down (+10px)
    - Duration: 300ms
    - Easing: Ease In Out
```

### 4. Table Row Actions

```
Desktop (Hover):
  Initial: Action buttons opacity 0%
  On Row Hover:
    - Buttons fade in
    - Duration: 150ms
    - Row background: Subtle highlight

Mobile (Always visible):
  - Swipe left to reveal actions
  - Or: Overflow menu (⋮)
  
Delete Action:
  1. Click delete icon
  2. Row highlight red (200ms)
  3. AlertDialog slide up (250ms)
  4. On confirm:
     - Row collapse (height → 0)
     - Duration: 300ms
     - Other rows slide up
```

---

## Checklist de Prototipo en Figma

### Configuración Inicial
- [ ] Establecer frame size para cada breakpoint
- [ ] Crear componentes reutilizables
- [ ] Configurar estilos de color y texto
- [ ] Crear variants para estados (hover, active, disabled)

### Flujos Principales
- [ ] Registro e inicio de sesión (6 pantallas)
- [ ] Publicar propiedad (8 pantallas)
- [ ] Crear invitación (9 pantallas)
- [ ] Buscar propiedad (8 pantallas)
- [ ] Subir comprobante (7 pantallas)
- [ ] Revisar pagos (8 pantallas)
- [ ] Editar/Eliminar propiedad (7 pantallas)

### Interacciones
- [ ] Navegación entre páginas
- [ ] Abrir/cerrar modales
- [ ] Mostrar/ocultar toasts
- [ ] Expand/collapse
- [ ] Tabs switching
- [ ] Form validation visual
- [ ] Loading states
- [ ] Error states

### Animaciones
- [ ] Page transitions (Slide, Dissolve)
- [ ] Modal entrance/exit
- [ ] Toast notifications
- [ ] Button hover states
- [ ] Card hover effects
- [ ] Input focus states
- [ ] Loading spinners
- [ ] Skeleton screens

### Estados
- [ ] Empty states (todas las listas)
- [ ] Loading states (todas las cargas)
- [ ] Error states (formularios, páginas)
- [ ] Success states (confirmaciones)
- [ ] Disabled states (botones, inputs)

### Responsive
- [ ] Mobile prototypes (375px)
- [ ] Tablet prototypes (768px)
- [ ] Desktop prototypes (1440px)
- [ ] Hamburger menu (mobile)
- [ ] Grid adaptations

### Accesibilidad
- [ ] Focus indicators visibles
- [ ] Touch targets mínimo 44px
- [ ] Contraste de color adecuado
- [ ] Text alternatives para iconos
- [ ] Keyboard navigation order

---

## Presentación del Prototipo

### Estructura Recomendada

**1. Portada**
```
┌─────────────────────────────────┐
│                                 │
│  Sistema de Gestión de          │
│  Arrendamientos Costa Rica      │
│                                 │
│  Prototipos Interactivos        │
│  UX/UI Design                   │
│                                 │
│  [Tu Nombre]                    │
│  [Fecha]                        │
│                                 │
└─────────────────────────────────┘
```

**2. Índice de Flujos**
```
1. User Flow: Registro
2. User Flow: Publicar Propiedad (Dueño)
3. User Flow: Crear Invitación (Dueño)
4. User Flow: Buscar Propiedad (Inquilino)
5. User Flow: Subir Comprobante (Inquilino)
6. User Flow: Revisar Pagos (Dueño)
7. Design System
8. Responsive Breakpoints
```

**3. Cada Sección de Flujo**
```
┌─────────────────────────────────┐
│ Flow: [Nombre]                  │
├─────────────────────────────────┤
│                                 │
│ Objetivo:                       │
│ [Descripción del objetivo]      │
│                                 │
│ Pantallas: [Número]             │
│ Interacciones: [Número]         │
│                                 │
│ [Iniciar Prototipo →]          │
│                                 │
└─────────────────────────────────┘
```

**4. Notas de Interacción**
```
Añadir comentarios en Figma para:
  - Hotspots importantes
  - Validaciones especiales
  - Animaciones complejas
  - Condicionales de flujo
```

---

## Exportación y Entrega

### Archivos a Entregar

1. **Figma Link:**
   - Link de visualización pública
   - Permisos: "Anyone with the link can view"

2. **PDF Export:**
   - Wireframes completos
   - Mockups completos
   - Design System
   - User Flows diagram

3. **Video Demo:**
   - Grabación de cada prototipo interactivo
   - Duración: 1-2 min por flujo
   - Formato: MP4, 1080p

4. **Documentación:**
   - Este documento (GUIA_FIGMA_USER_FLOWS.md)
   - DOCUMENTACION_UX_UI.md
   - README con instrucciones

---

## Resumen

Esta guía proporciona:

✅ **7 User Flows completos** con diagramas detallados
✅ **Especificaciones de 10 tipos de animaciones**
✅ **5 micro-interacciones** específicas
✅ **4 componentes interactivos especiales**
✅ **Checklist completo** de prototipado
✅ **Guía de presentación** y exportación

Con esta documentación puedes crear prototipos profesionales e interactivos en Figma que demuestren todas las funcionalidades del sistema de gestión de arrendamientos.
