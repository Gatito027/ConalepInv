import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/resgistrar_area";

export async function CrearArea(area){
    const payload = {
        _area: area
    };
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
        console.log("Error al crear un area",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
};