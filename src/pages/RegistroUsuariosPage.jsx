import RegistroUsuariosComponent from "../components/RegistroUsuarios/RegistroUsuariosComponent";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistroUsuariosPage() {
  const { userPermisos = [] } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(userPermisos)) return;

    const tieneAmbosPermisos =
      userPermisos.includes("Usuarios") && userPermisos.includes("Registrar Usuarios");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

  return <RegistroUsuariosComponent />;
}