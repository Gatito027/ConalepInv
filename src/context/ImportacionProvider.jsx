import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { ImportacionContext } from "./ImportacionContext";

export function ImportacionProvider({ children }) {
  const socketRef = useRef(null);
  const toastIdRef = useRef(null);
  const [resumen, setResumen] = useState(null);
  const [importando, setImportando] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_CONALEP_API, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("importacion:inicio", ({ total }) => {
      setImportando(true);
      setResumen({ total, registrados: 0, warns: 0, errores: 0 });
      toastIdRef.current = toast.loading(`Importando 0 de ${total}...`, {
        duration: Infinity,
        position: "bottom-right",
      });
    });

    socket.on("importacion:progreso", ({ total, registrados, warns, errores }) => {
      setResumen({ total, registrados, warns, errores });
      toast.loading(
        <div className="text-sm">
          <p className="font-semibold mb-1">
            Importando... {registrados + errores} de {total}
          </p>
          <div className="flex gap-3">
            <span className="text-green-600">✅ {registrados}</span>
            <span className="text-yellow-500">⚠️ {warns}</span>
            <span className="text-red-500">❌ {errores}</span>
          </div>
        </div>,
        { id: toastIdRef.current, duration: Infinity, position: "bottom-right" }
      );
    });

    socket.on("importacion:fin", ({ total, registrados, warns, errores }) => {
      setImportando(false);
      setResumen({ total, registrados, warns, errores });
      toast.dismiss(toastIdRef.current);

      const hayErrores = errores > 0;
      const soloWarns = errores === 0 && warns > 0;

      if (hayErrores) {
        toast.error(
          <div className="text-sm">
            <p className="font-semibold">Importación finalizada con errores</p>
            <div className="flex gap-3 mt-1">
              <span className="text-green-600">✅ {registrados}</span>
              <span className="text-yellow-500">⚠️ {warns}</span>
              <span className="text-red-500">❌ {errores}</span>
            </div>
          </div>,
          { duration: 8000, position: "bottom-right" }
        );
      } else if (soloWarns) {
        toast(
          <div className="text-sm">
            <p className="font-semibold">Importación con advertencias</p>
            <div className="flex gap-3 mt-1">
              <span className="text-green-600">✅ {registrados}</span>
              <span className="text-yellow-500">⚠️ {warns}</span>
            </div>
          </div>,
          { icon: "⚠️", duration: 8000, position: "bottom-right" }
        );
      } else {
        toast.success(
          <div className="text-sm">
            <p className="font-semibold">Importación exitosa</p>
            <span className="text-green-600">✅ {registrados} registros</span>
          </div>,
          { duration: 6000, position: "bottom-right" }
        );
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <ImportacionContext.Provider value={{ resumen, importando }}>
      {children}
    </ImportacionContext.Provider>
  );
}