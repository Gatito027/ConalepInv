import { fetchFactory } from "../utils/FetchFactory";

export async function RecuperarPerfil(){
    const url = import.meta.env.VITE_CONALEP_API + "/profile";

    try {
    const response = await fetchFactory({
      url,
      contentType: "json",
      method: "GET",
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error en SubmitLogin:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}