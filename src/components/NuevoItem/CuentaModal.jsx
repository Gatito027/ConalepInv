import { useState } from "react";
import toast from "react-hot-toast";
import { crearSchemaCampo } from "../../utils/schemas/StringSchema";
import { RegistrarTipo } from "../../infrastructure/RegistrarTipo";

export default function CuentaModal({
  setShowModal,
  reload,
}) {
  const [cuenta, setCuenta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (errors.cuenta?.length > 0) {
      toast.error("Por favor, corrige los errores en el formulario");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {_tipo: cuenta};
      const response = await RegistrarTipo(payload, "inv/registrar-cuenta");

      if (response.isSuccess) {
        toast.success("Cuenta guardado");
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

  const validateField = (field, value) => {
    const formData = { cuenta, [field]: value };
    const CuentaSchema = crearSchemaCampo("cuenta");
    const result = CuentaSchema.safeParse(formData);
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
              category
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Nueva cuenta
            </h2>
          </div>
        </div>
        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Agrega un nuevo tipo de bien
          </p>
          <form onSubmit={handleSubmit}>
            <fieldset className="space-y-1.5 mt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="material-icons text-emerald-600 text-xl">
                  category
                </span>
                Cuenta
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    category
                  </span>
                  <input
                    type="text"
                    placeholder="Ejemplo: Muebles de oficina y estantería..."
                    value={cuenta}
                    onChange={(e) => {
                      setCuenta(e.target.value);
                      validateField("cuenta", e.target.value);
                    }}
                    className="w-full px-4 py-3.5 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           hover:border-gray-300 transition-all duration-200 outline-none 
                           text-gray-700 placeholder-gray-400 text-sm"
                    required
                  />
                </div>
              </div>
            </fieldset>
            {errors.cuenta?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.cuenta.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            {/* Botones con iconos y mejor distribución */}
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="material-icons text-xl">close</span>
                Cerrar
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
