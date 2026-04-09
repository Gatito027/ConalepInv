import { useState, useEffect, useCallback } from "react";
import NoMiItemsComponent from "./NoMiItemsComponent";
import QrModal from "../Inventario/QrModal";
import { MethodGet } from "../../utils/Data/MethodGet";
import LoadingPageComponent from "../Others/LoadingPageComponent";
import ListaMisItemsComponent from "./ListaMisItemsComponent";

export default function MiInvetarioComponent() {
  const [busqueda, setBusqueda] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const articulosFiltrados = articulos.filter((item) => {
    const textoBusqueda = busqueda.toLowerCase().trim();

    const coincideDescripcion = item.descripcion
      ?.toLowerCase()
      .includes(textoBusqueda);
    const coincideNumInv = item.numinv
      ?.toString()
      .toLowerCase()
      .includes(textoBusqueda);
    const coincideEstado = item.estado?.toLowerCase().includes(textoBusqueda);
    const coincideLugar = item.lugar?.toLowerCase().includes(textoBusqueda);
    const coincideDonativo =
      textoBusqueda === "donativo" ? item.donativo === true : false;

    return (
      coincideDescripcion ||
      coincideNumInv ||
      coincideEstado ||
      coincideLugar ||
      coincideDonativo
    );
  });

  const fetchData = useCallback(async () => {
    //setIsLoading(true);
    try {
      const response = await MethodGet("inv/mis-articulos");

      if (!response.isSuccess || !response.data?.length) return;

      const mappedItems = response.data.map((item) => ({
        id: item.bienid,
        descripcion: item.descripcion,
        imagen: item.imagenurl,
        numinv: item.numeroinventario,
        estado: item.estado,
        lugar: item.nombre,
        fechaadqui: item.fechaadquisicion,
        cantidad: item.cantidad,
        donativo: item.donativo,
      }));
      setArticulos(mappedItems);
    } catch (error) {
      console.error("Error al cargar los items:", error);
      toast.error("No se ha podido cargar los items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <LoadingPageComponent />;

  return (
    <div className="max-w-6xl mx-auto mt-20 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-3xl">
      {/* Header con gradiente mejorado */}
      <div className="bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-700 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mr-4">
              <span className="material-icons text-white text-3xl">inventory</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Mi inventario</h2>
              <p className="text-emerald-100 text-sm mt-1">
                Observa los items asignados a ti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold flex items-center">
                <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
                Total:{" "}
                <span className="ml-1 text-emerald-100 font-bold">{articulosFiltrados.length} Items</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/*Buscador*/}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar item..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
              }}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
          </div>

          {/* Botones de acción */}
          <button
            title="Escanear QR"
            onClick={() => setShowQrModal(true)}
            className="flex items-center px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
          >
            <span className="material-icons text-emerald-600 text-base">
              qr_code
            </span>
          </button>
        </div>
      </div>

      <ListaMisItemsComponent articulos={articulosFiltrados} />

      {articulosFiltrados.length <= 0 && <NoMiItemsComponent />}

      {/* Footer de la tabla */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons text-emerald-500 text-base mr-2">
              info
            </span>
            <span>
              Mostrando {articulosFiltrados.length} de {articulos.length} items
            </span>
          </div>
        </div>
      </div>
      {showQrModal && (
        <QrModal setBusqueda={setBusqueda} setShowModal={setShowQrModal} />
      )}
    </div>
  );
}
