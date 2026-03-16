import { fetchFactory } from "../utils/FetchFactory";
const url = import.meta.env.VITE_CONALEP_API + "/inv/actualizar-registrar-lugar";

export async function RegistrarCambiarUbicacionItem(itemid, lugar){
    const payload = {
        _ItemId: itemid,
        _lugar: lugar
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