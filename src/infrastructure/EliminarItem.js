import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/inv/eliminar-articulo";

export async function EliminarItem({ itemId }) {
  try {
    // ✅ nombre de campo corregido
    const payload = { _ItemId: itemId };
    //console.log(payload);

    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "DELETE",
    });
    
    const result = await response.json();
    //console.log(result);
    return result;
  } catch (error) {
    console.error("Error al eliminar un item:", error.message);
    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
