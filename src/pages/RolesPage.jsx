import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RolesComponent from "../components/Roles/RolesComponent";

export default function RolesPage(){
    const { userPermisos = [] } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay permisos o no es un array válido, redirige
    if (!userPermisos || !Array.isArray(userPermisos)) {
      navigate("/");
      return;
    }

    const tieneAmbosPermisos =
      userPermisos.includes("Roles");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);


  return <RolesComponent />;
}