import { fetchFactory } from "../utils/FetchFactory";

export async function ListaRoles(){
    const url = import.meta.env.VITE_CONALEP_API + "/roles/roles";
    try {
        const response = await fetchFactory({
            url,
            contentType: "json",
            method: "GET",
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error al obtener los roles:", error.message);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}