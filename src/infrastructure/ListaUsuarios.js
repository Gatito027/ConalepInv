import { fetchFactory } from "../utils/FetchFactory";

export async function ListaUsuarios() {
    const url = import.meta.env.VITE_CONALEP_API + "/usuarios";
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "GET",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}