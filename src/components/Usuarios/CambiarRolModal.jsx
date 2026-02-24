import { useState, useCallback, useEffect } from "react";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";
import { ObtenerRolArea } from "../../infrastructure/ObtenerRolArea";
import toast from "react-hot-toast";
import CambiarAreaRol from "../../infrastructure/CambiarAreaRol";

export default function CambiarRolModal({ usuarioId, setShowModal, reload }) {
  const [isLoading, setIsLoading] = useState(false);
  const [listaRoles, setListaRoles] = useState([]);
  const [rol, setRol] = useState(0);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        _usuarioId: usuarioId,
        _rol: rol,
      };
      const response = await CambiarAreaRol("/cambiar-rol", payload);
      if (response.isSuccess) {
        toast.success("Cambio de rol exitosos");
        reload();
        setShowModal(false);
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido guardar");
    } finally {
      setIsLoading(false);
    }
  };

  const fechData = useCallback(async () => {
    try {
      const RolesData = await ObtenerTipo("roles");
      const UserData = await ObtenerRolArea("obtener-rol-usuario", usuarioId);
      if (!RolesData.isSuccess || !RolesData.data?.length) return;
      if (!UserData.isSuccess) return;
      const mappedRoles = RolesData.data.map((rol) => ({
        id: rol.rolid,
        nombre: rol.nombre,
      }));
      setRol(UserData.data[0].rolid);
      setListaRoles(mappedRoles);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);

  useEffect(() => {
      fechData();
    }, [fechData]);
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
              assignment_ind
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Cambiar rol
            </h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Cambia el rol y sus permisos de este usuario
          </p>
          <form onSubmit={handleSubmit}>
            {/* Rol */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  work
                </span>
                Rol
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  assignment_ind
                </span>
                <select
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 appearance-none cursor-pointer"
                  value={rol}
                  onChange={(e) => {
                    setRol(e.target.value);
                  }}
                  required
                >
                  {listaRoles.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      className="text-gray-700"
                    >
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  arrow_drop_down
                </span>
              </div>
            </fieldset>


            {/* Botones con iconos y mejor distribución */}
            <div className="flex gap-3 justify-end mt-2">
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
