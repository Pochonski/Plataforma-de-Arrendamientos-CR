<!--
APIM Policy para: GET /conversaciones/{userId}
Descripción: Retorna una lista mock de conversaciones para un usuario,
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
                string otherId = id == "usr-003" ? "usr-002" : "usr-003"; 
                
                string jsonResponse = @"
                [
                  {
                    ""id"": ""conv-001"",
                    ""propertyId"": ""prop-003"",
                    ""participants"": [""{USER_ID}"", ""{OTHER_ID}""],
                    ""type"": ""pago_comprobante"",
                    ""lastMessage"": ""Perfecto, muchas gracias. Quedo atento."",
                    ""lastMessageAt"": ""2026-04-16T18:45:00Z"",
                    ""createdAt"": ""2026-04-15T10:00:00Z"",
                    ""unreadCount"": {
                      ""{USER_ID}"": 0,
                      ""{OTHER_ID}"": 1
                    }
                  }
                ]";
                
                return jsonResponse.Replace("{USER_ID}", id).Replace("{OTHER_ID}", otherId);
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
