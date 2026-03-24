import { fetchFactory } from "../utils/FetchFactory";

export async function RegistrarTipo(payload, ruta){
    const url = import.meta.env.VITE_CONALEP_API + "/" + ruta;

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
        console.log("Error al registrar",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}