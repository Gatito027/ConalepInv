import { fetchFactory } from "../utils/FetchFactory";
const url = import.meta.env.VITE_CONALEP_API + "/registrar-usuario";

export async function RegistrarUsuario({ usuario, nombre, area, rol, password }){
    const payload = {
        _usuario: usuario.toLowerCase(),
        _nombre: nombre,
        _area: area,
        _rol: rol,
        _password: password
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
        console.log("Error al registrar usuario",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}