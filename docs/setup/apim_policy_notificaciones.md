<!--
APIM Policy para: GET /notificaciones/{userId}
Descripción: Retorna una lista mock de notificaciones específicas para un usuario,
interceptando el parámetro userId de la URL.
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
                
                string jsonResponse = @"
                [
                  {
                    ""id"": ""notif-001"",
                    ""userId"": ""{USER_ID}"",
                    ""titulo"": ""Contrato aprobado"",
                    ""mensaje"": ""Tu contrato para Sabana Tower ha sido aprobado."",
                    ""tipo"": ""invitacion_aceptada"",
                    ""leida"": false,
                    ""fecha"": ""2026-04-10T14:00:00Z"",
                    ""link"": ""/dashboard""
                  },
                  {
                    ""id"": ""notif-002"",
                    ""userId"": ""{USER_ID}"",
                    ""titulo"": ""Pago Recordatorio"",
                    ""mensaje"": ""Recuerda que debes subir tu próximo comprobante de pago."",
                    ""tipo"": ""contrato_proximo_vencer"",
                    ""leida"": true,
                    ""fecha"": ""2026-04-12T09:00:00Z"",
                    ""link"": ""/dashboard/pagos""
                  }
                ]";
                
                return jsonResponse.Replace("{USER_ID}", id);
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
