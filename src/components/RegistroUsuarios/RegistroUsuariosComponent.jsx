import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import NuevoAreaModal from "./NuevoAreaModal";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";
import { UsuarioShema } from "../../utils/schemas/UsuarioShema";
import { RegistrarUsuario } from "../../infrastructure/RegistrarUsuario";

export default function RegistroUsuariosComponent() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRepetirPasswordFocused, setIsRepetirPasswordFocused] =
    useState(false);
  const [showRepetirPassword, setShowRepetirPassword] = useState(false);
  const [listaAreas, setListaAreas] = useState([]);
  const [listaRoles, setListaRoles] = useState([]);

  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState(0);
  const [rol, setRol] = useState(0);
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    //console.log(usuario.toLowerCase());
    const hasErrors = Object.values(errors).some((arr) => arr.length > 0);

    if (hasErrors) {
      toast.error("Por favor, corrige los errores en el formulario");
      setIsLoading(false);
      return;
    }

    try {
      const response = await RegistrarUsuario({usuario, nombre, area, rol, password});
      if (response.isSuccess) {
        setNombre("");
        setUsuario("");
        setArea(0);
        setRol(0);
        setPassword("");
        setRepetirPassword("");
        toast.success("Registro exitoso");
      } else {
        console.log(response);
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido registrar");
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (field, value) => {
    const formdata = {
      usuario,
      nombre,
      area,
      rol,
      password,
      repetirPassword,
      [field]: value,
    };

    const result = UsuarioShema.safeParse(formdata);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [field]: Array.isArray(fieldErrors[field])
          ? fieldErrors[field]
          : fieldErrors[field]
            ? [fieldErrors[field]]
            : [],
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

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

  useEffect(() => {
    fechData();
  }, [fechData]);

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
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    validateField("usuario", e.target.value);
                  }}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  account_circle
                </span>
              </div>
              {errors.usuario?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.usuario.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
                  onChange={(e) => {
                    setNombre(e.target.value);
                    validateField("nombre", e.target.value);
                  }}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                  required
                />
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  badge
                </span>
              </div>
              {errors.nombre?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.nombre.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
                    onChange={(e) => {
                      setArea(e.target.value);
                      validateField("area", e.target.value);
                    }}
                    required
                  >
                    <option value="" className="text-gray-500">
                      Selecciona un área
                    </option>
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
              {errors.area?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.area.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
                  onChange={(e) => {
                    setRol(e.target.value);
                    validateField("rol", e.target.value);
                  }}
                  required
                >
                  <option value="" className="text-gray-500">
                    Selecciona un rol
                  </option>
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
              {errors.rol?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.rol.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
                    validateField("password", e.target.value);
                  }}
                  disabled={isLoading}
                  value={password}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
                  required
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
              {errors.password?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.password.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
                    validateField("repetirPassword", e.target.value);
                    validateField("password", password);
                  }}
                  placeholder="••••••••"
                  required
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
              {errors.repetirPassword?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.repetirPassword.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
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
        <NuevoAreaModal setShowModal={setShowModal} reload={fechData} />
      )}
    </div>
  );
}
