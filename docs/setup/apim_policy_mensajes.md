<!--
APIM Policy para: GET /mensajes/{userId}
Descripción: Retorna una lista mock de mensajes para un usuario,
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
                string otherId = id == "usr-003" ? "usr-002" : "usr-003"; // Simular el otro participante
                
                string jsonResponse = @"
                [
                  {
                    ""id"": ""msg-001"",
                    ""conversationId"": ""conv-001"",
                    ""senderId"": ""{OTHER_ID}"",
                    ""receiverId"": ""{USER_ID}"",
                    ""content"": ""¡Hola! Quería confirmar que recibí su comprobante."",
                    ""type"": ""text"",
                    ""status"": ""delivered"",
                    ""timestamp"": ""2026-04-16T18:30:00Z""
                  },
                  {
                    ""id"": ""msg-002"",
                    ""conversationId"": ""conv-001"",
                    ""senderId"": ""{USER_ID}"",
                    ""receiverId"": ""{OTHER_ID}"",
                    ""content"": ""Perfecto, muchas gracias. Quedo atento."",
                    ""type"": ""text"",
                    ""status"": ""read"",
                    ""timestamp"": ""2026-04-16T18:45:00Z""
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
