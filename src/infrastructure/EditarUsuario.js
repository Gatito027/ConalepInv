import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_CONALEP_API + "/editar-usuario";

export async function EditarUsuario(usuarioId, rol, area, usuario, nombre){
    const payload ={
        _usuario: usuario.toLowerCase(),
        _nombre: nombre,
        _area: area,
        _rol: rol,
        _usuarioId: usuarioId
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
        console.log("Error al actualizar a este usuario",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
};