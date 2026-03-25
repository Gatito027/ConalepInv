import { useState } from "react";
import { CopyToClipboard } from "../../utils/copyToClipboard";
import ModalPDFViewer from "../NuevoItem/ModalPDFViewer";

export default function FileCardComponent({ file, icon, description }) {
  const [showArchivo, setShowArchivo] = useState(false);
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Barra superior animada */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-emerald-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icono y título */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-emerald-500 text-xl">
                {icon}
              </span>
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {description}
              </h4>
            </div>

            {/* Texto de observaciones con copia */}
            <div className="relative">
              {file ? (<button
                onClick={() => setShowArchivo(true)}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-200">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">
                    Ver documento
                  </p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </button>) : <p className="text-base text-gray-800 leading-relaxed wrap-break-word pr-12">
                Sin información
              </p>}

              {/* Botón de copiar */}
              <button
                onClick={() => CopyToClipboard(file)}
                disabled={!file}
                className={`absolute top-0 right-0 p-2 rounded-md transition-all duration-200
                      ${
                        file
                          ? "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                title={`Copiar url de ${description}`}
              >
                <span className="material-icons text-lg">
                  {file ? "content_copy" : "content_paste_off"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showArchivo && (
        <ModalPDFViewer
          titulo={description}
          archivo={file}
          onClose={() => setShowArchivo(false)}
        />
      )}
    </div>
  );
}
