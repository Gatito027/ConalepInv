import { useState } from "react";
import toast from "react-hot-toast";
import { RegistrarArchivo } from "../../infrastructure/RegistrarArchivo";

export default function ImportarModal({ setShowModal }) {
  const [archivo, setArchivo] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleArchivoExcel = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(
        "Por favor selecciona un archivo Excel válido (.xls o .xlsx).",
      );
      ev.target.value = ""; // limpia el input
      setArchivo(null);
      return;
    }

    setArchivo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("archivo", archivo);

      // Cerrar modal ANTES de que termine — el socket mostrará el progreso
      setShowModal(false);

      await RegistrarArchivo(formData, "inv/importar");
      // El socket en el context se encarga de los toasts
    } catch (error) {
      console.error(error);
      toast.error("Error: No se pudo iniciar la importación");
    } finally {
      setIsLoading(false);
    }
  };
  
  const dowloadExample = async () => {};
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop con efecto mejorado */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />
      {/* Modal con diseño mejorado */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* Cabecera con icono de advertencia */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <span className="material-icons text-emerald-600 text-3xl">
              upload_file
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Importar</h2>
          </div>
        </div>
        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Agrega datos importando un archivo de{" "}
            <span className="font-medium">Excel</span>
          </p>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <fieldset className="space-y-1.5 mt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  upload_file
                </span>
                Documento de datos
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      upload_file
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleArchivoExcel}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="space-y-1.5 mt-2">
              <button
                className="group w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white 
               bg-emerald-600 hover:bg-emerald-700 mt-2
               transition-all duration-300 shadow-md hover:shadow-xl 
               focus:outline-none focus:ring-2 focus:ring-emerald-400 
               disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-icons text-2xl group-hover:scale-110 transition-transform">
                  download
                </span>
                <span className="tracking-wide">Descargar ejemplo</span>
              </button>
            </fieldset>
            {/* Botones con iconos y mejor distribución */}
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="material-icons text-xl">close</span>
                Cerrar
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  <>
                    <span className="material-icons text-xl">save</span>
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
