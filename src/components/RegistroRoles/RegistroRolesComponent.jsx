import { useEffect, useState } from "react";
import { ListaPermisos } from "../../infrastructure/ListaPermisos";
import toast from "react-hot-toast";
import { RegistrarRol } from "../../infrastructure/RegistrarRol";
import { RolShema } from "../../utils/schemas/RolSchema";

export default function RegistroRolesComponent() {
  const [permisos, setPermisos] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [nombreRol, setNombreRol] = useState("");
  const [gruposExpandidos, setGruposExpandidos] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const hasErrors = Object.values(errors).some((arr) => arr.length > 0);

    if (hasErrors) {
      toast.error("Por favor, corrige los errores en el formulario");
      setIsLoading(false);
      return;
    }
    try {
      const response = await RegistrarRol(nombreRol, selectedPermisos);
      if (response.isSuccess) {
        setNombreRol("");
        setSelectedPermisos([]);
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
    /*const payload ={
      _nombre: nombreRol,
      _permisos: selectedPermisos
    }*/
  };

  const validateField = (field, value) => {
    const formdata = {
      nombreRol,
      [field]: value,
    };

    const result = RolShema.safeParse(formdata);
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

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await ListaPermisos();
        if (response.isSuccess && response.data?.length) {
          setPermisos(response.data);

          // Inicializar todos los grupos como expandidos por defecto
          const gruposIniciales = {};
          response.data.forEach((permiso) => {
            gruposIniciales[permiso.grupo] = true;
          });
          setGruposExpandidos(gruposIniciales);
        }
      } catch (error) {
        console.error("Error al cargar permisos:", error);
      }
    };
    fetchPermisos();
  }, []);

  // Agrupar permisos por grupo
  const permisosPorGrupo = permisos.reduce((acc, permiso) => {
    if (!acc[permiso.grupo]) acc[permiso.grupo] = [];
    acc[permiso.grupo].push(permiso);
    return acc;
  }, {});

  const handleCheckboxChange = (permisoId) => {
    setSelectedPermisos((prev) =>
      prev.includes(permisoId)
        ? prev.filter((id) => id !== permisoId)
        : [...prev, permisoId],
    );
  };

  const handleSelectAll = (grupo) => {
    const grupoPermisos = permisosPorGrupo[grupo].map((p) => p.permisoid);
    const todosSeleccionados = grupoPermisos.every((id) =>
      selectedPermisos.includes(id),
    );

    if (todosSeleccionados) {
      setSelectedPermisos((prev) =>
        prev.filter((id) => !grupoPermisos.includes(id)),
      );
    } else {
      setSelectedPermisos((prev) => [...new Set([...prev, ...grupoPermisos])]);
    }
  };

  const toggleGrupo = (grupo) => {
    setGruposExpandidos((prev) => ({
      ...prev,
      [grupo]: !prev[grupo],
    }));
  };

  const expandirTodos = () => {
    const todosExpandidos = {};
    Object.keys(permisosPorGrupo).forEach((grupo) => {
      todosExpandidos[grupo] = true;
    });
    setGruposExpandidos(todosExpandidos);
  };

  const colapsarTodos = () => {
    const todosColapsados = {};
    Object.keys(permisosPorGrupo).forEach((grupo) => {
      todosColapsados[grupo] = false;
    });
    setGruposExpandidos(todosColapsados);
  };

  const totalPermisosSeleccionados = selectedPermisos.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con título y contador */}
      <div className="mb-8 mt-15">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="material-icons text-white text-2xl">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Crear Nuevo Rol
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Define los permisos y características del nuevo rol
              </p>
            </div>
          </div>

          {/* Badge de permisos seleccionados */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              <span className="material-icons text-sm mr-1">check_circle</span>
              {totalPermisosSeleccionados} permisos seleccionados
            </span>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-600 transition-all duration-300"
            style={{
              width: `${(totalPermisosSeleccionados / permisos.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Card para información básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">info</span>
              Información Básica
            </h2>
          </div>
          <div className="p-6">
            <fieldset className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del rol <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-sm">
                    badge
                  </span>
                </div>
                <input
                  type="text"
                  value={nombreRol}
                  onChange={(e) => {
                    setNombreRol(e.target.value);
                    validateField("nombre", e.target.value);
                  }}
                  required
                  placeholder="Ej: Administrador, Editor, Usuario..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                El nombre debe ser descriptivo y único en el sistema
              </p>
              {errors.nombre?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.nombre.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </fieldset>
          </div>
        </div>

        {/* Sección de permisos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="material-icons text-emerald-600 mr-2">
                    security
                  </span>
                  Permisos del Rol
                </h2>
                <span className="text-sm text-gray-500">
                  {Object.keys(permisosPorGrupo).length} grupos disponibles
                </span>
              </div>

              {/* Controles de expandir/colapsar */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={expandirTodos}
                  className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  title="Expandir todos"
                >
                  <span className="material-icons text-base">expand_more</span>
                  <span className="ml-1">Expandir todos</span>
                </button>
                <button
                  type="button"
                  onClick={colapsarTodos}
                  className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  title="Colapsar todos"
                >
                  <span className="material-icons text-base">expand_less</span>
                  <span className="ml-1">Colapsar todos</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {Object.entries(permisosPorGrupo).map(([grupo, lista]) => (
              <div
                key={grupo}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Header del acordeón */}
                <div className="w-full bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleGrupo(grupo)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    <span
                      className={`material-icons transition-transform duration-200 ${
                        gruposExpandidos[grupo] ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-semibold text-gray-800">
                        {grupo}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {lista.length} permisos
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {
                          lista.filter((p) =>
                            selectedPermisos.includes(p.permisoid),
                          ).length
                        }{" "}
                        seleccionados
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAll(grupo)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center transition-colors px-2 py-1 rounded hover:bg-emerald-50"
                  >
                    <span className="material-icons text-sm mr-1">
                      {lista.every((p) =>
                        selectedPermisos.includes(p.permisoid),
                      )
                        ? "remove_done"
                        : "done_all"}
                    </span>
                    {lista.every((p) => selectedPermisos.includes(p.permisoid))
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>
                </div>

                {/* Contenido del acordeón */}
                <div
                  className={`
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${gruposExpandidos[grupo] ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}
                `}
                >
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lista.map((permiso) => {
                        const isSelected = selectedPermisos.includes(
                          permiso.permisoid,
                        );

                        return (
                          <label
                            key={permiso.permisoid}
                            htmlFor={`permiso-${permiso.permisoid}`}
                            className={`
                              relative flex items-start p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                              ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                              }
                            `}
                            title={permiso.detalles}
                          >
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                id={`permiso-${permiso.permisoid}`}
                                checked={isSelected}
                                onChange={() =>
                                  handleCheckboxChange(permiso.permisoid)
                                }
                                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`
                                  text-sm font-medium
                                  ${isSelected ? "text-emerald-900" : "text-gray-700"}
                                `}
                                >
                                  {permiso.descripcion}
                                </span>
                                {isSelected && (
                                  <span className="material-icons text-emerald-600 text-sm">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {permiso.detalles && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {permiso.detalles}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones del formulario */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={!nombreRol || isLoading}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium text-white 
              flex items-center space-x-2 transition-all
              ${
                !nombreRol || isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg"
              }
            `}
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
                <span className="material-icons text-sm">save</span>
                <span>Crear Rol</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
