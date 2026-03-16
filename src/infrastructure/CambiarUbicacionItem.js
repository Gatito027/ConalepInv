import { fetchFactory } from "../utils/FetchFactory";
const url = import.meta.env.VITE_CONALEP_API + "/inv/actualizar-lugar";

export async function CambiarUbicacionItem(itemid, lugarid){
    const payload = {
        _ItemId: itemid,
        _lugarId: lugarid
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
        console.log("Error al asignar ubicacion",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}