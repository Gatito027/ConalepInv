import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import NuevoAreaModal from "./NuevoAreaModal";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";

export default function RegistroUsuariosComponent() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRepetirPasswordFocused, setIsRepetirPasswordFocused] =
    useState(false);
  const [showRepetirPassword, setShowRepetirPassword] = useState(false);
  const [listaAreas, setListaAreas] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);

  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState("");
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const fechData = useCallback(async () => {
    try {
    const AreasData = await ObtenerTipo("areas");
    const RolesData = await ObtenerTipo("roles");
    if (!AreasData.isSuccess || !AreasData.data?.length) return;
    if (!RolesData.isSuccess || !RolesData.data?.length) return;
      const mappedAreas = AreasData.data.map((area) => ({
        id: area.areaid,
        nombre: area.nombre,
      }));
      const mappedRoles = RolesData.data.map((rol) => ({
        id: rol.rolid,
        nombre: rol.nombre,
      }));
      setListaRoles(mappedRoles);
      setListaAreas(mappedAreas);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);

useEffect(()=>{fechData()}, [fechData]);

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
              person_add
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
              Nuevo Usuario
            </h1>
          </div>
        </div>

        {/* Formulario con diseño de tarjeta */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
          <form className="space-y-6">
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
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
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
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
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
                    required
                  >
                    <option value="" className="text-gray-500">
                      Selecciona un área
                    </option>
                    {listaAreas.map((cat) => ( 
                      <option key={cat.id} value={cat.id} className="text-gray-700"> {cat.nombre} </option> 
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
                  required
                >
                  <option value="" className="text-gray-500">
                    Selecciona un rol
                  </option>
                  {listaRoles.map(
                    (cat) => (
                      <option key={cat.id} value={cat.id} className="text-gray-700">
                        {cat.nombre}
                      </option>
                    ),
                  )}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  arrow_drop_down
                </span>
              </div>
            </fieldset>

            {/* Contraseña */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  lock
                </span>
                Contraseña
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  password
                </span>
                <input
                  type={!showPassword ? "password" : "text"}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={isLoading}
                  value={password}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                />
                {(isPasswordFocused || password.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 
                           transition-colors duration-200"
                  >
                    {showPassword ? (
                      <span className="material-icons text-base sm:text-lg">
                        visibility_off
                      </span>
                    ) : (
                      <span className="material-icons text-base sm:text-lg">
                        visibility
                      </span>
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Mínimo 8 caracteres, incluye mayúsculas y números
              </p>
            </fieldset>

            {/* Repetir contraseña */}
            <fieldset className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  lock_reset
                </span>
                Repite la contraseña
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  lock
                </span>
                <input
                  type={!showRepetirPassword ? "password" : "text"}
                  onFocus={() => setIsRepetirPasswordFocused(true)}
                  onBlur={() => setIsRepetirPasswordFocused(false)}
                  disabled={isLoading}
                  value={repetirPassword}
                  onChange={(e) => {
                    setRepetirPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                />
                {(isRepetirPasswordFocused || repetirPassword.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowRepetirPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 
                           transition-colors duration-200"
                  >
                    {showPassword ? (
                      <span className="material-icons text-base sm:text-lg">
                        visibility_off
                      </span>
                    ) : (
                      <span className="material-icons text-base sm:text-lg">
                        visibility
                      </span>
                    )}
                  </button>
                )}
              </div>
            </fieldset>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 
                         hover:from-emerald-700 hover:to-teal-700 text-white font-semibold 
                         rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 
                         hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                         border border-white/20"
              >
                <span className="material-icons text-xl">save</span>
                Registrar Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
      {showModal && <NuevoAreaModal setShowModal={setShowModal} reload={fechData} />}
    </div>
  );
}
