import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUsuario = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsuario debe usarse dentro de UserContextProvider");
  }
  return { userUsuario: context.usuario, setUsuario: context.setUsuario };
};

export const useNombre = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useNombre debe usarse dentro de UserContextProvider");
  }
  return { userNombre: context.nombre, setNombre: context.setNombre };
};

export const useArea = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useArea debe usarse dentro de UserContextProvider");
  }
  return { userArea: context.area, setArea: context.setArea };
};

export const usePermisos = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("usePermisos debe usarse dentro de UserContextProvider");
  }
  return { userPermisos: context.permisos, setPermisos: context.setPermisos };
};

export const useRol = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useRol debe usarse dentro de UserContextProvider");
  }
  return { userRol: context.rol, setRol: context.setRol };
};

export const useSub = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useSub debe usarse dentro de UserContextProvider");
  }
  return { userSub : context.sub, setSub: context.setSub}
};