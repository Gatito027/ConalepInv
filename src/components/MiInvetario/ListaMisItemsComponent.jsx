import placeholder from "../../assets/Placeholder.png";

export default function ListaMisItemsComponent({ articulos }) {
  return (
    <div className="p-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-gray-50 to-emerald-50 border-b border-teal-200">
              <th className="p-4 font-semibold text-gray-700 text-left">
                Detalles
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Ubicación
              </th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((item) => (
              <tr
                className="border-b border-gray-100 hover:bg-emerald-50 transition-all duration-200"
                key={item.id}
              >
                <td className="p-4">
                  <div className="flex items-start gap-5 group">
                    {/* Imagen con efecto mejorado */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl shadow-md group-hover:shadow-xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 flex items-center justify-center overflow-hidden ring-4 ring-emerald-50">
                        <img
                          src={item?.imagen || placeholder}
                          alt={item.descripcion || "Item"}
                          className="w-10 h-10 object-contain drop-shadow-md"
                        />
                      </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Título */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-gray-800 leading-tight group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                          {item.descripcion}
                          <span className="text-sm text-gray-500 p-2 font-medium">
                            x{item.cantidad}
                          </span>
                          {item.donativo && (
                            <span className="px-1.5 py-0.5 rounded-full font-medium text-xs bg-emerald-100 text-emerald-700">
                              Donativo
                            </span>
                          )}
                        </h3>
                      </div>

                      {/* Grid de información */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {/* Número de inventario */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-icons text-emerald-500">
                            qr_code_scanner
                          </span>
                          <span className="text-gray-600 truncate font-medium">
                            #{item.numinv}
                          </span>
                        </div>

                        {/* Estado con badge de color */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              item.estado?.toLowerCase() === "bueno"
                                ? "bg-emerald-500"
                                : item.estado?.toLowerCase() === "regular"
                                  ? "bg-amber-500"
                                  : item.estado?.toLowerCase() === "obsoleto"
                                    ? "bg-gray-500"
                                    : item.estado?.toLowerCase() === "malo"
                                      ? "bg-red-500"
                                      : "bg-purple-400" // para desconocido
                            }`}
                          />
                          <span
                            className={`px-1.5 py-0.5 rounded-full font-medium ${
                              item.estado?.toLowerCase() === "bueno"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.estado?.toLowerCase() === "regular"
                                  ? "bg-amber-50 text-amber-700"
                                  : item.estado?.toLowerCase() === "obsoleto"
                                    ? "bg-gray-100 text-gray-700"
                                    : item.estado?.toLowerCase() === "malo"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-purple-50 text-purple-700" // para desconocido
                            }`}
                          >
                            {item.estado || "desconocido"}
                          </span>
                        </div>

                        {/* Fecha de adquisición */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-icons text-emerald-500 text-[18px]">
                            event
                          </span>
                          <span className="text-gray-600">
                            {item.fechaadqui
                              ? new Date(item.fechaadqui).toLocaleDateString(
                                  "es-MX",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "Sin fecha"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center">
                    {item.lugar === "Almacen" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="material-icons text-amber-500 text-base mr-1">
                          location_on
                        </span>
                        {item.lugar}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="material-icons text-emerald-500 text-base mr-1">
                          location_on
                        </span>
                        {item.lugar}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
