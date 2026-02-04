import { useState } from "react";
import { Link } from "react-router-dom";

export default function MenuLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { to: "/", icon: "group", label: "Gestión de usuarios" },
    { to: "/", icon: "admin_panel_settings", label: "Gestión de roles" },
    { to: "/", icon: "inventory", label: "Gestión de inventario" },
    { to: "/perfil", icon: "account_circle", label: "Perfil" },
  ];

  const handleLogout = () => {
    // Aquí puedes limpiar el token, llamar a tu API de logout, etc.
    console.log("Cerrar sesión");
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-x-2 text-black hover:text-emerald-600 transition-transform hover:scale-105 text-sm sm:text-base"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="user-menu"
      >
        <span className="truncate"><span className="material-icons">menu</span></span>
      </button>

      {menuOpen && (
        <div
          id="user-menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center gap-x-3 px-4 py-3 w-full text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200 text-sm sm:text-base"
            >
              <span className="material-icons text-base sm:text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm sm:text-base"
          >
            <span className="material-icons text-lg sm:text-xl">logout</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}