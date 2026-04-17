<!--
APIM Policy para: GET /pagos/{userId}
Descripción: Retorna una lista mock de pagos filtrada dinámicamente según el userId.
-->
<policies>
    <inbound>
        <base />
        <set-variable name="userId" value="@(context.Request.MatchedParameters["userId"])" />
        <return-response>
            <set-status code="200" reason="OK" />
            <set-header name="Content-Type" exists-action="override">
                <value>application/json</value>
            </set-header>
            <set-body>@{
                string id = (string)context.Variables["userId"];
                
                // Determinamos qué pagos simular basado en el ID del usuario
                if (id == "usr-004" || id == "usr-001") {
                    return @"[
                      {
                        ""id"": ""pago-004"",
                        ""tipo"": ""mensualidad"",
                        ""idContrato"": ""cont-002"",
                        ""idPropiedad"": ""prop-006"",
                        ""idInquilino"": ""usr-004"",
                        ""idDueno"": ""usr-001"",
                        ""mes"": 4,
                        ""año"": 2026,
                        ""monto"": 600000,
                        ""moneda"": ""CRC"",
                        ""estado"": ""rechazado"",
                        ""fechaSubida"": ""2026-04-02T11:45:00Z"",
                        ""fechaRevision"": ""2026-04-03T09:10:00Z"",
                        ""motivoRechazo"": ""Comprobante de transacción ilegible.""
                      }
                    ]";
                }
                
                // Por defecto (ej. usr-003, usr-002)
                return @"[
                  {
                    ""id"": ""pago-001"",
                    ""tipo"": ""deposito"",
                    ""idContrato"": ""cont-001"",
                    ""idPropiedad"": ""prop-003"",
                    ""idInquilino"": ""usr-003"",
                    ""idDueno"": ""usr-002"",
                    ""mes"": 2,
                    ""año"": 2026,
                    ""monto"": 900000,
                    ""moneda"": ""CRC"",
                    ""estado"": ""aprobado"",
                    ""fechaSubida"": ""2026-02-28T10:00:00Z"",
                    ""fechaRevision"": ""2026-03-01T15:30:00Z""
                  },
                  {
                    ""id"": ""pago-002"",
                    ""tipo"": ""mensualidad"",
                    ""idContrato"": ""cont-001"",
                    ""idPropiedad"": ""prop-003"",
                    ""idInquilino"": ""usr-003"",
                    ""idDueno"": ""usr-002"",
                    ""mes"": 3,
                    ""año"": 2026,
                    ""monto"": 450000,
                    ""moneda"": ""CRC"",
                    ""estado"": ""aprobado"",
                    ""fechaSubida"": ""2026-03-10T09:15:00Z"",
                    ""fechaRevision"": ""2026-03-10T14:20:00Z""
                  },
                  {
                    ""id"": ""pago-003"",
                    ""tipo"": ""mensualidad"",
                    ""idContrato"": ""cont-001"",
                    ""idPropiedad"": ""prop-003"",
                    ""idInquilino"": ""usr-003"",
                    ""idDueno"": ""usr-002"",
                    ""mes"": 4,
                    ""año"": 2026,
                    ""monto"": 450000,
                    ""moneda"": ""CRC"",
                    ""estado"": ""pendiente"",
                    ""fechaSubida"": ""2026-04-05T08:00:00Z""
                  }
                ]";
            }</set-body>
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
