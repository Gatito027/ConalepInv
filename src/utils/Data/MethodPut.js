import { fetchFactory } from "../FetchFactory";

export async function MethodPut (payload, ruta){
    const url = import.meta.env.VITE_CONALEP_API + "/" + ruta;

    try {
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "json",
            method: "PUT",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.log("Error al actualizar",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}