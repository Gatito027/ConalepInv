import { useEffect, useState, useMemo } from "react";

export default function ModalPDFViewer({ titulo, archivo, onClose }) {
  const [fetchedSrc, setFetchedSrc] = useState(null);

  // Para Blobs locales: se deriva directamente sin efecto
  const blobSrc = useMemo(() => {
    if (archivo instanceof Blob) return URL.createObjectURL(archivo);
    return null;
  }, [archivo]);

  // Solo se usa efecto para operaciones asíncronas (fetch)
  useEffect(() => {
    if (typeof archivo !== "string") return;

    let objectUrl = null;
    let cancelled = false;

    fetch(archivo, { credentials: "include" })
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setFetchedSrc(objectUrl);
      })
      .catch((err) => console.error("Error cargando PDF:", err));

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [archivo]);

  // Limpiar blobSrc cuando cambie
  useEffect(() => {
    return () => {
      if (blobSrc) URL.revokeObjectURL(blobSrc);
    };
  }, [blobSrc]);

  // Determinar src final
  const src = typeof archivo === "string" ? fetchedSrc : blobSrc;

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
