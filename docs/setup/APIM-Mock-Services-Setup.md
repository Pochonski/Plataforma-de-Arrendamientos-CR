# Configuración de Mock Services en Azure API Management

Este documento describe cómo configurar mock services en Azure API Management para la Fase I del proyecto.

## Estructura de la API

```
API: API de Prueba
└── Stagging
    ├── GET /propiedades
    ├── GET /propiedades/{id}
    ├── POST /propiedades
    ├── PUT /propiedades/{id}
    ├── DELETE /propiedades/{id}
    ├── GET /usuarios
    ├── GET /usuarios/{id}
    ├── POST /usuarios
    ├── PUT /usuarios/{id}
    ├── DELETE /usuarios/{id}
    ├── GET /contratos
    ├── GET /contratos/{id}
    ├── POST /contratos
    ├── PUT /contratos/{id}
    ├── DELETE /contratos/{id}
    ├── GET /invitaciones
    ├── GET /invitaciones/{id}
    ├── POST /invitaciones
    ├── PUT /invitaciones/{id}
    ├── DELETE /invitaciones/{id}
```

---

## MOCK RESPONSES COMPLETOS

### 1. PROPIEDADES

#### GET /propiedades (Lista)

**Response 200:**

```json
[
  {
    "id": "prop-001",
    "titulo": "Apartamento en San José Centro",
    "descripcion": "Apartamento amueblado de 2 habitaciones, cocina integral, parqueo incluido",
    "precio": 350000,
    "provincia": "San José",
    "canton": "Central",
    "distrito": "Carmen",
    "estado": "disponible",
    "idDueno": "usr-001",
    "imagenes": [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg"
    ],
    "amenidades": ["Parqueo", "Seguridad 24h", "Elevador"],
    "habitaciones": 2,
    "banos": 1,
    "area": 75,
    "fechaCreacion": "2026-03-01T00:00:00Z"
  },
  {
    "id": "prop-002",
    "titulo": "Casa en Escazú con jardín",
    "descripcion": "Casa amplia de 3 habitaciones, jardín privado, zona tranquila",
    "precio": 850000,
    "provincia": "San José",
    "canton": "Escazú",
    "distrito": "Escazú",
    "estado": "disponible",
    "idDueno": "usr-001",
    "imagenes": ["https://example.com/img3.jpg"],
    "amenidades": ["Jardín", "Piscina", "Gimnasio"],
    "habitaciones": 3,
    "banos": 2,
    "area": 150,
    "fechaCreacion": "2026-03-05T00:00:00Z"
  },
  {
    "id": "prop-003",
    "titulo": "Oficina en Hatillo",
    "descripcion": "Oficina comercial en segundo piso, buena ubicación",
    "precio": 450000,
    "provincia": "San José",
    "canton": "Desamparados",
    "distrito": "Hatillo",
    "estado": "alquilado",
    "idDueno": "usr-002",
    "imagenes": [],
    "amenidades": ["Aire acondicionado", "Internet"],
    "habitaciones": 0,
    "banos": 1,
    "area": 45,
    "fechaCreacion": "2026-02-15T00:00:00Z"
  }
]
```

#### GET /propiedades/{id}

**Response 200:**

```json
{
  "id": "prop-001",
  "titulo": "Apartamento en San José Centro",
  "descripcion": "Apartamento amueblado de 2 habitaciones, cocina integral, parqueo incluido",
  "precio": 350000,
  "provincia": "San José",
  "canton": "Central",
  "distrito": "Carmen",
  "estado": "disponible",
  "idDueno": "usr-001",
  "imagenes": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "amenidades": ["Parqueo", "Seguridad 24h", "Elevador"],
  "habitaciones": 2,
  "banos": 1,
  "area": 75,
  "fechaCreacion": "2026-03-01T00:00:00Z"
}
```

**Response 404:**

```json
{
  "error": "Propiedad no encontrada",
  "codigo": "PROPERTY_NOT_FOUND"
}
```

#### POST /propiedades

**Request Body:**

