import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import fondo from "../../assets/Background.png";
import { UserContext } from "../../context/UserContext";
import { Login } from "../../infrastructure/Login";

export default function LoginComponent() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { setUsuario, setSub, setArea, setNombre, setPermisos, setRol } =
    useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await Login({
        user,
        password,
      });
      //console.log(result);
      if (!result.isSuccess) {
        setError(result.message);
        console.log(result.errorData);
      } else {
        setUsuario(result.data.nombreusuario);
        setArea(result.data.area_acargo);
        setSub(result.data.usuarioid);
        setNombre(result.data.nombre);
        setRol(result.data.rol);
        setPermisos(result.data.permisos);
        //console.log("exito", result);
        navigate("/");
      }

    } catch (error) {
      setError("Servicio no disponible");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="backdrop-blur-sm bg-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h1 className="text-4xl font-bold text-center text-emerald-600 mb-6">
          Acceder a la cuenta
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <p>Usuario</p>
            <input
              type="text"
              placeholder="usuario"
              value={user}
              onChange={(ev) => setUser(ev.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <p>Contraseña</p>
            <div className="relative w-full">
              <input
                type={!showPassword ? "password" : "text"}
                placeholder="Contraseña"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                required
              />
              {(isPasswordFocused || password.length > 0) && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? (
                    <span className="material-icons text-base sm:text-lg">
                      visibility_off
                    </span>
                  ) : (
                    <span className="material-icons text-base sm:text-lg">
                      visibility
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Espere...
                </div>
              ) : (
                "Acceder"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
