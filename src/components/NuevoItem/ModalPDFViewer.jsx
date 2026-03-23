export default function ModalPDFViewer({ titulo, archivo, onClose }) {
  if (!archivo) return null;

  let src = null;

  if (typeof archivo === "string") {
    // Es un enlace directo
    src = archivo;
  } else if (archivo instanceof Blob) {
    // Es un archivo local
    src = URL.createObjectURL(archivo);
  } else {
    console.warn("Tipo de archivo no soportado:", archivo);
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
        <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-4 relative">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                     bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 
                     hover:text-gray-700 transition-all duration-200 hover:rotate-90"
          >
            <span className="material-icons">close</span>
          </button>
        <h2 className="text-xl font-semibold text-emerald-600 mb-4">
          Visualizando: {titulo}
        </h2>
        {src ? (
          <embed
            src={src}
            type="application/pdf"
            className="w-full h-125 border rounded mb-4"
          />
        ) : (
          <p className="text-red-500">No se pudo cargar el PDF.</p>
        )}
      </div>
    </div>
  );
}