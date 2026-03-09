import LoadingPageComponent from "../Others/LoadingPageComponent";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePermisos } from "../../context/UseUserData";
import NoRolesComponent from "./NoRolesComponent";
import ListaRolesComponent from "./ListRolesComponent";
import { ListaRoles } from "../../infrastructure/ListaRoles";

export default function RolesComponent() {
  const { userPermisos } = usePermisos();
  const [busqueda, setBusqueda] = useState("");
  const [roles, setRoles] = useState([]);
  const navigate= useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const rolesFiltrados = roles.filter((rol) => {
    const coincideNombre = rol.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincidePermiso = Array.isArray(rol.permisos)
    ? rol.permisos
        .filter(Boolean) // elimina null o undefined
        .some((permiso) =>
          permiso.toLowerCase().includes(busqueda.toLowerCase())
        )
    : false;

    return coincideNombre || coincidePermiso;
  });

  const fetchdata = useCallback (async () => {
    try {
      const response = await ListaRoles();
      
      if (!response.isSuccess || !response.data?.length) return;

      const mappedRoles = response.data.map((rol) => ({
        id: rol.rolid,
        nombre: rol.nombre,
        permisos: rol.permisos,
      }));
      setRoles(mappedRoles);
    } catch (error) {
      console.error("Error al cargar los roles:", error);
      toast.error("No se ha podido cargar los roles");
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  useEffect(()=>{
    fetchdata();
  }, [fetchdata]);

  if (!Array.isArray(userPermisos)) return <h1 className="mt-15">No cuentas con permisos</h1>;

  if(isLoadingPage) return <LoadingPageComponent />;

  return (
    <div className="max-w-6xl mx-auto mt-20 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-3xl">
      {/* Header con gradiente mejorado */}
      <div className="bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-700 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm mr-4">
              <span className="material-icons text-white text-3xl">
                format_list_bulleted
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Gestión de Roles
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Administra los permisos del sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold flex items-center">
                <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
                Total:{" "}
                <span className="ml-1 text-emerald-100 font-bold">{rolesFiltrados.length} Roles</span>
              </span>
            </div>

            { userPermisos.includes("Crear rol") && (
            <button
              onClick={() => navigate("registro")}
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 group"
            >
              <span className="material-icons text-lg">
                format_list_bulleted_add
              </span>
              <span>Agregar Rol</span>
              <span className="material-icons text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>)}
          </div>
        </div>
      </div>

      {/*Buscador*/}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar rol"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>
      {/* Sección de contenido (placeholder) */}
      <ListaRolesComponent reload={fetchdata} roles={rolesFiltrados} />
      {rolesFiltrados.length <= 0 && <NoRolesComponent />}

      {/* Footer de la tabla */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons text-emerald-500 text-base mr-2">
              info
            </span>
            <span>Mostrando {rolesFiltrados.length} de {roles.length} roles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
