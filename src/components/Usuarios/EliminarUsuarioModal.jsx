import { useState } from "react";
import { EliminarUsuario } from "../../infrastructure/EliminarUsuario";
import toast from "react-hot-toast";

export default function EliminarUsuarioModal({ setShowModal, deleteId, reload }) {
  const [isLoading, setIsLoading] = useState(false);
  // Función para manejar la eliminación
  const handleDelete = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await EliminarUsuario({ usuarioId: deleteId });

      if (response.isSuccess) {
        toast.success("Usuario eliminado");
        reload(); // refresca la lista
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido eliminar el usuario");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

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
        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
          <div className="flex items-center gap-3">
            <span className="material-icons text-red-600 text-3xl">
              warning
            </span>
            <h2 className="text-2xl font-bold text-gray-900">¿Estás seguro?</h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Esta acción no se puede deshacer. Los cambios serán permanentes.
          </p>

          {/* Botones con iconos y mejor distribución */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowModal(false)}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  <span className="material-icons text-xl">close</span>
                  Cancelar
                </>
              )}
            </button>
            <button
              disabled={isLoading}
              onClick={(e) => handleDelete(e)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  <span className="material-icons text-xl">delete</span>
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
