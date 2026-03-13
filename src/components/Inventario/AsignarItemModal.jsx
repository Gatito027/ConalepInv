import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";
import { ObtenerAsignaciones } from "../../infrastructure/ObtenerAsignaciones";
import AsignarItems from "../../infrastructure/AsignarItems";

export default function AsignarItemModal({ setShowModal, reload, itemId }) {
  const [personaSeleccionada, setPersonaSeleccionada] = useState();
  const [listPersonas, setListPersonas] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState([]);
  const [loadingRemove, setLoadingRemove] = useState([]);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [cambios, setCambios] = useState([]);

  const handleAddPersona = async (e) => {
    e.preventDefault();
    setIsLoadingAdd(true);
    try {
      const persona = listPersonas.find(
        (p) => p.id === parseInt(personaSeleccionada),
      );
      if (!persona) return;
      // Actualizar estados
      setDatosFormulario((prev) => [...prev, persona]);
      // Construir arreglo actualizado de cambios
      const nuevosCambios = [...cambios, persona.id];
      setCambios(nuevosCambios);
      // Usar la copia actualizada en la petición
      const response = await AsignarItems(itemId, nuevosCambios);
      if (response.isSuccess) {
        toast.success("Agregado exitosamente");
        fetchdata();
        reload();
        //setShowModal(false);
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido agregar");
    } finally {
      setIsLoadingAdd(false);
    }
  };

  // Función para eliminar persona
  const handleRemovePersona = async (id) => {
    setLoadingRemove((prev) => [...prev, id]);
    //e.preventDefault();
    try {
      setDatosFormulario((prev) => prev.filter((p) => p.id !== id));
      const nuevosCambios = cambios.filter((c) => c !== id);
      setCambios(nuevosCambios);
      const response = await AsignarItems(itemId, nuevosCambios);
      if (response.isSuccess) {
        toast.success("Eliminado exitosamente");
        fetchdata();
        reload();
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido eliminar");
    } finally {
      setLoadingRemove((prev) => prev.filter((c) => c !== id));
    }
  };

  const fetchdata = useCallback(async () => {
    try {
      const data = await ObtenerTipo("usuarios");
      const asign = await ObtenerAsignaciones(itemId);
      if (!data.isSuccess) return;
      if (asign.isSuccess) {
        const mappedAsignaciones = asign.data.map((a) => ({
          id: a.usuarioid,
          nombre: a.nombre,
        }));
        setDatosFormulario(mappedAsignaciones);
        setCambios(mappedAsignaciones.map((a) => a.id));
      }

      const mappedUsuarios = data.data.map((user) => ({
        id: user.usuarioid,
        nombre: user.nombre,
      }));
      setListPersonas(mappedUsuarios);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, [itemId]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);
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
              face
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Asignar item</h2>
          </div>
        </div>
        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Asignar este item a un usuario
          </p>
          <form>
            {/* usuarios */}
            <fieldset className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
              <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  people
                </span>
                Usuarios a cargo del item
              </legend>

              <div className="space-y-2">
                {datosFormulario.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 group">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-emerald-200 transition-colors duration-200">
                      <span className="material-icons text-gray-400 group-hover:text-emerald-500 transition-colors duration-200">
                        person
                      </span>
                      <p className="text-gray-700 font-medium">{cat.nombre}</p>
                    </div>

                    <button
                      type="button"
                      className="p-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 
                   rounded-lg text-red-500 transition-all duration-200 
                   hover:border-red-300 hover:scale-105 active:scale-95
                   flex items-center justify-center group/btn
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   shadow-sm hover:shadow"
                      disabled={loadingRemove.includes(cat.id)}
                      title="Eliminar usuario"
                      onClick={() => handleRemovePersona(cat.id)}
                    >
                      {loadingRemove.includes(cat.id) ? (
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
                        </div>
                      ) : (
                        <span className="material-icons text-xl group-hover/btn:rotate-90 transition-transform duration-300">
                          close
                        </span>
                      )}
                    </button>
                  </div>
                ))}
                {datosFormulario.length === 0 && (
                  <p className="text-red-900 font-medium">
                    No hay personas asignadas
                  </p>
                )}
              </div>
            </fieldset>
            <fieldset className="space-y-1.5 mt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  person_add
                </span>
                Agregar usuario
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    person_add
                  </span>
                  <select
                    className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           transition-all duration-200 outline-none text-gray-700 appearance-none cursor-pointer"
                    value={personaSeleccionada}
                    onChange={(e) => {
                      setPersonaSeleccionada(e.target.value);
                    }}
                    required
                  >
                    <option value="" className="text-gray-500">
                      Selecciona un usuario
                    </option>
                    {listPersonas
                      // Filtra los que ya están en datosFormulario
                      .filter(
                        (user) =>
                          !datosFormulario.some(
                            (asignado) => asignado.id === user.id,
                          ),
                      )
                      .map((cat) => (
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
                  disabled={!personaSeleccionada || isLoadingAdd}
                  onClick={handleAddPersona}
                  title="Agregar usuario"
                  className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoadingAdd ? (
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
                    </div>
                  ) : (
                    <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                      add
                    </span>
                  )}
                </button>
              </div>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
