import { fetchFactory } from "../utils/FetchFactory";
const url = import.meta.env.VITE_CONALEP_API + "/roles/crear-rol";

export async function RegistrarRol(nombre, permisos){
    const payload = {
        _nombre: nombre,
        _permisos: permisos
    }
    //console.log(payload);
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
        console.log("Error al registrar un nuevo rol",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}