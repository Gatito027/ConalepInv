import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/roles/editar-rol";

export async function EditarRol(rolId, nombre, permisos){
    const payload ={
        _rolId: rolId,
        _nombre: nombre,
        _permisos: permisos
    };
    try {
        //console.log(payload);
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "json",
            method: "PUT",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.log("Error al editar a este rol",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
};