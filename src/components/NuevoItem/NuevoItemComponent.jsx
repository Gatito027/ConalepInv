import { useCallback, useEffect, useState } from "react";
import placeholder from "../../assets/Placeholder.png";
import toast from "react-hot-toast";
import { ItemSchema } from "../../utils/schemas/ItemSchema";
import ModalPDFViewer from "./ModalPDFViewer";
import UbicacionModal from "./UbicacionModal";
import ModeloModal from "./ModeloModal";
import MarcaModal from "./MarcaModal";
import CuentaModal from "./CuentaModal";
import { ObtenerTipo } from "../../infrastructure/ObtenerTipo";
import { RegistrarArchivo } from "../../infrastructure/RegistrarArchivo";

export default function NuevoItemComponent() {
  const today = new Date();
  const [img, setImg] = useState();
  const [descripcion, setDescripcion] = useState("");
  const [subcuenta, setSubcuenta] = useState("");
  const [estado, setEstado] = useState("");
  const [numeroInv, setNumeroinv] = useState();
  const [codigoPartida, setCodigoPartida] = useState();
  const [ubicacion, setUbicacion] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [cantidad, setcantidad] = useState(1);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [serie, setSerie] = useState("");
  const [valorLibros, setValorLibros] = useState();
  const [despreciacion, setDespreciacion] = useState();
  const [departamento, setDepartamento] = useState("");
  const [costoAdquidsion, setCostoAdquision] = useState();
  const [fechaAdquision, setFechaAdquision] = useState(
    today.toISOString().split("T")[0],
  );
  const [tipobaja, setTipoBaja] = useState();
  const [fechaBaja, setFechaBaja] = useState();
  const [documentoBaja, setDocumentoBaja] = useState();
  const [fechaResguardo, setFechaResguardo] = useState();
  const [motivoResguardo, setMotivoResguardo] = useState("");
  const [fechaAlta, setFechaAlta] = useState(today.toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [donativo, setDonativo] = useState(false);
  const [cuenta, setCuenta] = useState();
  const [valor, setValor] = useState();
  const [vidaUtil, setVidaUtil] = useState();
  const [polizaFecha, setPolizaFecha] = useState();
  const [polizaDocumento, setPolizaDocumento] = useState();
  const [polizaDate, setPolizaDate] = useState();
  const [errors, setErrors] = useState({});

  const [showPdf, setShowPdf] = useState(false);
  const [archivo, setArchivo] = useState({});
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [showModeloModal, setShowModeloModal] = useState(false);
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showCuentaModal, setShowCuentaModal] = useState(false);

  const [listUbicaciones, setListUbicaciones] = useState([]);
  const [listModelos, setListModelos] = useState([]);
  const [listMarcas, setListMarcas] = useState([]);
  const [listCuentas, setListCuentas] = useState([]);

  const validateField = (field, value) => {
    const formdata = {
      descripcion,
      subcuenta,
      estado,
      numeroInv,
      codigoPartida,
      observaciones,
      cantidad,
      serie,
      valorLibros,
      despreciacion,
      departamento,
      costoAdquidsion,
      fechaAdquision,
      tipobaja,
      fechaBaja,
      documentoBaja,
      fechaResguardo,
      motivoResguardo,
      fechaAlta,
      donativo,
      valor,
      vidaUtil,
      polizaDate,
      polizaFecha,
      polizaDocumento,
      [field]: value,
    };
    const result = ItemSchema.safeParse(formdata);
    //console.log(result);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const hasErrors = Object.values(errors).some((arr) => arr.length > 0);

    if (hasErrors) {
      toast.error("Por favor, corrige los errores en el formulario");
      setIsLoading(false);
      return;
    }

    // Helper para agregar solo si el valor es válido
    const appendIfValid = (formData, key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    };

    const formData = new FormData();

    // Archivos (estos sí se agregan siempre o con su propia validación)
    if (img) formData.append("imagen", img);
    if (documentoBaja) formData.append("baja", documentoBaja);
    if (polizaDocumento) formData.append("poliza", polizaDocumento);

    // Campos requeridos (siempre se agregan)
    formData.append("_descripcion", descripcion);
    formData.append("_numeroInv", numeroInv);
    formData.append("_lugarId", ubicacion);
    formData.append("_estado", estado);
    formData.append("_cantidad", cantidad);
    formData.append("_donativo", donativo);

    // Campos opcionales (solo si tienen valor)
    appendIfValid(formData, "_subcuenta", subcuenta);
    appendIfValid(formData, "_codigoPartida", codigoPartida);
    appendIfValid(formData, "_observaciones", observaciones);
    appendIfValid(formData, "_marcaId", marca);
    appendIfValid(formData, "_modeloId", modelo);
    appendIfValid(formData, "_numeroSerie", serie);
    appendIfValid(formData, "_costoAdquisicion", costoAdquidsion);
    appendIfValid(formData, "_depreciacion", despreciacion);
    appendIfValid(formData, "_valorLibros", valorLibros);
    appendIfValid(formData, "_fechaResguardo", fechaResguardo);
    appendIfValid(formData, "_motivoResguardo", motivoResguardo);
    appendIfValid(formData, "_departamentoId", departamento);
    appendIfValid(formData, "_fechaAdquisicion", fechaAdquision);
    appendIfValid(formData, "_fechaAlta", fechaAlta);
    appendIfValid(formData, "_cotizacion", valor);
    appendIfValid(formData, "_cuenta", cuenta);
    appendIfValid(formData, "_vidaUtil", vidaUtil);
    appendIfValid(formData, "_fechaBaja", fechaBaja);
    appendIfValid(formData, "_tipoBaja", tipobaja);
    appendIfValid(formData, "_fechaPoliza", polizaFecha);
    appendIfValid(formData, "_fechaDocumentoPoliza", polizaDate);

    try {
      const response = await RegistrarArchivo(formData, "inv/registrar-bien");
      if (response.isSuccess) {
        setImg("");
        setDocumentoBaja("");
        setPolizaDocumento("");
        setSubcuenta("");
        setDescripcion("");
        setCodigoPartida("");
        setNumeroinv("");
        setObservaciones("");
        setUbicacion(0);
        setMarca(0);
        setModelo(0);
        setSerie("");
        setEstado("");
        setCostoAdquision("");
        setDespreciacion("");
        setValorLibros("");
        setFechaResguardo("");
        setDonativo(false);
        setMotivoResguardo("");
        setDepartamento(0);
        setFechaAlta(today.toISOString().split("T")[0]);
        setFechaAdquision("");
        setcantidad(1);
        setValor("");
        setCuenta("");
        setVidaUtil("");
        setFechaBaja("");
        setTipoBaja("");
        setPolizaDate("");
        setPolizaFecha("");
        toast.success("Registro exitoso");
      } else {
        console.log(response);
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: No se ha podido registrar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchivoPDF = (ev, tipo) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Por favor selecciona un archivo PDF válido.");
      ev.target.value = ""; // limpia el input
      setDocumentoBaja(null);
      return;
    }
    if (tipo === "baja") {
      setDocumentoBaja(file);
    // eslint-disable-next-line no-constant-condition
    } else if ("poliza") {
      setPolizaDocumento(file);
    }
  };

  const ObtenerUbcaciones = useCallback(async () => {
    try {
      const ubi = await ObtenerTipo("lugares");
      if (!ubi.isSuccess || !ubi.data?.length) return;
      const mappedUbicaciones = ubi.data.map((ubicacion) => ({
        id: ubicacion.lugarid,
        nombre: ubicacion.nombre,
      }));
      setListUbicaciones(mappedUbicaciones);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);
  const ObtenerModelo = useCallback(async () => {
    try {
      const mod = await ObtenerTipo("modelos");
      if (!mod.isSuccess || !mod.data?.length) return;
      const mappedModelo = mod.data.map((modelo) => ({
        id: modelo.modeloid,
        nombre: modelo.nombre,
      }));
      setListModelos(mappedModelo);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);
  const ObtenerMarcas = useCallback(async () => {
    try {
      const mar = await ObtenerTipo("marcas");
      if (!mar.isSuccess || !mar.data?.length) return;
      const mappedMarcas = mar.data.map((marca) => ({
        id: marca.marcaid,
        nombre: marca.nombre,
      }));
      setListMarcas(mappedMarcas);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);
  const ObtenerCuentas = useCallback(async () => {
    try {
      const cue = await ObtenerTipo("cuentas");
      if (!cue.isSuccess || !cue.data?.length) return;
      const mappedCuentas = cue.data.map((cuenta) => ({
        id: cuenta.departamentoid,
        nombre: cuenta.nombre,
      }));
      setListCuentas(mappedCuentas);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("No se ha podido cargar los datos");
    }
  }, []);

  useEffect(() => {
    ObtenerUbcaciones();
    ObtenerModelo();
    ObtenerMarcas();
    ObtenerCuentas();
  }, [ObtenerUbcaciones, ObtenerModelo, ObtenerMarcas, ObtenerCuentas]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 mt-15">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="material-icons text-white text-2xl">
                assignment_add
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Registar un item
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Define las características del nuevo item
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-600 transition-all duration-300"
            style={{ width: `80%` }}
          />
        </div>
      </div>

      <form
        className="space-y-8"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">info</span>
              Información Básica
            </h2>
          </div>

          <div className="p-6">
            <fieldset className="w-full">
              <div className="grid grid-cols-3 gap-6">
                {/* Columna 1 – Imagen */}
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imagen del item
                  </label>
                  <label className="relative group cursor-pointer block">
                    <img
                      src={
                        img
                          ? typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                          : placeholder
                      }
                      alt="Imagen del item"
                      className="w-full h-40 object-cover rounded-xl border-2 border-emerald-300 shadow-sm transition group-hover:brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-icons text-white text-4xl">
                        upload
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(ev) => {
                        const file = ev.target.files[0];
                        if (file?.type.startsWith("image/")) {
                          setImg(file);
                        } else {
                          toast.error(
                            "Por favor selecciona una imagen válida.",
                          );
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  <p className="text-xs text-gray-400 text-center">
                    Haz clic para cambiar la imagen
                  </p>
                </div>

                {/* Columna 2 – Descripción */}
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción del item
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        description
                      </span>
                    </div>
                    <textarea
                      placeholder="Descripción del item..."
                      value={descripcion}
                      onChange={(ev) => {
                        setDescripcion(ev.target.value);
                        validateField("descripcion", ev.target.value);
                      }}
                      required
                      maxLength={200}
                      className="block w-full h-40 pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {descripcion.length}/200
                  </p>
                  {errors.descripcion?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.descripcion.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Columna 3 – otros */}
                <div className="flex flex-col gap-2">
                  {/* subcuenta */}
                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700">
                      Subcuenta armonizada
                    </label>
                    <div className="relative">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          account_balance
                        </span>
                      </div>
                      <input
                        type="number"
                        value={subcuenta}
                        onChange={(e) => {
                          setSubcuenta(e.target.value);
                          validateField("subcuenta", e.target.value);
                        }}
                        placeholder="Ej: 1234"
                        min={0}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                      />
                    </div>
                    {errors.subcuenta?.length > 0 && (
                      <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                        {errors.subcuenta.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </fieldset>
                  {/* numero de inventario */}
                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700">
                      Numero de inventario
                    </label>
                    <div className="relative">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          qr_code_scanner
                        </span>
                      </div>
                      <input
                        type="number"
                        value={numeroInv}
                        onChange={(e) => {
                          setNumeroinv(e.target.value);
                          validateField("numeroInv", e.target.value);
                        }}
                        required
                        placeholder="Ej: 203001418"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                      />
                    </div>
                    {errors.numeroInv?.length > 0 && (
                      <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                        {errors.numeroInv.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </fieldset>
                  {/* estado */}
                  <fieldset>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <div className="relative">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span
                          className={`material-icons text-sm ${
                            estado === "Bueno"
                              ? "text-green-600"
                              : estado === "Malo"
                                ? "text-red-600"
                                : estado === "Obsoleto"
                                  ? "text-gray-500"
                                  : estado === "Regular"
                                    ? "text-yellow-500"
                                    : "text-gray-400"
                          }`}
                        >
                          {estado === "Bueno"
                            ? "check_circle"
                            : estado === "Malo"
                              ? "cancel"
                              : estado === "Obsoleto"
                                ? "block"
                                : estado === "Regular"
                                  ? "hourglass_empty"
                                  : "help_outline"}
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                        value={estado}
                        onChange={(e) => {
                          setEstado(e.target.value);
                          validateField("estado", e.target.value);
                        }}
                        required
                      >
                        <option value="" className="text-gray-500">
                          Selecciona el estado
                        </option>
                        <option value="Bueno" className="text-gray-700">
                          Bueno
                        </option>
                        <option value="Malo" className="text-gray-700">
                          Malo
                        </option>
                        <option value="Obsoleto" className="text-gray-700">
                          Obsoleto
                        </option>
                        <option value="Regular" className="text-gray-700">
                          Regular
                        </option>
                      </select>
                    </div>
                    {errors.estado?.length > 0 && (
                      <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                        {errors.estado.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </fieldset>
                </div>
              </div>
            </fieldset>
            <div className="grid grid-cols-3 gap-6 p-3 w-full">
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Codigo de partida
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        code
                      </span>
                    </div>
                    <input
                      type="text"
                      value={codigoPartida}
                      onChange={(e) => {
                        setCodigoPartida(e.target.value);
                        validateField("codigoPartida", e.target.value);
                      }}
                      required
                      placeholder="Ej: 1540-1428"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.codigoPartida?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.codigoPartida.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Ubicación
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          location_on
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                        value={ubicacion}
                        onChange={(e) => {
                          setUbicacion(e.target.value);
                        }}
                        required
                      >
                        <option value="" className="text-gray-500">
                          Selecciona una ubicación
                        </option>
                        {listUbicaciones.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                            className="text-gray-700"
                          >
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUbicacionModal(true)}
                      className="px-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group"
                    >
                      <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                        add
                      </span>
                    </button>
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        notes
                      </span>
                    </div>
                    <input
                      type="text"
                      value={observaciones}
                      onChange={(e) => {
                        setObservaciones(e.target.value);
                        validateField("observaciones", e.target.value);
                      }}
                      placeholder="Escribe una observación"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.observaciones?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.observaciones.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 p-3 w-full">
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Cantidad
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        tag
                      </span>
                    </div>
                    <input
                      type="number"
                      value={cantidad}
                      onChange={(e) => {
                        setcantidad(e.target.value);
                        validateField("cantidad", e.target.value);
                      }}
                      required
                      placeholder="Cantidad de item"
                      min={1}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.cantidad?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.cantidad.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Marca
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          branding_watermark
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                        value={marca}
                        onChange={(e) => {
                          setMarca(e.target.value);
                        }}
                      >
                        <option value="" className="text-gray-500">
                          Selecciona una marca
                        </option>
                        {listMarcas.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                            className="text-gray-700"
                          >
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMarcaModal(true)}
                      className="px-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group"
                    >
                      <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                        add
                      </span>
                    </button>
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          precision_manufacturing
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                        value={modelo}
                        onChange={(e) => {
                          setModelo(e.target.value);
                        }}
                      >
                        <option value="" className="text-gray-500">
                          Selecciona un modelo
                        </option>
                        {listModelos.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                            className="text-gray-700"
                          >
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowModeloModal(true)}
                      className="px-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group"
                    >
                      <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                        add
                      </span>
                    </button>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 p-3 w-full">
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Numero de serie
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        qr_code
                      </span>
                    </div>
                    <input
                      type="text"
                      value={serie}
                      onChange={(e) => {
                        setSerie(e.target.value);
                        validateField("serie", e.target.value);
                      }}
                      placeholder="Ej: 1UTFG-X780JK-LM0012"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.serie?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.serie.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor en libros
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        book
                      </span>
                    </div>
                    <input
                      type="number"
                      value={valorLibros}
                      onChange={(e) => {
                        setValorLibros(e.target.value);
                        validateField("valorLibros", e.target.value);
                      }}
                      placeholder="Ej: 100.00"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.valorLibros?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.valorLibros.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Despreciacion
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        trending_down
                      </span>
                    </div>
                    <input
                      type="number"
                      value={despreciacion}
                      onChange={(e) => {
                        setDespreciacion(e.target.value);
                        validateField("despreciacion", e.target.value);
                      }}
                      placeholder="Ej: 123.01"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.despreciacion?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.despreciacion.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 p-3 w-full">
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Cuenta (Tipo de bien)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <span className="material-icons text-gray-400 text-sm">
                          category
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                        value={departamento}
                        onChange={(e) => {
                          setDepartamento(e.target.value);
                        }}
                      >
                        <option value="" className="text-gray-500">
                          Selecciona una cuenta
                        </option>
                        {listCuentas.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                            className="text-gray-700"
                          >
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCuentaModal(true)}
                      className="px-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 
                           rounded-xl text-emerald-600 transition-all duration-200 
                           hover:border-emerald-300 hover:scale-105 active:scale-95
                           flex items-center justify-center group"
                    >
                      <span className="material-icons text-2xl group-hover:rotate-90 transition-transform duration-300">
                        add
                      </span>
                    </button>
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Valor cotización
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        request_quote
                      </span>
                    </div>
                    <input
                      type="number"
                      value={valor}
                      onChange={(e) => {
                        setValor(e.target.value);
                        validateField("valor", e.target.value);
                      }}
                      placeholder="Ej: 100.00"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.valor?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.valor.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Cuenta Dep.
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        account_balance_wallet
                      </span>
                    </div>
                    <input
                      type="text"
                      value={cuenta}
                      onChange={(e) => {
                        setCuenta(e.target.value);
                        validateField("cuenta", e.target.value);
                      }}
                      placeholder="Ej: 1.21.4.0"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.cuenta?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.cuenta.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 p-3 w-full">
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de alta
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        event_available
                      </span>
                    </div>
                    <input
                      type="date"
                      value={fechaAlta}
                      onChange={(e) => setFechaAlta(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Años de vida util
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none">
                      <span className="material-icons text-gray-400 text-sm">
                        history
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vidaUtil}
                      onChange={(e) => {
                        setVidaUtil(e.target.value);
                        validateField("vidaUtil", e.target.value);
                      }}
                      min={0}
                      placeholder="Ej: 1"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                    />
                  </div>
                  {errors.vidaUtil?.length > 0 && (
                    <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                      {errors.vidaUtil.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </fieldset>
              </div>
              <div className="flex flex-col gap-2">
                <fieldset>
                  <label className="block text-sm font-medium text-gray-700">
                    Donativo
                  </label>
                  <div className="relative">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={donativo}
                          onChange={(e) => setDonativo(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
        {/* Adquisicion */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">
                shopping_cart
              </span>
              Adquisición
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 p-3 w-full">
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Costo de adquisición
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      attach_money
                    </span>
                  </div>
                  <input
                    type="number"
                    value={costoAdquidsion}
                    onChange={(e) => {
                      setCostoAdquision(e.target.value);
                      validateField("costoAdquidsion", e.target.value);
                    }}
                    placeholder="Ej: 1000.00"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
                {errors.costoAdquidsion?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.costoAdquidsion.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de adquisición
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      calendar_today
                    </span>
                  </div>
                  <input
                    type="date"
                    value={fechaAdquision}
                    onChange={(e) => setFechaAdquision(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {/* Resguardo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">
                security
              </span>
              Resguardo
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 p-3 w-full">
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de resguardo
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      event
                    </span>
                  </div>
                  <input
                    type="date"
                    value={fechaResguardo}
                    onChange={(e) => setFechaResguardo(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo de resguardo
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      inventory_2
                    </span>
                  </div>
                  <input
                    type="text"
                    value={motivoResguardo}
                    onChange={(e) => {
                      setMotivoResguardo(e.target.value);
                      validateField("motivoResguardo", e.target.value);
                    }}
                    placeholder="Ej: Obsoleto"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
                {errors.motivoResguardo?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.motivoResguardo.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </fieldset>
            </div>
          </div>
        </div>

        {/* Baja */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">
                remove_circle
              </span>
              Baja
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 p-3 w-full">
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de baja
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      assignment_return
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tipobaja}
                    onChange={(e) => {
                      setTipoBaja(e.target.value);
                      validateField("tipobaja", e.target.value);
                    }}
                    placeholder="Ej: Daño"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
                {errors.tipobaja?.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                    {errors.tipobaja.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de baja
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      event_busy
                    </span>
                  </div>
                  <input
                    type="date"
                    value={fechaBaja}
                    onChange={(e) => setFechaBaja(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Documento de baja
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      article
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(ev) => {
                      handleArchivoPDF(ev, "baja");
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
                {documentoBaja && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setArchivo({
                          tipo: "Documento de baja",
                          file: documentoBaja,
                        });
                        setShowPdf(true);
                      }}
                      className="text-emerald-700 hover:underline text-sm"
                    >
                      Ver documento
                    </button>
                  </>
                )}
              </fieldset>
            </div>
          </div>
        </div>

        {/* Polizas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="material-icons text-emerald-600 mr-2">
                policy
              </span>
              Poliza
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-6 p-3 w-full">
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Poliza
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      date_range
                    </span>
                  </div>
                  <input
                    type="date"
                    value={polizaFecha}
                    onChange={(e) => setPolizaFecha(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de documento
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      receipt_long
                    </span>
                  </div>
                  <input
                    type="date"
                    value={polizaDate}
                    onChange={(e) => setPolizaDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
              </fieldset>
            </div>
            <div className="flex flex-col gap-2">
              <fieldset>
                <label className="block text-sm font-medium text-gray-700">
                  Documento de poliza
                </label>
                <div className="relative">
                  <div className="absolute top-2.5 left-3 pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">
                      assignment
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(ev) => {
                      handleArchivoPDF(ev, "poliza");
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow sm:text-sm"
                  />
                </div>
                {polizaDocumento && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setArchivo({
                          tipo: "Documento de poliza",
                          file: polizaDocumento,
                        });
                        setShowPdf(true);
                      }}
                      className="text-emerald-700 hover:underline text-sm"
                    >
                      Ver documento
                    </button>
                  </>
                )}
              </fieldset>
            </div>
          </div>
        </div>
        {/* Acciones del formulario */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              px-6 py-2 rounded-lg text-sm font-medium text-white 
              flex items-center space-x-2 transition-all
              ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg"
              }
            `}
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
                <span className="material-icons text-sm">save</span>
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </form>
      {showPdf && (
        <ModalPDFViewer
          titulo={archivo.tipo}
          archivo={archivo.file}
          onClose={() => setShowPdf(false)}
        />
      )}
      {showUbicacionModal && (
        <UbicacionModal
          reload={ObtenerUbcaciones}
          setShowModal={setShowUbicacionModal}
        />
      )}
      {showModeloModal && (
        <ModeloModal reload={ObtenerModelo} setShowModal={setShowModeloModal} />
      )}
      {showMarcaModal && (
        <MarcaModal reload={ObtenerMarcas} setShowModal={setShowMarcaModal} />
      )}
      {showCuentaModal && (
        <CuentaModal
          reload={ObtenerCuentas}
          setShowModal={setShowCuentaModal}
        />
      )}
    </div>
  );
}