```json
{
  "titulo": "Nuevo Apartamento",
  "descripcion": "Descripción de la propiedad",
  "precio": 400000,
  "provincia": "San José",
  "canton": "Montes de Oca",
  "distrito": "San Pedro",
  "idDueno": "usr-001",
  "amenidades": ["Parqueo"],
  "habitaciones": 1,
  "banos": 1,
  "area": 50
}
```

**Response 201:**

```json
{
  "id": "prop-004",
  "titulo": "Nuevo Apartamento",
  "descripcion": "Descripción de la propiedad",
  "precio": 400000,
  "provincia": "San José",
  "canton": "Montes de Oca",
  "distrito": "San Pedro",
  "estado": "disponible",
  "idDueno": "usr-001",
  "imagenes": [],
  "amenidades": ["Parqueo"],
  "habitaciones": 1,
  "banos": 1,
  "area": 50,
  "fechaCreacion": "2026-04-15T00:00:00Z"
}
```

#### PUT /propiedades/{id}

**Request Body:**

```json
{
  "titulo": "Apartamento Actualizado",
  "descripcion": "Nueva descripción",
  "precio": 380000,
  "estado": "alquilado"
}
```

**Response 200:**

```json
{
  "id": "prop-001",
  "titulo": "Apartamento Actualizado",
  "descripcion": "Nueva descripción",
  "precio": 380000,
  "provincia": "San José",
  "canton": "Central",
  "distrito": "Carmen",
  "estado": "alquilado",
  "idDueno": "usr-001",
  "imagenes": ["https://example.com/img1.jpg"],
  "amenidades": ["Parqueo", "Seguridad 24h"],
  "habitaciones": 2,
  "banos": 1,
  "area": 75,
  "fechaCreacion": "2026-03-01T00:00:00Z"
}
```

#### DELETE /propiedades/{id}

**Response 204:** (Empty body - No Content)

---

### 2. USUARIOS

#### GET /usuarios (Lista)

**Response 200:**

```json
[
  {
    "id": "usr-001",
    "nombre": "Carlos Ramírez",
    "correo": "carlos.ramirez@email.com",
    "telefono": "8888-1234",
    "rol": "dueno",
    "fechaRegistro": "2026-01-15T00:00:00Z",
    "propiedades": ["prop-001", "prop-002"]
  },
  {
    "id": "usr-002",
    "nombre": "María González",
    "correo": "maria.gonzalez@email.com",
    "telefono": "8765-4321",
    "rol": "dueno",
    "fechaRegistro": "2026-02-01T00:00:00Z",
    "propiedades": ["prop-003"]
  },
  {
    "id": "usr-003",
    "nombre": "Juan Pérez",
    "correo": "juan.perez@email.com",
    "telefono": "8555-9999",
    "rol": "inquilino",
    "fechaRegistro": "2026-03-10T00:00:00Z",
    "propiedades": []
  },
  {
    "id": "usr-004",
    "nombre": "Ana López",
    "correo": "ana.lopez@email.com",
    "telefono": "8444-1111",
    "rol": "inquilino",
    "fechaRegistro": "2026-03-15T00:00:00Z",
    "propiedades": []
  }
]
```

#### GET /usuarios/{id}

**Response 200:**

```json
{
  "id": "usr-001",
  "nombre": "Carlos Ramírez",
  "correo": "carlos.ramirez@email.com",
  "telefono": "8888-1234",
  "rol": "dueno",
  "fechaRegistro": "2026-01-15T00:00:00Z",
  "propiedades": ["prop-001", "prop-002"]
}
```

**Response 404:**

```json
{
  "error": "Usuario no encontrado",
  "codigo": "USER_NOT_FOUND"
}
```

#### POST /usuarios

**Request Body:**

```json
{
  "nombre": "Roberto Sánchez",
  "correo": "roberto.sanchez@email.com",
  "telefono": "8333-2222",
  "rol": "dueno"
}
```

**Response 201:**

```json
{
  "id": "usr-005",
  "nombre": "Roberto Sánchez",
  "correo": "roberto.sanchez@email.com",
  "telefono": "8333-2222",
  "rol": "dueno",
  "fechaRegistro": "2026-04-15T00:00:00Z",
  "propiedades": []
}
```

