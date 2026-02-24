import { fetchFactory } from "../utils/FetchFactory";

export default async function CambiarAreaRol(meta, payload){
    const url = import.meta.env.VITE_CONALEP_API + meta;

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
        console.log("Error al conectarse a la API:",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}