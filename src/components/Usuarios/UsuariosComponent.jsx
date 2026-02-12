import NoUsersComponent from "./NoUsersComponent";
import ListUsuarioComponent from "./ListUsuariosComponent";
import LoadingPageComponent from "../Others/LoadingPageComponent";
import { ListaUsuarios } from "../../infrastructure/ListaUsuarios";
import { usePermisos } from "../../context/UseUserData";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UsuariosComponent() {
  const { userPermisos } = usePermisos();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideNombre = usuario.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideArea = usuario.areacargo
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideRol = usuario.rol
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideUsuario = usuario.nombreusuario
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideNombre || coincideArea || coincideRol || coincideUsuario;
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await ListaUsuarios();
      console.log(response);
      if (!response.isSuccess || !response.data?.length) return;

      const mappedUsuarios = response.data.map((usuario) => ({
        id: usuario.usuarioid,
        nombre: usuario.nombre,
        nombreusuario: usuario.nombreusuario,
        alta: usuario.alta,
        rol: usuario.rol,
        areacargo: usuario.areacargo,
      }));
      setUsuarios(mappedUsuarios);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      toast.error("No se ha podido cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Si no hay permisos, redirige al inicio
  }, [fetchData]);

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-3xl">
      {/* Header con gradiente mejorado */}
      <div className="bg-linear-to-r from-emerald-500 via-emerald-600 to-emerald-700 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mr-4">
              <span className="material-icons text-white text-3xl">group</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Gestión de Usuarios
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Administra los usuarios del sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold flex items-center">
                <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
                Total:{" "}
                <span className="ml-1 text-emerald-100 font-bold">
                  {usuariosFiltrados.length} Usuarios
                </span>
              </span>
            </div>

            <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 group">
              <span className="material-icons text-lg">person_add</span>
              <span>Agregar Usuario</span>
              <span className="material-icons text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/*Buscador*/}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Nombre */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
      {/* Sección de contenido (placeholder) */}
      <ListUsuarioComponent
        usuarios={usuariosFiltrados}
        busqueda={busqueda}
        permisos={usePermisos}
      />
      {usuariosFiltrados.length <= 0 && <NoUsersComponent />}
      {/* Footer de la tabla */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons text-emerald-500 text-base mr-2">
              info
            </span>
            <span>
              Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
