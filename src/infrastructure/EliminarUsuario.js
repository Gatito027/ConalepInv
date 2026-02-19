import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/eliminar-usuario";

export async function EliminarUsuario({ usuarioId }) {
  try {
    // ✅ nombre de campo corregido
    const payload = { _usuarioId: usuarioId };

    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "DELETE",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al eliminar un usuario:", error.message);
    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
