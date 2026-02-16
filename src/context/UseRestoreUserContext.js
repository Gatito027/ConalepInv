import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUsuario, useArea, useNombre, usePermisos, useRol, useSub } from "./UseUserData";
import { RecuperarPerfil } from "../infrastructure/RecuperarPerfil";

export function UseRestoreUserContext() {
  const { setUsuario } = useUsuario(); 
  const { setArea } = useArea(); 
  const { setNombre } = useNombre(); 
  const { setPermisos } = usePermisos(); 
  const { setRol } = useRol(); 
  const { setSub } = useSub();

  useEffect(() => {
    const restore = async () => {
      const token = Cookies.get("token");
      //console.log(token);

      if (!token) {
        console.warn("No se encontró token en cookies");
        return;
      }

      try {
        const result = await RecuperarPerfil();
        //console.log(result);

        if (result.isSuccess && result.data) {
          const { permisos, rol, area_acargo, nombre, nombreusuario, usuarioid } = result.data;
          setUsuario(nombreusuario);
          setArea(area_acargo);
          setNombre(nombre);
          setPermisos(permisos);
          setRol(rol);
          setSub(usuarioid);
          console.info("Perfil restaurado correctamente desde cookie");
        } else {
          console.warn("Token inválido o expirado, eliminando cookie");
          Cookies.remove("token");
        }
      } catch (error) {
        console.error("Error al restaurar perfil:", error);
        Cookies.remove("token");
      }
    };

    restore();
  }, [setUsuario, setArea, setNombre, setPermisos, setRol, setSub]);
}