#### PUT /usuarios/{id}

**Request Body:**

```json
{
  "nombre": "Roberto Sánchez Updated",
  "telefono": "8333-3333"
}
```

**Response 200:**

```json
{
  "id": "usr-005",
  "nombre": "Roberto Sánchez Updated",
  "correo": "roberto.sanchez@email.com",
  "telefono": "8333-3333",
  "rol": "dueno",
  "fechaRegistro": "2026-04-15T00:00:00Z",
  "propiedades": []
}
```

#### DELETE /usuarios/{id}

**Response 204:** (Empty body - No Content)

---

### 3. CONTRATOS

#### GET /contratos (Lista)

**Response 200:**

```json
[
  {
    "id": "cont-001",
    "idPropiedad": "prop-003",
    "idInquilino": "usr-003",
    "idDueno": "usr-002",
    "fechaInicio": "2026-03-01",
    "fechaFin": "2027-03-01",
    "montoMensual": 450000,
    "estado": "activo",
    "deposito": 900000,
    "terminos": "Contrato anual con renovación automática",
    "fechaCreacion": "2026-02-28T00:00:00Z"
  },
  {
    "id": "cont-002",
    "idPropiedad": "prop-001",
    "idInquilino": "usr-004",
    "idDueno": "usr-001",
    "fechaInicio": "2026-04-01",
    "fechaFin": "2027-04-01",
    "montoMensual": 350000,
    "estado": "activo",
    "deposito": 700000,
    "terminos": "Depósito de 2 meses",
    "fechaCreacion": "2026-03-25T00:00:00Z"
  }
]
```

#### GET /contratos/{id}

**Response 200:**

```json
{
  "id": "cont-001",
  "idPropiedad": "prop-003",
  "idInquilino": "usr-003",
  "idDueno": "usr-002",
  "fechaInicio": "2026-03-01",
  "fechaFin": "2027-03-01",
  "montoMensual": 450000,
  "estado": "activo",
  "deposito": 900000,
  "terminos": "Contrato anual con renovación automática",
  "fechaCreacion": "2026-02-28T00:00:00Z"
}
```

**Response 404:**

```json
{
  "error": "Contrato no encontrado",
  "codigo": "CONTRACT_NOT_FOUND"
}
```

#### POST /contratos

**Request Body:**

```json
{
  "idPropiedad": "prop-002",
  "idInquilino": "usr-003",
  "fechaInicio": "2026-05-01",
  "fechaFin": "2027-05-01",
  "montoMensual": 850000,
  "deposito": 1700000,
  "terminos": "Contrato de 1 año"
}
```

**Response 201:**

```json
{
  "id": "cont-003",
  "idPropiedad": "prop-002",
  "idInquilino": "usr-003",
  "idDueno": "usr-001",
  "fechaInicio": "2026-05-01",
  "fechaFin": "2027-05-01",
  "montoMensual": 850000,
  "estado": "pendiente",
  "deposito": 1700000,
  "terminos": "Contrato de 1 año",
  "fechaCreacion": "2026-04-15T00:00:00Z"
}
```

#### PUT /contratos/{id}

**Request Body:**

```json
{
  "estado": "activo",
  "montoMensual": 800000
}
```

**Response 200:**

```json
{
  "id": "cont-003",
  "idPropiedad": "prop-002",
  "idInquilino": "usr-003",
  "idDueno": "usr-001",
  "fechaInicio": "2026-05-01",
  "fechaFin": "2027-05-01",
  "montoMensual": 800000,
  "estado": "activo",
  "deposito": 1700000,
  "terminos": "Contrato de 1 año",
  "fechaCreacion": "2026-04-15T00:00:00Z"
}
```

#### DELETE /contratos/{id}

**Response 204:** (Empty body - No Content)

---

### 4. INVITACIONES

#### GET /invitaciones (Lista)

**Response 200:**

