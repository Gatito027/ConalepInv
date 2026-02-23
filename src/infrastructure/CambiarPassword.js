import { fetchFactory } from "../utils/FetchFactory";

export async function CambiarPassword(payload){
    const url = import.meta.env.VITE_CONALEP_API + payload.url;
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
        console.log("Error al cambiar contraseña",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}