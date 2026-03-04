import { useParams } from "react-router-dom";
import EditarUsuarioComponent from "../components/Usuarios/EditarUsuarioComponent";
import { usePermisos } from "../context/UseUserData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditarUsuarioPage(){
    const { id } = useParams();
    const { userPermisos = [] } = usePermisos();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay permisos o no es un array válido, redirige
    if (!userPermisos || !Array.isArray(userPermisos)) {
      navigate("/");
      return;
    }

    const tieneAmbosPermisos =
      userPermisos.includes("Usuarios") &&
      userPermisos.includes("Editar usuario");

    if (!tieneAmbosPermisos) {
      navigate("/");
    }
  }, [userPermisos, navigate]);

    return(
        <EditarUsuarioComponent usuarioId={id} />
    );
}