```json
[
  {
    "id": "inv-001",
    "idPropiedad": "prop-001",
    "correoInvitado": "maria.gonzalez@email.com",
    "token": "abc123xyz789",
    "estado": "pendiente",
    "fechaEnvio": "2026-04-10T14:30:00Z",
    "mensaje": "Te invito a ver esta propiedad"
  },
  {
    "id": "inv-002",
    "idPropiedad": "prop-002",
    "correoInvitado": "juan.perez@email.com",
    "token": "def456uvw456",
    "estado": "aceptada",
    "fechaEnvio": "2026-04-08T10:00:00Z",
    "fechaAceptacion": "2026-04-08T15:00:00Z",
    "mensaje": "Ven a conocer esta casa en Escazú"
  },
  {
    "id": "inv-003",
    "idPropiedad": "prop-001",
    "correoInvitado": "ana.lopez@email.com",
    "token": "ghi789rst012",
    "estado": "rechazada",
    "fechaEnvio": "2026-04-05T09:00:00Z",
    "fechaRechazo": "2026-04-05T12:00:00Z",
    "mensaje": "¿Quieres alquilar este apartamento?"
  }
]
```

#### GET /invitaciones/{id}

**Response 200:**

```json
{
  "id": "inv-001",
  "idPropiedad": "prop-001",
  "correoInvitado": "maria.gonzalez@email.com",
  "token": "abc123xyz789",
  "estado": "pendiente",
  "fechaEnvio": "2026-04-10T14:30:00Z",
  "mensaje": "Te invito a ver esta propiedad"
}
```

**Response 404:**

```json
{
  "error": "Invitación no encontrada",
  "codigo": "INVITATION_NOT_FOUND"
}
```

#### POST /invitaciones

**Request Body:**

```json
{
  "idPropiedad": "prop-002",
  "correoInvitado": "nuevo.inquilino@email.com",
  "mensaje": "Te invito a ver esta hermosa casa"
}
```

**Response 201:**

```json
{
  "id": "inv-004",
  "idPropiedad": "prop-002",
  "correoInvitado": "nuevo.inquilino@email.com",
  "token": "newToken123ABC",
  "estado": "pendiente",
  "fechaEnvio": "2026-04-15T16:00:00Z",
  "mensaje": "Te invito a ver esta hermosa casa"
}
```

#### PUT /invitaciones/{id}

**Request Body:**

```json
{
  "estado": "aceptada"
}
```

**Response 200:**

```json
{
  "id": "inv-004",
  "idPropiedad": "prop-002",
  "correoInvitado": "nuevo.inquilino@email.com",
  "token": "newToken123ABC",
  "estado": "aceptada",
  "fechaEnvio": "2026-04-15T16:00:00Z",
  "fechaAceptacion": "2026-04-15T18:00:00Z",
  "mensaje": "Te invito a ver esta hermosa casa"
}
```

#### DELETE /invitaciones/{id}

**Response 204:** (Empty body - No Content)

---

## CÓDIGOS DE ESTADO HTTP

| Código | Descripción           | Uso                         |
| ------ | --------------------- | --------------------------- |
| 200    | OK                    | GET exitoso, PUT exitoso    |
| 201    | Created               | POST exitoso                |
| 204    | No Content            | DELETE exitoso              |
| 400    | Bad Request           | Datos inválidos en POST/PUT |
| 404    | Not Found             | Recurso no existe           |
| 500    | Internal Server Error | Error del servidor          |

---

## ERRORES GENÉRICOS

**400 Bad Request:**

```json
{
  "error": "Datos inválidos",
  "detalles": {
    "correo": "Formato de correo inválido",
    "precio": "El precio debe ser mayor a 0"
  }
}
```

**500 Internal Server Error:**

```json
{
  "error": "Error interno del servidor",
  "codigo": "INTERNAL_ERROR",
  "timestamp": "2026-04-15T16:00:00Z"
}
```

---

## Notas de Configuración

1. **CORS:** Configurar en Azure Portal para permitir el origen de Static Web Apps
2. **Paginación:** Para listas grandes, usar query params `?page=1&limit=10`
3. **Filtros:** Soportar `?estado=disponible` para filtrar por estado
