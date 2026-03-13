import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/data/Obtener-asignaciones";

export async function ObtenerAsignaciones(ItemId) {
    const payload = { _ItemId: Number(ItemId) };
    //console.log(payload);
    try {
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "json",
            method: "POST",
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al buscar el item:", error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}