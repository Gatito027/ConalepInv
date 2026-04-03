import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { ExportSchema } from "../../utils/schemas/ExportSchema";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";

export default function DescargarEtiquetado({ setShowModal }){
    const [isLoading, setIsLoading] = useState(false);
  const [startedInv, setStartedInv] = useState("");
  const [endInv, setEndInv] = useState("");
  const [estado, setEstado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [donativo, setDonativo] = useState(false);
  const [startedFechaAdq, setStartedFechaAdq] = useState("");
  const [endFechaAdq, setEndFechaAdq] = useState("");
  const [startedFechaAlta, setStartedFechaAlta] = useState("");
  const [endFechaAlta, setEndFechaAlta] = useState("");
  const [personaAsig, setPersonaAsig] = useState("");

  const [listaPersonas, setListaPersonas] = useState([]);
  const [listaEstados] = useState(["Bueno", "Malo", "Obsoleto", "Regular"]);
  const [listaLugares, setListaLugares] = useState([]);
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const formdata = {
      startedInv,
      endInv,
      descripcion,
      [field]: value,
    };
    const result = ExportSchema.safeParse(formdata);
    //console.log(result);
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

  const ObtenerUbcaciones = useCallback(async () => {
    try {
      const ubi = await ObtenerTipo("lugares");
      if (!ubi.isSuccess || !ubi.data?.length) return;
      const mappedUbicaciones = ubi.data.map((ubicacion) => ({
        id: ubicacion.lugarid,
        nombre: ubicacion.nombre,
      }));
      setListaLugares(mappedUbicaciones);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);

  const ObtenerUsuarios = useCallback(async () => {
    try {
      const users = await ObtenerTipo("usuarios");
      if (!users.isSuccess || !users.data?.length) return;
      const mappedUsuarios = users.data.map((user) => ({
        id: user.usuarioid,
        nombre: user.nombre,
      }));
      setListaPersonas(mappedUsuarios);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);

  useEffect(() => {
    ObtenerUbcaciones();
    ObtenerUsuarios();
  }, [ObtenerUbcaciones, ObtenerUsuarios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const payload = {
            _startedNumInv: startedInv,
            _endNumInv: endInv,
            _estado: estado,
            _lugarId: lugar,
            _descripcion: descripcion,
            _startedFechaAlta: startedFechaAlta,
            _endFechaAlta: endFechaAlta,
            _startedFechaAdq: startedFechaAdq,
            _endFechaAdq: endFechaAdq,
            _usuarioId: personaAsig,
            _donativo: donativo,
        };

        const response = await fetch(`${import.meta.env.VITE_CONALEP_API}/inv/etiquetado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",   // envía la cookie con el token
            body: JSON.stringify(payload),
        });
        //console.log(await response.json());

        // Si el back respondió con JSON es porque hubo un error
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            const errorData = await response.json();
            toast.error(`Error: ${errorData.message}`);
            return;
        }

        // Es el Excel — convertir a blob y descargar
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Tomar el nombre del archivo que manda el backend
        const disposition = response.headers.get("Content-Disposition") || "";
        const filename = disposition.match(/filename="(.+?)"/)?.[1] ?? "inventario.xlsx";
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        // Limpiar formulario
        setStartedInv("");
        setEndInv("");
        setEstado(0);
        setLugar(0);
        setDescripcion("");
        setStartedFechaAlta("");
        setEndFechaAlta("");
        setStartedFechaAdq("");
        setEndFechaAdq("");
        setPersonaAsig(0);
        setDonativo(false);

        toast.success("Exportación exitosa");

    } catch (error) {
        toast.error("Error al exportar");
    } finally {
        setIsLoading(false);
    }
};

  const labelClass =
    "text-xs font-medium text-gray-500 uppercase tracking-wide";
  const inputClass =
    "block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-shadow bg-gray-50 focus:bg-white";
  const selectClass =
    "block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white appearance-none transition-shadow";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Cabecera */}
        <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex items-center gap-3">
          <span className="material-icons text-emerald-600 text-2xl">
            loyalty
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Etiquetado de inventario
            </h2>
            <p className="text-xs text-gray-500">
              Descarga las etiquetas del inventario en un archivo Excel
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {/* Núm. inventario */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Núm. inventario inicio</label>
                <input
                  type="number"
                  value={startedInv}
                  onChange={(e) => {
                    setStartedInv(e.target.value);
                    validateField("startedInv", e.target.value);
                  }}
                  placeholder="Ej. 1000"
                  className={inputClass}
                />
                {errors.startedInv?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.startedInv.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Núm. inventario final</label>
                <input
                  type="number"
                  value={endInv}
                  onChange={(e) => {
                    setEndInv(e.target.value);
                    validateField("endInv", e.target.value);
                  }}
                  placeholder="Ej. 2000"
                  className={inputClass}
                />
                {errors.endInv?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.endInv.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Estado y Lugar */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Estado</label>
                <div className="relative">
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Selecciona un estado</option>
                    {listaEstados.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Lugar</label>
                <div className="relative">
                  <select
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Selecciona un lugar</option>
                    {listaLugares.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nombre}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Descripción — ocupa las 2 columnas */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className={labelClass}>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    validateField("descripcion", e.target.value);
                  }}
                  placeholder="Descripción del artículo"
                  className={inputClass}
                />
                {errors.descripcion?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.descripcion.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Fecha de alta */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Fecha de alta (inicio)</label>
                <input
                  type="date"
                  value={startedFechaAlta}
                  onChange={(e) => setStartedFechaAlta(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Fecha de alta (fin)</label>
                <input
                  type="date"
                  value={endFechaAlta}
                  onChange={(e) => setEndFechaAlta(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Fecha de adquisición */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Fecha de adquisición (inicio)
                </label>
                <input
                  type="date"
                  value={startedFechaAdq}
                  onChange={(e) => setStartedFechaAdq(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Fecha de adquisición (fin)</label>
                <input
                  type="date"
                  value={endFechaAdq}
                  onChange={(e) => setEndFechaAdq(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Personal asignado y Donativo */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Personal asignado</label>
                <div className="relative">
                  <select
                    value={personaAsig}
                    onChange={(e) => setPersonaAsig(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Selecciona una persona</option>
                    {listaPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
                    arrow_drop_down
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-end">
                <label className={labelClass}>Donativo</label>
                <div className="flex items-center gap-3 h-9">
                  <label className="flex items-center cursor-pointer gap-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={donativo}
                        onChange={(e) => setDonativo(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                    </div>
                    <span className="text-sm text-gray-600">
                      {donativo ? "Sí" : "No"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="material-icons text-base">close</span>
                Cerrar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="material-icons text-base">download</span>
                    Descargar
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