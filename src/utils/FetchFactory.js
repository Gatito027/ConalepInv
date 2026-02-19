export function fetchFactory({
  url,
  data = null,
  contentType = "json",
  method = "POST",
  customId = null
}) {
  const headers = {};

  // Configurar tipo de contenido (excepto FormData)
  if (contentType === "json") {
    headers["Content-Type"] = "application/json";
  } else if (contentType === "text") {
    headers["Content-Type"] = "text/plain";
  }
  // Para FormData (image) no se define Content-Type

  // Agregar ID personalizado si existe
  if (customId) {
    headers["X-Custom-ID"] = customId;
  }

  // Preparar cuerpo (solo si el método lo permite)
  let body = null;
  const methodsWithBody = ["POST", "PUT", "PATCH", "DELETE"]; // ✅ lista ampliada

  if (data && methodsWithBody.includes(method.toUpperCase())) {
    switch (contentType) {
      case "json":
        body = JSON.stringify(data);
        break;
      case "text":
        body = data;
        break;
      case "image":
        body = new FormData();
        for (const key in data) {
          body.append(key, data[key]);
        }
        break;
    }
  }

  return fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  });
}
