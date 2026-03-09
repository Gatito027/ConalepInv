import fondo from "../../assets/Background.png";

export default function NoEditatableComponent() {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Overlay con gradiente para mejor legibilidad */}
      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]"></div>

      {/* Tarjeta principal */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Contenido de texto */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            No editable
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Este elemento no se puede Editar.
          </h2>
          <p className="text-gray-200 mb-6 leading-relaxed">
            Lo sentimos, este elemento forma parte de la configuración base y no es editable.
          </p>

          {/* Botón con mejor diseño */}
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg shadow-md border border-white/20"
          >
            <span className="material-icons text-lg mr-2">home</span>
            Volver al inicio
          </a>
        </div>

        {/* Mensaje adicional */}
        <p className="text-gray-300 text-sm mt-6 opacity-80">
          Si crees que esto es un error, contacta al soporte técnico.
        </p>
      </div>
    </div>
  );
}
