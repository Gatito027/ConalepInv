export default function NoUsersComponent() {
  return (
    <div className="text-center py-12">
      <div className="inline-block p-4 bg-emerald-50 rounded-full mb-4">
        <span className="material-icons text-emerald-500 text-4xl">
          group_off
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No hay usuarios registrados
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Comienza agregando el primer usuario haciendo clic en el botón "Agregar
        Usuario"
      </p>
    </div>
  );
}
