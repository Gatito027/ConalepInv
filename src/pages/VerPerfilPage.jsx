import VerPerfilComponent from "../components/Perfil/VerPerfilComponent";
import { useNavigate } from "react-router-dom";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";

export default function VerPerfilPage(){
  const { userPermisos } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay permisos o no es un array válido, redirige
    if (!userPermisos || !Array.isArray(userPermisos)) {
      navigate("/");
      return;
    }

  }, [userPermisos, navigate]);

  return <VerPerfilComponent />;
}