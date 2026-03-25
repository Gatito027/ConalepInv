import { fetchFactory } from "../utils/FetchFactory";

export async function RegistrarArchivo(payload, ruta){
    const url = import.meta.env.VITE_CONALEP_API + "/" + ruta;

    //console.log(payload);

    try {
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "form-data",
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