import { Link } from "react-router-dom";
import MenuLayout from "./Layouts/MenuLayout";
import { useUsuario, useArea } from "../context/UseUserData";


export default function Header() {
  const { userUsuario } = useUsuario();
  const { userArea } = useArea();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md px-4 py-2 flex justify-between items-center z-50 shadow-sm">
      {/* Logo y nombre */}
      <div className="flex items-center gap-x-2">
        <p className="text-black font-bold text-xl">ᓚᘏᗢ</p>
        <Link
          to="/"
          className="text-black font-semibold text-lg hover:text-emerald-600 transition-colors"
        >
          Conalep 214 Inventario
        </Link>
      </div>

      {/* Navegación */}
      {userUsuario && (
        <div className="hidden sm:flex items-center gap-x-4">
          <div className="flex items-center gap-x-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
              {userUsuario?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">
                {userUsuario}
              </span>
              <span className="text-xs text-gray-600">{userArea}</span>
            </div>
          </div>
          <div>
            <MenuLayout />
          </div>
        </div>
      )}
    </nav>
  );
}
