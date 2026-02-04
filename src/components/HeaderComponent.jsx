import { Link } from "react-router-dom";
import MenuLayout from "./Layouts/MenuLayout";

export default function Header() {

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md px-4 py-2 flex justify-between items-center z-50 shadow-sm">
      {/* Logo y nombre */}
      <div className="flex items-center gap-x-2">
        <p className="text-black font-bold text-xl">ᓚᘏᗢ</p>
        <Link
          to="/"
          className="text-black font-semibold text-lg hover:text-emerald-600 transition-colors"
        >
          Conalep Inventarios
        </Link>
      </div>

      {/* Navegación */}
      <div className="hidden sm:flex items-center gap-x-4">
        <MenuLayout />
      </div>
    </nav>
  );
}
