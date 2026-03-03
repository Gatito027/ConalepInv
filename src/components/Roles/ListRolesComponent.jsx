import { Link } from "react-router-dom";
import { useState } from "react";
import { usePermisos } from "../../context/UseUserData";

export default function ListaRolesComponent({ roles, reload }) {
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
                Permisos
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr
                className="border-b border-gray-100 hover:bg-emerald-50 transition-all duration-200"
                key={rol.id}
              >
                <td className="p-4 align-top">
                  <div className="flex items-start space-x-4 group">
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center">
                        <span className="material-icons text-white text-2xl drop-shadow-md">
                          admin_panel_settings
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate group-hover:text-emerald-700 transition-colors duration-200">
                          {rol.nombre}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1 sm:mt-0 sm:ml-2">
                          {Array.isArray(rol.permisos) &&
                          rol.permisos.filter(Boolean).length > 0
                            ? `${rol.permisos.filter(Boolean).length} permisos`
                            : "Sin permisos"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4 align-top">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.isArray(rol.permisos) &&
                    rol.permisos.filter(Boolean).length > 0 ? (
                      <>
                        {/* Mostrar solo los primeros 2 permisos válidos */}
                        {rol.permisos
                          .filter(Boolean) // elimina null o undefined
                          .slice(0, 2)
                          .map((permiso, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-200 cursor-default shadow-sm"
                            >
                              <span className="material-icons text-sm mr-1.5 text-gray-500 group-hover:text-emerald-500">
                                check_circle
                              </span>
                              {permiso}
                            </span>
                          ))}

                        {/* Mostrar contador si hay más de 2 permisos */}
                        {rol.permisos.filter(Boolean).length > 2 && (
                          <span
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                            title={`${rol.permisos.filter(Boolean).length - 2} permisos más: ${rol.permisos
                              .filter(Boolean)
                              .slice(2)
                              .join(", ")}`}
                          >
                            <span className="material-icons text-sm mr-1.5">
                              more_horiz
                            </span>
                            +{rol.permisos.filter(Boolean).length - 2} más
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500 italic">Sin permisos</span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex justify-center space-x-2">
                    <Link
                      className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 hover:text-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                      title="Ver detalles del usuario"
                      to={`/usuarios/usu/${rol.id}`}
                    >
                      <span className="material-icons text-lg">visibility</span>
                    </Link>
                    <Link
                      className="flex items-center justify-center w-10 h-10 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 hover:text-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      title="Editar"
                      to={`/usuarios/editUsu/${rol.id}`}
                    >
                      <span className="material-icons text-lg">edit</span>
                    </Link>
                    <button
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
    </div>
  );
}
