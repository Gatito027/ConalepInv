import { useCallback, useEffect, useState } from "react";
import { ObtenerRol } from "../../infrastructure/ObtenerRol";
import toast from "react-hot-toast";
import NotFound from "../../pages/NoFoundPage";

export default function VerRolComponent({ rolId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [rol, setRol] = useState({});
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
        const response = await ObtenerRol(rolId);
        if (!response.isSuccess || !response.data) {
        setError(true);
        return;
      }
      setRol(response.data.rol);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error: No se pudo localizar al usuario");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [rolId]);

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
                  <>{rol.nombre.charAt(0)?.toUpperCase()}</>
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
                <>{rol.nombre}</>
              )}
            </h1>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="h-8 w-100 bg-gray-300 rounded animate-pulse"></div>
                </div>
    ) : (
        <>
      {/* Encabezado principal */}
      <div className="bg-linear-to-r from-emerald-50 to-transparent rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <span className="material-icons text-emerald-600 text-2xl">
              security
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Permisos del Sistema
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestiona los permisos asignados al rol
            </p>
          </div>
          <div className="ml-auto">
            <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full">
              {rol.permisos.length} permisos
            </span>
          </div>
        </div>
      </div>

      {/* Agrupar permisos por grupo */}
      {Object.entries(
        rol.permisos.reduce((grupos, permiso) => {
          const { grupo } = permiso;
          if (!grupos[grupo]) {
            grupos[grupo] = [];
          }
          grupos[grupo].push(permiso);
          return grupos;
        }, {}),
      ).map(([nombreGrupo, permisosGrupo]) => (
        <div key={nombreGrupo} className="mb-8 last:mb-0">
          {/* Título del grupo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
            <h3 className="text-base font-semibold text-gray-700">
              {nombreGrupo}
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 font-medium px-2.5 py-1 rounded-full">
              {permisosGrupo.length}
            </span>
          </div>

          {/* Tarjetas de permisos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permisosGrupo.map((permiso, index) => (
              <div
                key={`${permiso.perid}-${index}`}
                className="group relative bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Barra decorativa superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-emerald-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {/* Nombre del permiso */}
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
                        {permiso.permiso}
                      </h4>

                      {/* Detalles ocultos que se muestran en hover */}
                      <div className="mt-2 overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100">
                        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg">
                          {permiso.detalles}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Mensaje si no hay permisos - diseño mejorado */}
      {rol.permisos.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-icons text-gray-400 text-4xl">
              admin_panel_settings
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay permisos asignados
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Este rol no tiene permisos configurados. Los permisos determinan las
            acciones que puede realizar el usuario.
          </p>
        </div>
      )}
      </>)}
    </div>
  );
}
