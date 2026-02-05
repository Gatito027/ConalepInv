import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fondo from "../../assets/Background.png";

export default function LoginComponent() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="backdrop-blur-sm bg-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-4xl font-bold text-center text-emerald-600 mb-6">
          Acceder a la cuenta
        </h1>
        <form className="space-y-6">
          <div>
            <p>Usuario</p>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <p>Contraseña</p>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
