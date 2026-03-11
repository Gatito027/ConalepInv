import { CopyToClipboard } from "../../utils/copyToClipboard";

export default function ContentCardComponent({ content, icon, description }) {
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
              <p className="text-base text-gray-800 leading-relaxed wrap-break-word pr-12">
                {content || "Sin información"}
              </p>

              {/* Botón de copiar */}
              <button
                onClick={() => CopyToClipboard(content)}
                disabled={!content}
                className={`absolute top-0 right-0 p-2 rounded-md transition-all duration-200
                      ${
                        content
                          ? "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                title={`Copiar ${description}`}
              >
                <span className="material-icons text-lg">
                  {content ? "content_copy" : "content_paste_off"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
