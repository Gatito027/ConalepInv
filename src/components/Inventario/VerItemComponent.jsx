import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import NotFound from "../../pages/NoFoundPage";
import placeholder from "../../assets/Placeholder.png";
import { ObtenerArticulo } from "../../infrastructure/ObtenerArticulo";
import ContentCardComponent from "./ContentCardComponent";
import { usePermisos } from "../../context/UseUserData";
import FileCardComponent from "./FileCardComponent";

export default function VerItemComponent({ itemid }) {
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState({});
  const [error, setError] = useState(false);
  const { userPermisos } = usePermisos();

  const convertidorFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const fetchData = useCallback(async () => {
    try {
      //console.log(itemid);
      const response = await ObtenerArticulo(itemid);
      //console.log(response);
      if (!response.isSuccess || !response.data) {
        setError(true);
        return;
      }
      setItem(response.data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error: No se pudo localizar el item");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [itemid]);

  useEffect(() => {
    fetchData();
    //console.log(item);
  }, [fetchData]);

  if (error) return <NotFound />;

  if (!Array.isArray(userPermisos)) return <h1 className="mt-15">No cuentas con permisos</h1>;
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-20">
      {/* Header con gradiente */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar con borde y sombra mejorado */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
              <span className="text-3xl font-bold text-white">
                {isLoading ? (
                  <div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                ) : (
                  <img
                    src={item?.imagenurl || placeholder}
                    alt={item.descripcion}
                    className="object-contain rounded-2xl"
                  />
                )}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {isLoading ? (
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  {item.descripcion}{" "}
                  {item.donativo && (
                    <span className="px-1.5 py-0.5 rounded-full font-medium text-xs bg-emerald-100 text-emerald-700">
                      Donativo
                    </span>
                  )}
                </>
              )}
            </h1>

            {/* Medallas en grid responsive */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {/* Estado con badge animado */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      item.estado?.toLowerCase() === "bueno"
                        ? "bg-emerald-400"
                        : item.estado?.toLowerCase() === "regular"
                          ? "bg-amber-400"
                          : item.estado?.toLowerCase() === "obsoleto"
                            ? "bg-gray-400"
                            : item.estado?.toLowerCase() === "malo"
                              ? "bg-red-400"
                              : "bg-purple-400" // para desconocido
                    }`}
                  />
                  {/*<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75'></span>*/}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      item.estado?.toLowerCase() === "bueno"
                        ? "bg-emerald-500"
                        : item.estado?.toLowerCase() === "regular"
                          ? "bg-amber-500"
                          : item.estado?.toLowerCase() === "obsoleto"
                            ? "bg-gray-500"
                            : item.estado?.toLowerCase() === "malo"
                              ? "bg-red-500"
                              : "bg-purple-500" // para desconocido
                    }`}
                  />
                </span>
                <span className="text-white text-sm font-medium">
                  {item.estado}
                </span>
              </div>

              {/* Items de información con iconos consistentes */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Número de inventario */}
                <div
                  title="Numero de inventario"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors"
                >
                  <span className="material-icons text-white text-base">
                    qr_code_scanner
                  </span>
                  <span className="text-white text-sm font-medium">
                    {item.numeroinventario}
                  </span>
                </div>

                {/* Subcuenta amonizada */}
                <div
                  title="Subcuenta amonizada"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors"
                >
                  <span className="material-icons text-white text-base">
                    account_balance
                  </span>
                  <span className="text-white text-sm font-medium">
                    {item.subcuentaamonizada}
                  </span>
                </div>

                {/* Código de partida */}
                <div
                  title="Código de partida"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors"
                >
                  <span className="material-icons text-white text-base">
                    code
                  </span>
                  <span className="text-white text-sm font-medium">
                    {item.codigodepartida}
                  </span>
                </div>

                {/* Lugar */}
                <div
                  title="Ubicación"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors"
                >
                  <span className="material-icons text-white text-base">
                    place
                  </span>
                  <span className="text-white text-sm font-medium">
                    {item.lugar}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contenido*/}
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="material-icons text-emerald-500">info</span>
          Información adicional
        </h2>

        <div className="mb-8 last:mb-0">
          {/* Título del grupo */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
            <h3 className="text-base font-semibold text-gray-700">General</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cards */}
            <ContentCardComponent
              content={item.observaciones}
              icon={"description"}
              description={"Observaciones"}
            />
            <ContentCardComponent
              content={item.cantidad}
              icon={"numbers"}
              description={"Cantidad"}
            />
            <ContentCardComponent
              content={item.marca}
              icon={"branding_watermark"}
              description={"Marca"}
            />
            <ContentCardComponent
              content={item.modelo}
              icon={"precision_manufacturing"}
              description={"Modelo"}
            />
            <ContentCardComponent
              content={item.numeroserie}
              icon={"qr_code"}
              description={"Número de serie"}
            />
            <ContentCardComponent
              content={item.valorlibros ? `$ ${item.valorlibros}` : null}
              icon={"book"}
              description={"Valor en libros"}
            />
            <ContentCardComponent
              content={item.despreciacion ? `$ ${item.despreciacion}` : null}
              icon={"trending_down"}
              description={"Depreciación"}
            />
            <ContentCardComponent
              content={item.departamento}
              icon={"category"}
              description={"Cuenta (tipo de bien)"}
            />
            <ContentCardComponent
              content={item.cotizacion}
              icon={"request_quote"}
              description={"Valor cotización"}
            />
            <ContentCardComponent
              content={item.cuenta}
              icon={"account_balance_wallet"}
              description={"Cuenta Dep."}
            />
            <ContentCardComponent
              content={item.fechaalta ? convertidorFecha(item.fechaalta) : null}
              icon={"event_available"}
              description={"Fecha de alta"}
            />
            <ContentCardComponent
              content={item.vidautil}
              icon={"history"}
              description={"Años de vida util"}
            />
          </div>
          <div className="flex items-center gap-2 mb-4 mt-4">
            <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
            <h3 className="text-base font-semibold text-gray-700">
              Adquisición
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cards */}
            <ContentCardComponent
              content={item.costoadquision ? `$ ${item.costoadquision}` : null}
              icon={"attach_money"}
              description={"Costo de adquisición"}
            />
            <ContentCardComponent
              content={item.fechaadquision ? convertidorFecha(item.fechaadquision) : null}
              icon={"calendar_today"}
              description={"Fecha de adquisición"}
            />
          </div>
          <div className="flex items-center gap-2 mb-4 mt-4">
            <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
            <h3 className="text-base font-semibold text-gray-700">
              Personal asignado
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(item.nombre_persona?.length ?? 0) > 0 ? (
              item.nombre_persona.map((per, index) => (
                <ContentCardComponent
                  key={index}
                  content={per}
                  icon="account_circle"
                  description="Asignado a"
                />
              ))
            ) : (
              <ContentCardComponent
                content="Sin asignar"
                icon="account_circle"
                description="Asignado a"
              />
            )}
          </div>
          {(item.fecharesguardo != null || item.motivoresguardo != null) && (
            <>
              <div className="flex items-center gap-2 mb-4 mt-4">
                <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-700">
                  Resguardo
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContentCardComponent
                  content={
                    item.fecharesguardo
                      ? convertidorFecha(item.fecharesguardo)
                      : null
                  }
                  icon={"event"}
                  description={"Fecha de resguardo"}
                />
                <ContentCardComponent
                  content={item.motivoresguardo}
                  icon={"inventory_2"}
                  description={"Motivo de resguardo"}
                />
              </div>
            </>
          )}
          {(item.fechabaja != null || item.tipobaja != null || item.documentobaja !=null) && (
            <>
              <div className="flex items-center gap-2 mb-4 mt-4">
                <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-700">Baja</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContentCardComponent
                  content={
                    item.fechabaja ? convertidorFecha(item.fechabaja) : null
                  }
                  icon={"event_busy"}
                  description={"Fecha de baja"}
                />
                <ContentCardComponent
                  content={item.tipobaja}
                  icon={"assignment_return"}
                  description={"Tipo de baja"}
                />
                <FileCardComponent
                  file={item.documentobaja}
                  icon={"article"}
                  description={"Documento de baja"}
                />
              </div>
            </>
          )}
          {(item.fechapoliza != null || item.fechadocumentopoliza != null || item.documentopoliza != null) && (
            <>
              <div className="flex items-center gap-2 mb-4 mt-4">
                <div className="h-6 w-1 bg-emerald-400 rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-700">
                  Póliza
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContentCardComponent
                  content={item.fechapoliza ? convertidorFecha(item.fechapoliza) : null}
                  icon={"date_range"}
                  description={"Fecha de Poliza"}
                />
                <ContentCardComponent
                  content={item.fechadocumentopoliza ? convertidorFecha(item.fechadocumentopoliza) : null}
                  icon={"receipt_long"}
                  description={"Fecha de documento"}
                />
                <FileCardComponent
                  file={item.documentopoliza}
                  icon={"assignment"}
                  description={"Documento de poliza"}
                />
              </div>
            </>
          )}
        </div>
        {/*userPermisos.includes("Editar articulo") && (
        <button className="mt-4 mb-4 sm:mt-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-all backdrop-blur-sm flex items-center gap-2">
          <span className="material-icons text-sm">edit</span>
          Editar
        </button>)*/}
      </div>
    </div>
  );
}
