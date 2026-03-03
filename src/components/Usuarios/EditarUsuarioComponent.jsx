import { useEffect, useCallback, useState } from "react";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";
import { ObtenerRolArea } from "../../infrastructure/ObtenerRolArea";
import toast from "react-hot-toast";
import { ObtenerUsuario } from "../../infrastructure/ObtenerUsuario";
import { EditarUsuario } from "../../infrastructure/EditarUsuario";
import LoadingPageComponent from "../Others/LoadingPageComponent";
import NotFound from "../../pages/NoFoundPage";

export default function EditarUsuarioComponent({ usuarioId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoandingPage, setIsLoadingPage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState(0);
  const [area, setArea] = useState(0);
  const [listaAreas, setListaAreas] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);
  const [errorPage, setErrorPage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await EditarUsuario(usuarioId, rol, area, usuario, nombre);
      if (response.isSuccess) {
        toast.success("Información del Usuario actualizada");
        fetchData();
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

  const fetchData = useCallback(async () => {
    try {
      const AreasData = await ObtenerTipo("areas");
      const UserAreaData = await ObtenerRolArea("obtener-area-usuario", usuarioId);
      const RolesData = await ObtenerTipo("roles");
      const UserData = await ObtenerRolArea("obtener-rol-usuario", usuarioId);
      const response = await ObtenerUsuario(usuarioId);
      
      if (!response.isSuccess || !response.data) {setErrorPage(true); return;};
      if (!AreasData?.isSuccess || !AreasData.data?.length) {setErrorPage(true); return;};
      if (!UserAreaData?.isSuccess) {setErrorPage(true); return;};
      if (!RolesData.isSuccess || !RolesData.data?.length) {setErrorPage(true); return;};
      if (!UserData.isSuccess) {setErrorPage(true); return;};

      const mappedAreas = AreasData.data.map((area) => ({
        id: area.areaid,
        nombre: area.nombre,
      }));
      const mappedRoles = RolesData.data.map((rol) => ({
        id: rol.rolid,
        nombre: rol.nombre,
      }));

      setUsuario(response.data.nombreusuario);
      setNombre(response.data.nombre);
      setArea(UserAreaData.data[0].areacargoid);
      setListaAreas(mappedAreas);
      setRol(UserData.data[0].rolid);
      setListaRoles(mappedRoles);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
      setErrorPage(true);
    } finally {
      setIsLoadingPage(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if(errorPage) return <NotFound />;

  if (isLoandingPage) return <LoadingPageComponent />;
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header con efecto de tarjeta */}
        <div className="relative flex justify-center items-center mb-10 mt-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
          </div>
          <div className="relative flex items-center gap-3">
            <span className="material-icons text-5xl text-emerald-600 drop-shadow-lg">
              edit
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
              Editar a {nombre}
            </h1>
          </div>
        </div>

        {/* Formulario con diseño de tarjeta */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nombre usuario */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  person
                </span>
                Nombre de usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ejemplo: usuario123"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  account_circle
                </span>
              </div>
            </fieldset>

            {/* Nombre completo */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  badge
                </span>
                Nombre completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ejemplo: Miguel Gutierrez Lopez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  badge
                </span>
              </div>
            </fieldset>

            {/* Area a cargo con botón de agregar */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  business
                </span>
                Área a cargo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    apartment
                  </span>
                  <select
                    className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                             focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                             transition-all duration-200 outline-none text-gray-700 appearance-none cursor-pointer"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                  >
                    {listaAreas.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="text-gray-700"
                      >
                        {" "}
                        {cat.nombre}{" "}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    arrow_drop_down
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group"
                >
                  <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                    add
                  </span>
                </button>
              </div>
            </fieldset>

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
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  {listaRoles.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="text-gray-700"
                      >
                        {" "}
                        {cat.nombre}{" "}
                      </option>
                    ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  arrow_drop_down
                </span>
              </div>
            </fieldset>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 
                         hover:from-emerald-700 hover:to-teal-700 text-white font-semibold 
                         rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                         border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                    Registrar Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <NuevoAreaModal setShowModal={setShowModal} reload={fetchData} />
      )}
    </div>
  );
}
