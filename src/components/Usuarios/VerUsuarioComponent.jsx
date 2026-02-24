import { useCallback, useEffect, useState } from "react";
import { ObtenerUsuario } from "../../infrastructure/ObtenerUsuario";
import toast from "react-hot-toast";
import NotFound from "../../pages/NoFoundPage";
import CambiarPasswordModal from "./CambiarPasswordModal";
import CambiarRolModal from "./CambiarRolModal";
import CambiarAreaModal from "./CambiarAreaModal";

export default function VerUsuarioComponent({ usuarioId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      const response = await ObtenerUsuario(usuarioId);
      if (!response.isSuccess || !response.data) {
        setError(true);
        return;
      }
      setUser(response.data);
      //console.log(user);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error: No se pudo localizar al usuario");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if(error){
    return <NotFound />
  }
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-20">
      {/* Header con gradiente */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar con borde y sombra mejorado */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
              <span className="text-3xl font-bold text-white">
                {isLoading ? (
                  <div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                ) : (
                  <>{user.nombre.charAt(0)?.toUpperCase()}</>
                )}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {isLoading ? (
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <>{user.nombre}</>
              )}
            </h1>

            {/* Medallas en grid responsive */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="material-icons text-white text-sm">badge</span>
                {isLoading ? (
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="h-6 w-22 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user.rol}
                  </span>
                )}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="material-icons text-white text-sm">
                  business
                </span>
                {isLoading ? (
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="h-6 w-22 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user.areatrabajo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botón de acción (opcional) 
      <button className="mt-4 sm:mt-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all backdrop-blur-sm flex items-center gap-2">
        <span className="material-icons text-sm">edit</span>
        Editar
      </button>*/}
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="material-icons text-emerald-500">info</span>
          Información adicional
        </h2>

        {/* Usuario */}
        <div className="group flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-xl hover:from-emerald-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-emerald-200">
          <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
            <span className="material-icons text-blue-600 text-2xl">
              account_circle
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Usuario
            </p>
            {isLoading ? (
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : (
              <p className="text-gray-800 font-semibold text-lg">
                {user.nombreusuario}
              </p>
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div className="group flex items-center gap-4 p-4 bg-linear-to-r from-gray-50 to-white rounded-xl hover:from-emerald-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-emerald-200">
          <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
            <span className="material-icons text-green-600 text-2xl">
              calendar_today
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Fecha de alta
            </p>
            {isLoading ? (
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : (
              <p className="text-gray-800 font-semibold text-lg">
                {new Date(user.alta).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer con acciones adicionales */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
        {isLoading ? (
          <p>Cargando información, un momento por favor...</p>
        ) : (
          <>
            <button onClick={() => {setShowModal(true);}} className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
              <span className="material-icons text-sm">lock</span>
              Cambiar contraseña
            </button>
            <button onClick={() => {setShowRolModal(true);}} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
              <span className="material-icons text-sm">badge</span>
              Cambiar rol
            </button>
            <button onClick={() => {setShowAreaModal(true);}} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
              <span className="material-icons text-sm">business</span>
              Cambiar area
            </button>
          </>
        )}
      </div>
      {showModal && (
        <CambiarPasswordModal usuarioId={usuarioId} setShowModal={setShowModal} />
      )}
      {showRolModal && (
        <CambiarRolModal usuarioId={usuarioId} setShowModal={setShowRolModal} reload={fetchData} />
      )}
      {showAreaModal && (
        <CambiarAreaModal usuarioId={usuarioId} setShowModal={setShowAreaModal} reload={fetchData}/>
      )}
    </div>
  );
}
