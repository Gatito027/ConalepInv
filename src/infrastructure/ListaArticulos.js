import { fetchFactory } from "../utils/FetchFactory";

export async function ListaArticulos() {
    const url = import.meta.env.VITE_CONALEP_API + "/inv/articulos";
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "GET",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener los items:", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}