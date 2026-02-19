import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/obtener-usuario";

export async function ObtenerUsuario(usuarioId) {
    const payload = { _usuarioId: Number(usuarioId) };
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
        console.error("Error al buscar un usuario:", error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}