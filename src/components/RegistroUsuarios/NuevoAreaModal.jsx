export default function NuevoAreaModal({ setShowModal }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      {/* Backdrop con efecto de desenfoque mejorado */}
      <div className="absolute inset-0 backdrop-blur-md bg-opacity-50" />

      {/* Modal Card con animación */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-8">
          {/* Título y descripción */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nueva Área
            </h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-600">
                Agrega un nuevo departamento o área a la organización
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form className="space-y-6">
            <fieldset className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 ml-1">
                Nombre del área
              </label>
              <div className="relative group">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200">
                  domain
                </span>
                <input
                  type="text"
                  placeholder="Ejemplo: Recursos Humanos, Marketing, Ventas..."
                  className="w-full px-4 py-3.5 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl 
                           focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 
                           hover:border-gray-300 transition-all duration-200 outline-none 
                           text-gray-700 placeholder-gray-400 text-sm"
                  autoFocus
                />
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
                <span className="material-icons text-xl">check_circle</span>
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold 
                         rounded-xl border-2 border-gray-200 hover:border-gray-300 
                         transition-all duration-200 flex items-center justify-center gap-2
                         shadow-sm hover:shadow"
              >
                <span className="material-icons text-xl text-gray-500">
                  cancel
                </span>
                Cancelar
              </button>
            </div>
          </form>

          {/* Botón cerrar (X) */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                     bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 
                     hover:text-gray-700 transition-all duration-200 hover:rotate-90"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
