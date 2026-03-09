export default function NoItemsComponent() {
  return (
    <div className="text-center py-12">
      <div className="inline-block p-4 bg-emerald-50 rounded-full mb-4">
        <span className="material-icons text-emerald-500 text-4xl">
          inventory
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No hay articulos registrados
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Comienza agregando el primer articulo haciendo clic en el botón "Agregar
        Item"
      </p>
    </div>
  );
}
