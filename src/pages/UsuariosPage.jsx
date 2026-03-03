import UsuariosComponent from "../components/Usuarios/UsuariosComponent";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UsuariosPage(){
    const { userPermisos = [] } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(userPermisos)) return;

    const tieneAmbosPermisos =
      userPermisos.includes("Usuarios");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

    return <UsuariosComponent />;
}