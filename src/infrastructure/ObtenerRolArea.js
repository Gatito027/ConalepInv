import { fetchFactory } from "../utils/FetchFactory";

export async function ObtenerRolArea(tipo, _usuarioId){
    const url = import.meta.env.VITE_CONALEP_API + "/data/"+tipo;
    const payload = {_usuarioId:_usuarioId};
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "POST",
            data: payload,
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener las ",tipo, ":", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}