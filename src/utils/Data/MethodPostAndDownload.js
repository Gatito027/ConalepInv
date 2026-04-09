import { fetchFactory } from "../FetchFactory";

export async function MethodPostAndDownload (payload, ruta, fileName){
    const urlPath = import.meta.env.VITE_CONALEP_API + "/" + ruta;

    try {
        const response = await fetchFactory({
            urlPath,
            data: payload,
            contentType: "json",
            method: "POST",
        });

        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            const errorData = await response.json();
            return errorData;
        }

        // Es el Excel — convertir a blob y descargar
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Tomar el nombre del archivo que manda el backend
        const disposition = response.headers.get("Content-Disposition") || "";
        const filename = disposition.match(/filename="(.+?)"/)?.[1] ?? `${fileName}.xlsx`;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return {isSucces: true};
    } catch (error) {
        console.log("Error al descargar",error.message);
        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}