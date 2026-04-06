# Guía: Cómo crear MOCK APIs en Azure API Management (APIM)

Para cumplir con el requerimiento **"g"** de la rúbrica (*Implementar Mock services en Azure API Management para todas las rutas del proyecto y NO mantener datos locales*), te detallo los pasos para configurar tu API en Azure de forma rápida y sencilla.

## 1. Crear el servicio de Azure API Management
*Si tú o tu equipo ya tienen el recurso de APIM creado en Azure, puedes saltar al paso 2.*

1. Inicia sesión en tu cuenta de estudiante de [Portal de Azure](https://portal.azure.com/).
2. Arriba en la barra de búsqueda, escribe **API Management Services**.
3. Haz clic en **Crear**.
4. Llena los detalles de la suscripción (usualmente "Azure for Students"), elige un Grupo de Recursos, Nombre del Recurso, Región y Nombre del Administrador.
5. Elige la capa (Pricing tier) **Consumption (Consumo) o Developer**. La capa Consumption es ideal porque se crea casi al instante y es la más barata/gratuita.
6. Dale a Review + Create. Espera unos minutos y ve a tu recurso.

## 2. Crear una APIM en Blanco (Blank API) dentro de Azure
1. En el menú de la izquierda de tu servicio de API Management recién creado, baja hasta la sección de **APIs** y elige la opción que dice **APIs**.
2. Dale al bloque de **"HTTP - Add a blank API"**.
3. Pon la información de tu API:
   - **Display name:** PlataformaArrendamientos API
   - **Name:** plataforma-arrendamientos-api
   - **API URL suffix:** `api`
4. Dale a **Create**.

## 3. Configurar tu Endpoint Mock de "Propiedades" (Método `GET` y Políticas Inbound)
Acá simularemos que el servidor nos devuelve la lista de propiedades de la página web (la misma que teníamos en código duro).

1. Selecciona la API que acabas de crear (`PlataformaArrendamientos API`).
2. Haz clic en **+ Add operation** en la columna central.
3. Lo configuras de la siguiente forma:
   - **Display Name:** `Get Properties`
   - **URL:** `GET` / `propiedades`
4. Dale a **Save**.
5. Ahora en la ventana, selecciona la operación `Get Properties` que creaste. 
6. Abajo verás algunas cajitas: "Frontend", "Inbound processing", "Backend", "Outbound processing". **Haz clic en la pestaña inferior que dice "(</>) Code editor" sobre Inbound processing.** o el ícono de las políticas *(ver imagen abajo, ícono de `< />`)*.
7. Pega este código reemplazando todo lo que tengas adentro ahí, el `<set-body>` devolverá el listado por defecto:

```xml
<policies>
    <inbound>
        <base />
        <mock-response status-code="200" content-type="application/json" />
        <return-response>
            <set-status code="200" reason="OK" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>[
                {
                    "id": "1",
                    "titulo": "Apartamento moderno en Escazú",
                    "descripcion": "Hermoso apartamento de 2 habitaciones con vista panorámica, cerca de centros comerciales.",
                    "precio": 650000,
                    "moneda": "CRC",
                    "provincia": "San José",
                    "canton": "Escazú",
                    "distrito": "San Rafael",
                    "tipo": "apartamento",
                    "estado": "disponible",
                    "imagenes": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
                    "duenoId": "1",
                    "caracteristicas": ["2 habitaciones", "2 baños", "Cocina equipada", "Balcón", "Parqueo", "Seguridad 24/7"]
                },
                {
                    "id": "2",
                    "titulo": "Casa amplia en Heredia",
                    "descripcion": "Casa espaciosa de 3 habitaciones, jardín.",
                    "precio": 850000,
                    "moneda": "CRC",
                    "provincia": "Heredia",
                    "canton": "Heredia",
                    "distrito": "Mercedes",
                    "tipo": "casa",
                    "estado": "disponible",
                    "imagenes": ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
                    "duenoId": "1",
                    "caracteristicas": ["3 habitaciones", "2.5 baños", "Jardín", "Garaje doble"]
                }
            ]</set-body>
        </return-response>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```
8. **Dale a Guardar.**
   - ¡Vualá! Esta política intercepta la llamada, no intenta ir a buscar servidores falsos, y directamente le devuelve la lista en JSON lista a la plataforma web.


## 4. Configurar otras operaciones necesarias (Endpoints)

Tendrás que hacer este mismo paso de arriba (Operación -> Editar Inbound Processing XML) para el resto de rutas. 
Lo recomendado es que emules cómo creas cosas simulando un **Status 200**.

Por ejemplo, un **POST de Nueva Propiedad**:
- **Display name**: `Create Property`
- **URL**: `POST` / `propiedades`
- **XML en Inbound:**
```xml
<policies>
    <inbound>
        <base />
        <mock-response status-code="201" content-type="application/json" />
        <return-response>
            <set-status code="201" reason="Created" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>{ 
                "success": true, 
                "message": "Propiedad Creada Satisfactoriamente con API Mock"
            }</set-body>
        </return-response>
    </inbound>
</policies>
```

Y luego deberás crear estas operaciones adicionales repitiendo el proceso (crear operación -> ir a `</>` Inbound Processing -> pegar el XML):

### A. Listar Usuarios (`GET /usuarios`)
- **Display name**: `Get Usuarios`
- **URL**: `GET` / `usuarios`
- **XML en Inbound:**
```xml
<policies>
    <inbound>
        <base />
        <mock-response status-code="200" content-type="application/json" />
        <return-response>
            <set-status code="200" reason="OK" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>[
                {
                    "id": "1",
                    "nombre": "Juan Pérez",
                    "correo": "juan.perez@email.com",
                    "rol": "arrendador"
                },
                {
                    "id": "2",
                    "nombre": "Ana Miranda",
                    "correo": "ana.miranda@email.com",
                    "rol": "arrendatario"
                }
            ]</set-body>
        </return-response>
    </inbound>
</policies>
```

### B. Listar Contratos (`GET /contratos`)
- **Display name**: `Get Contratos`
- **URL**: `GET` / `contratos`
- **XML en Inbound:**
```xml
<policies>
    <inbound>
        <base />
        <mock-response status-code="200" content-type="application/json" />
        <return-response>
            <set-status code="200" reason="OK" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>[
                {
                    "id": "1",
                    "propiedadId": "1",
                    "arrendatarioId": "2",
                    "arrendadorId": "1",
                    "estado": "activo",
                    "monto": 650000
                }
            ]</set-body>
        </return-response>
    </inbound>
</policies>
```

### C. Crear Pago (`POST /pagos`)
- **Display name**: `Create Pago`
- **URL**: `POST` / `pagos`
- **XML en Inbound:**
```xml
<policies>
    <inbound>
        <base />
        <mock-response status-code="201" content-type="application/json" />
        <return-response>
            <set-status code="201" reason="Created" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>{ 
                "success": true, 
                "message": "Pago registrado con éxito en API Mock"
            }</set-body>
        </return-response>
    </inbound>
</policies>
```

## 5. El Gran Problema de la Web: Habilitar los "CORS"

Para que nuestra plataforma en el navegador pueda conectarse a Azure libremente, debes aplicar la regla **CORS** (Dejar pasar tráfico que viene desde Github Pages o de Localhost) sobre **TODA** la API.

1. Ve a la vista principal de la API (`PlataformaArrendamientos API`), haciendo click al botón en azul de arriba en la pestaña de operaciones (`All operations`).
2. Nuevamente haz click en el (`</>`) Code editor en **Inbound processing**.
3. Añade la etiqueta `<cors>` dentro de `<inbound>`:

```xml
<policies>
    <inbound>
        <cors allow-credentials="false">
            <!-- Permite pedir datos desde la web -->
            <allowed-origins>
                <origin>*</origin> 
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
                <method>POST</method>
                <method>PUT</method>
                <method>DELETE</method>
                <method>OPTIONS</method>
            </allowed-methods>
            <allowed-headers>
                <header>*</header>
            </allowed-headers>
        </cors>
        <base />
    </inbound>
    <!-- MANTEN EL RESTO IGUAL... -->
</policies>
```

--- 

## 6. Pruebas Finales con Postman

Para cumplir con la rúbrica (Fase I: Herramientas y servicios -> Postman), necesitamos comprobar que Azure haya levantado estas rutas exitosamente ANTES de tocar el código.

1. Dentro de Azure, haz clic en la pestaña superior llamada **Test** (se encuentra justo al lado derecho de "Design", cerca de arriba al centro de tu pantalla).
2. En la columna izquierda, escoge la operación que quieras probar (por ejemplo, **`Get Properties`**).
3. Abajo en Azure verás un botón azul que dice **Send**. Al pulsarlo, en la parte de abajo de la pantalla se generará el HTTP response con el código `200 OK`.
4. Ahí mismo en Azure, busca la propiedad llamada **Request URL**. **Copia ese enlace completo** (Ej. `https://plataforma-arrendamientos-api.azure-api.net/propiedades`).
5. Abre la aplicación **Postman** en tu PC, crea un nuevo llamado pulsando en **New Request** (o en el botón de `+`).
6. Asegúrate de que el método a la izquierda del buscador sea el correcto (**`GET`** para pedir datos, **`POST`** para crear).
7. **Pega la URL** que copiaste de Azure en la barra superior.
8. Dale al botón azul **Send** en Postman.
9. En la sección inferior de Postman te aparecerá el código `200 OK` y el JSON con tus datos. **Esto le asegura a tu profesor que configuraste bien el servicio, cumpliendo con la herramienta solicitada.**

### ¿Qué sigue para terminar TODO?
Una vez que esto en Postman te esté funcionando exitosamente, **pásame esa misma URL (la del `Request URL`) por el chat**. Yo inmediatamente me encargaré de tomar tu código en React y reemplazar la base de datos "LocalStorage" usando esa URL con `fetch()`, finalizando así el ciclo completo.
