import { useState, useEffect } from "react";

export default function ModalPDFViewer({ titulo, archivo, onClose }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!archivo) {
      setSrc(null);
      return;
    }

    if (typeof archivo === "string") {
      // Es un enlace directo
      fetch(archivo, { credentials: "include" })
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setSrc(url);
        })
        .catch(err => console.error("Error cargando PDF:", err));
    } else if (archivo instanceof Blob) {
      // Es un archivo local
      const url = URL.createObjectURL(archivo);
      setSrc(url);
    } else {
      console.warn("Tipo de archivo no soportado:", archivo);
      setSrc(null);
    }

    // Limpieza: revocar URL cuando cambie o se desmonte
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [archivo]);

  if (!archivo) return null;

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
          <iframe
            src={src}
            className="w-full h-125 border rounded mb-4"
            title="PDF Viewer"
          />
        ) : (
          <p className="text-red-500">No se pudo cargar el PDF.</p>
        )}
      </div>
    </div>
  );
}