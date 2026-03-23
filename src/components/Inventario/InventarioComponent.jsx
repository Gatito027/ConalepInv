import { useCallback, useEffect, useState } from "react";
import { usePermisos } from "../../context/UseUserData";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NoItemsComponent from "./NoItemsComponent";
import QrModal from "./QrModal";
import { ListaArticulos } from "../../infrastructure/ListaArticulos";
import ListItemsComponent from "./ListItemsComponent";
import LoadingPageComponent from "../Others/LoadingPageComponent";

export default function InventarioComponent() {
  const { userPermisos } = usePermisos();
  const navigate = useNavigate();
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
    const coincideAsignado = Array.isArray(item.asignado)
      ? // Caso especial: si el usuario busca "sin asignar"
        textoBusqueda === "sin asignar"
        ? item.asignado.length === 0 || item.asignado.every((asig) => !asig)
        : item.asignado
            .filter(Boolean) // elimina null/undefined
            .some((asig) => asig.toLowerCase().includes(textoBusqueda))
      : false;

    return (
      coincideDescripcion ||
      coincideNumInv ||
      coincideEstado ||
      coincideLugar ||
      coincideDonativo ||
      coincideAsignado
    );
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await ListaArticulos();

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
        asignado: item.nombre_persona,
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
              <span className="material-icons text-white text-3xl">
                inventory
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Gestión de Inventario
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Administra el inventario de la institución
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userPermisos.includes("Exportar Excel") && (
              <button
                onClick={() => navigate("registro")}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 group"
              >
                <span className="material-icons text-lg">archive</span>
                <span>Exportar</span>
                <span className="material-icons text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            )}
            {userPermisos.includes("Importar Excel") && (
              <button
                onClick={() => navigate("registro")}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 group"
              >
                <span className="material-icons text-lg">upload_file</span>
                <span>Importar</span>
                <span className="material-icons text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            )}
            {userPermisos.includes("Agregar articulo") && (
              <button
                onClick={() => navigate("inventario/registro")}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 group"
              >
                <span className="material-icons text-lg">assignment_add</span>
                <span>Agregar Item</span>
                <span className="material-icons text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/*Buscador*/}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
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
              onChange={(e) => setBusqueda(e.target.value)}
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

          <button
            title="Descargar Etiquetado"
            className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="material-icons text-gray-700 text-base">
              loyalty
            </span>
          </button>
        </div>
      </div>

      {/* Sección de contenido (placeholder) */}
      <ListItemsComponent reload={fetchData} articulos={articulosFiltrados} />
      {articulosFiltrados.length <= 0 && <NoItemsComponent />}

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
