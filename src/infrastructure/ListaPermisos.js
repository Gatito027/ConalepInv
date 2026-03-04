import { fetchFactory } from "../utils/FetchFactory";

export async function ListaPermisos() {
    const url = import.meta.env.VITE_CONALEP_API + "/data/permisos";
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "GET",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener los permisos:", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}