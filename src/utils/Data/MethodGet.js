import { fetchFactory } from "../FetchFactory";

export async function MethodGet(path) {
    const url = import.meta.env.VITE_CONALEP_API + "/"+path;
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "GET",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener los datos desde ",path, ":", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}