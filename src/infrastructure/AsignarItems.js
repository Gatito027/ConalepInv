import { fetchFactory } from "../utils/FetchFactory";
const url = import.meta.env.VITE_CONALEP_API + "/inv/asignar-articulo";

export default async function AsignarItems(itemId, personas){
    const payload= {
        _ItemId: itemId,
        _NewPersonaId: personas
    }
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
        console.log("Error al conectarse a la API:",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}