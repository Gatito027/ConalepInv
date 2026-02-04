import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserContextProvider({ children }) {
  const [sub, setSub] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [area, setArea] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState(null);

  return (
    <UserContext.Provider
      value={{
        sub,
        setSub,
        usuario,
        setUsuario,
        nombre,
        setNombre,
        area, setArea,
        rol,
        setRol,
        permisos,
        setPermisos
      }}
    >
      {children}
    </UserContext.Provider>
  );
}