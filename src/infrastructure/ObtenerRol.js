import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/roles/ver-rol";

export async function ObtenerRol(rolId) {
    const payload = { _rolId: Number(rolId) };
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
        console.error("Error al buscar el rol:", error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}