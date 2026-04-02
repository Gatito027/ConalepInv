export default function SearchingComponent() {
  return (
    <div className="text-center py-16 px-4 animate-fade-in-up">
      {/* Contenedor del ícono con animación de pulso */}
      <div className="inline-block p-4 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-full mb-6 relative">
        <div className="absolute inset-0 rounded-full animate-ping-slow bg-emerald-200 opacity-75"></div>
        <span className="material-icons text-emerald-500 text-5xl relative z-10 animate-wiggle">
          inventory
        </span>
      </div>

      {/* Título con gradiente */}
      <h3 className="text-2xl font-bold bg-linear-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3 animate-slide-up">
        Buscando artículos registrados
      </h3>

      {/* Descripción */}
      <p className="text-gray-500 max-w-md mx-auto animate-slide-up-delay">
        Se está buscando en los registros los artículos que coincidan con el término.
      </p>
      
      {/* Puntos animados */}
      <div className="flex justify-center gap-3 mt-6">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}