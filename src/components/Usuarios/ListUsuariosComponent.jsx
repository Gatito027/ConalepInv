import { Link } from "react-router-dom";
import EliminarUsuarioModal from './EliminarUsuarioModal';
import { useState } from "react";
import CambiarPasswordModal from "./CambiarPasswordModal";

export default function ListUsuarioComponent({ usuarios, reload, permisos }) {
  const [deleteId, setDeleteId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  return (
    <div className="p-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-linear-to-r from-gray-50 to-emerald-50 border-b border-teal-200">
              <th className="p-4 font-semibold text-gray-700 text-left">
                Detalles
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Rol
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                className="border-b border-gray-100 hover:bg-emerald-50 transition-all duration-200"
                key={usuario.id}
              >
                <td className="p-4">
                  <div className="flex items-start space-x-4 group">
                    {/* Avatar mejorado con efecto hover */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 flex items-center justify-center">
                        <span className="material-icons text-white text-xl">
                          {usuario.avatar || "person"}
                        </span>
                      </div>
                    </div>

                    {/* Contenido mejorado con mejor estructura */}
                    <div className="flex-1 min-w-0">
                      {/* Nombre y usuario en una línea para desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {usuario.nombre}
                          <span className="text-sm text-gray-500 p-2 font-medium">
                            @{usuario.nombreusuario}
                          </span>
                        </h3>
                      </div>

                      {/* Grid para mejor organización en desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {/* Área/Cargo */}
                        <div className="flex items-center text-emerald-600">
                          <span className="material-icons text-emerald-500 text-base mr-2">
                            work_outline
                          </span>
                          <span className="text-sm truncate">
                            {usuario.areacargo}
                          </span>
                        </div>

                        {/* Fecha de alta con formato mejorado */}
                        <div className="flex items-center text-emerald-600">
                          <span className="material-icons text-emerald-500 text-base mr-2">
                            calendar_today
                          </span>
                          <span className="text-sm">
                            {new Date(usuario.alta).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="material-icons text-emerald-500 text-base mr-1">
                        flag
                      </span>
                      {usuario.rol}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-2">
                    <Link
                      className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 hover:text-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                      title="Ver detalles del usuario"
                      to={`/usuarios/usu/${usuario.id}`}
                    >
                      <span className="material-icons text-lg">visibility</span>
                    </Link>
                    <button
                      className="flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 hover:text-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      title="Editar"
                    >
                      <span className="material-icons text-lg">edit</span>
                    </button>
                    <button
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      title="Cambiar contraseña"
                      onClick={()=> {
                        setDeleteId(usuario.id);
                        setChangePassword(true);
                      }}
                    >
                      <span className="material-icons text-lg">vpn_key</span>
                    </button>
                    <button
                      onClick={() => {setShowModal(true);
                        setDeleteId(usuario.id);}
                      }
                      className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      title="Eliminar"
                    >
                      <span className="material-icons text-lg">cancel</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <EliminarUsuarioModal setShowModal={setShowModal} deleteId={deleteId} reload={reload} />
      )}
      {changePassword && (
        <CambiarPasswordModal usuarioId={deleteId} setShowModal={setChangePassword} />
      )}
    </div>
  );
}
