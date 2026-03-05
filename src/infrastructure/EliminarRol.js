import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/roles/eliminar-rol";

export async function EliminarRol({ rolId }) {
  try {
    // ✅ nombre de campo corregido
    const payload = { _rolId: rolId };

    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "DELETE",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al eliminar un rol:", error.message);
    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
