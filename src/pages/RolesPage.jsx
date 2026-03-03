import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RolesComponent from "../components/Roles/RolesComponent";

export default function RolesPage(){
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

  return <RolesComponent />;
}