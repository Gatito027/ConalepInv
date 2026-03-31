import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrModal({ setBusqueda, setShowModal }) {
  const handleScan = (detectedCodes) => {
    detectedCodes.forEach((code) => {
      //console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
      setBusqueda(code.rawValue);
    });
    setShowModal(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop con efecto mejorado */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />
      {/* Modal con diseño mejorado */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* Cabecera con icono de advertencia */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <span className="material-icons text-emerald-600 text-3xl">
              qr_code
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Escannear Qr</h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 flex items-center gap-2">
            <span className="material-icons text-gray-400 text-xl">info</span>
            Busca un articulo apatir de un codigo Qr
          </p>
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
          />

          {/* Botones con iconos y mejor distribución */}
          <div className="flex gap-3 justify-end mt-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="material-icons text-xl">close</span>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
